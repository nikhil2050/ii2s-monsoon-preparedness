import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rateLimiter";
import type { ChatMessage } from "@/types";

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

    if (!body || !body.message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const { message, history, language } = body;

    const systemContext = language
      ? `${CHAT_SYSTEM_PROMPT}\n\nThe user's preferred language is ${language}.`
      : CHAT_SYSTEM_PROMPT;

    const historyContext = (history ?? [])
      .map((m: ChatMessage) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const userMessage = historyContext
      ? `Previous conversation:\n${historyContext}\n\nNew message: ${message}`
      : message;

    const response = await callAI(systemContext, userMessage);

    return NextResponse.json({ success: true, data: { message: response } });
  } catch (err) {
    console.error("POST /api/chat:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
