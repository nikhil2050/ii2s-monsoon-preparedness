"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/types";

interface ChatWidgetProps {
  language?: string;
}

const LANG_MAP: Record<string, string> = {
  English: "EN",
  Hindi: "HI",
  Marathi: "MR",
};

function detectLanguage(text: string): string {
  const devanagari = /[\u0900-\u097F]/;
  if (devanagari.test(text)) {
    const marathiWords = ["आहे", "नाही", "का", "हो", "मी", "तू", "आम्ही"];
    const hasMarathi = marathiWords.some((w) => text.includes(w));
    const detected = hasMarathi ? "MR" : "HI";
    console.log("[MonsoonReady] ChatWidget: detected devanagari script", { detected, textLength: text.length });
    return detected;
  }
  return "EN";
}

export default function ChatWidget({ language = "English" }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [detectedLang, setDetectedLang] = useState(LANG_MAP[language] ?? "EN");

  console.log("[MonsoonReady] ChatWidget: mounted", { language, detectedLang });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Namaste! I'm your monsoon preparedness assistant. Ask me anything in Hindi, English, or any Indian language.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (input.trim()) {
      const lang = detectLanguage(input);
      console.log("[MonsoonReady] ChatWidget: input language detection", { detected: lang, input: input.trim().slice(0, 50) });
      setDetectedLang(lang);
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || loading) {
      console.log("[MonsoonReady] ChatWidget: sendMessage blocked", { hasInput: !!input.trim(), loading });
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log("[MonsoonReady] ChatWidget: sendMessage start", { content: userMsg.content.slice(0, 60), historyCount: messages.length });

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          language,
          history: messages.slice(-10),
        }),
      });

      console.log("[MonsoonReady] ChatWidget: API response", { status: res.status, ok: res.ok });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.data?.message ?? "No response received.",
        timestamp: new Date().toISOString(),
      };

      console.log("[MonsoonReady] ChatWidget: assistant reply received", { contentLength: assistantMsg.content.length });
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("[MonsoonReady] ChatWidget: sendMessage error", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I couldn't process your request. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { console.log("[MonsoonReady] ChatWidget: opened"); setOpen(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-xl flex items-center justify-center text-white text-2xl z-50 hover:shadow-2xl transition-shadow"
      >
        💬
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">Monsoon Assistant</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  {detectedLang}
                </span>
              </div>
              <button
                onClick={() => { console.log("[MonsoonReady] ChatWidget: closed"); setOpen(false); }}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white/10 text-white rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white px-4 py-2.5 rounded-2xl rounded-bl-md text-sm">
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask in any language..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2.5 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
