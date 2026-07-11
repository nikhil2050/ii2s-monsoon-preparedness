import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { CHECKLIST_PROMPT, buildChecklistPrompt } from "@/lib/prompts";
import { parseJSON } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rateLimiter";
import type { ChecklistResponse } from "@/types";

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

    if (!body || !body.phase || !["before", "during", "after"].includes(body.phase)) {
      return NextResponse.json(
        { success: false, error: "Valid phase (before/during/after) is required" },
        { status: 400 }
      );
    }

    if (!body.profile) {
      return NextResponse.json(
        { success: false, error: "User profile is required" },
        { status: 400 }
      );
    }

    const content = await callAI(CHECKLIST_PROMPT, buildChecklistPrompt(body.phase, body.profile));
    const data = parseJSON<ChecklistResponse>(content);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("POST /api/checklist:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
