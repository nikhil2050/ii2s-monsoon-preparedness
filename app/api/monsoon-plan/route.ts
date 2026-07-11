import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { PREPAREDNESS_PROMPT, buildPlanPrompt } from "@/lib/prompts";
import { parseJSON } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rateLimiter";
import { getWeatherForecast } from "@/lib/weatherApi";
import type { PreparednessPlan } from "@/types";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const { allowed, resetIn } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) } }
    );
  }

  try {
    const profile = await req.json();

    if (!profile || !profile.name || !profile.location) {
      return NextResponse.json(
        { success: false, error: "Name and location are required" },
        { status: 400 }
      );
    }

    const weather = await getWeatherForecast(profile.location);
    const weatherSummary = weather?.summary;

    const content = await callAI(PREPAREDNESS_PROMPT, buildPlanPrompt(profile, weatherSummary));
    const plan = parseJSON<PreparednessPlan>(content);

    return NextResponse.json({ success: true, data: plan, weather: weather?.forecast ?? null });
  } catch (err) {
    console.error("POST /api/monsoon-plan:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
