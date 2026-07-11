import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/openrouter";
import { ADVISORY_PROMPT, buildAdvisoryPrompt } from "@/lib/prompts";
import { parseJSON } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rateLimiter";
import type { Advisory } from "@/types";

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
    const body = await req.json();

    if (!body || !body.origin || !body.destination || !body.date) {
      return NextResponse.json(
        { success: false, error: "Origin, destination, and date are required" },
        { status: 400 }
      );
    }

    const content = await callAI(ADVISORY_PROMPT, buildAdvisoryPrompt(body.origin, body.destination, body.date));
    const advisory = parseJSON<Advisory>(content);

    return NextResponse.json({ success: true, data: advisory });
  } catch (err) {
    console.error("POST /api/advisory:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
