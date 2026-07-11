"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { ChecklistItem, MonsoonPhase } from "@/types";

interface ChecklistCardProps {
  phase: MonsoonPhase;
  profile: {
    profileType: string;
    householdSize: number;
    hasElderly: boolean;
    hasInfants: boolean;
    hasDisabled: boolean;
  };
}

const FALLBACK_ITEMS: Record<MonsoonPhase, ChecklistItem[]> = {
  before: [
    { task: "Prepare an emergency kit with food, water, and medicine", category: "supplies", urgent: true, done: false },
    { task: "Keep important documents in a waterproof container", category: "documents", urgent: true, done: false },
    { task: "Clear gutters and drains around your home", category: "safety", urgent: false, done: false },
    { task: "Identify the nearest evacuation center", category: "safety", urgent: true, done: false },
    { task: "Charge power banks and keep flashlights ready", category: "supplies", urgent: false, done: false },
    { task: "Store emergency contact numbers", category: "communication", urgent: false, done: false },
    { task: "Trim tree branches near your house", category: "safety", urgent: false, done: false },
    { task: "Check roof for leaks and repair if needed", category: "safety", urgent: false, done: false },
    { task: "Stock up on essential medicines for 7 days", category: "health", urgent: true, done: false },
    { task: "Prepare a pet/livestock evacuation plan", category: "evacuation", urgent: false, done: false },
  ],
  during: [
    { task: "Stay indoors and avoid unnecessary travel", category: "safety", urgent: true, done: false },
    { task: "Keep updated with weather alerts", category: "communication", urgent: false, done: false },
    { task: "Move to higher ground if water enters your home", category: "safety", urgent: true, done: false },
    { task: "Turn off gas and electricity if flooding occurs", category: "safety", urgent: true, done: false },
    { task: "Use sandbags to block doorways if needed", category: "supplies", urgent: false, done: false },
    { task: "Drink only boiled/filtered water", category: "health", urgent: true, done: false },
    { task: "Keep mobile phones charged for emergency calls", category: "communication", urgent: false, done: false },
    { task: "Avoid walking through flood waters", category: "safety", urgent: true, done: false },
    { task: "Stay with your family in a safe room", category: "safety", urgent: true, done: false },
    { task: "Listen to local radio for official instructions", category: "communication", urgent: false, done: false },
  ],
  after: [
    { task: "Wait for official all-clear before returning home", category: "safety", urgent: true, done: false },
    { task: "Check for structural damage before entering", category: "safety", urgent: true, done: false },
    { task: "Dispose of contaminated food and water", category: "health", urgent: true, done: false },
    { task: "Clean and disinfect your home thoroughly", category: "health", urgent: false, done: false },
    { task: "Document damages for insurance claims", category: "documents", urgent: false, done: false },
    { task: "Check on neighbours and vulnerable people", category: "communication", urgent: false, done: false },
    { task: "Be aware of waterborne diseases", category: "health", urgent: false, done: false },
    { task: "Restock emergency supplies for next season", category: "supplies", urgent: false, done: false },
    { task: "Report fallen power lines to authorities", category: "safety", urgent: true, done: false },
    { task: "Review and update your preparedness plan", category: "communication", urgent: false, done: false },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  supplies: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  documents: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  safety: "bg-red-500/20 text-red-300 border-red-500/30",
  communication: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  health: "bg-green-500/20 text-green-300 border-green-500/30",
  evacuation: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export default function ChecklistCard({ phase, profile }: ChecklistCardProps) {
  const [items, setItems] = useState<ChecklistItem[]>(FALLBACK_ITEMS[phase]);
  const [loading, setLoading] = useState(false);

  const fetchChecklist = useCallback(async () => {
    console.log("[MonsoonReady] ChecklistCard: fetchChecklist start", { phase });
    setLoading(true);
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase, profile }),
      });
      console.log("[MonsoonReady] ChecklistCard: API response", { status: res.status, ok: res.ok });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.items) {
          console.log("[MonsoonReady] ChecklistCard: using API items", { count: data.data.items.length });
          setItems(data.data.items);
        } else {
          console.log("[MonsoonReady] ChecklistCard: API returned no items, using fallback");
        }
      } else {
        console.log("[MonsoonReady] ChecklistCard: API not ok, using fallback");
      }
    } catch (err) {
      console.error("[MonsoonReady] ChecklistCard: fetch error, using fallback", err);
    } finally {
      setLoading(false);
    }
  }, [phase, profile]);

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  const toggleItem = (index: number) => {
    console.log("[MonsoonReady] ChecklistCard: toggleItem", { index, wasDone: items[index]?.done, task: items[index]?.task?.slice(0, 40) });
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item))
    );
  };

  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length > 0 ? doneCount / items.length : 0;

  console.log("[MonsoonReady] ChecklistCard: render", { phase, itemCount: items.length, doneCount, progress: Math.round(progress * 100) });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-sm text-blue-100 font-medium">
          {loading ? "..." : `${Math.round(progress * 100)}%`}
        </span>
      </div>

      <ul className="space-y-2">
        {items.map((item, i) => (
          <motion.li
            key={`${phase}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => toggleItem(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                item.done
                  ? "bg-white/5 border-white/10 opacity-60"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  item.done
                    ? "bg-blue-500 border-blue-500"
                    : "border-white/30"
                }`}
              >
                {item.done && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span
                className={`flex-1 text-left text-sm ${
                  item.done ? "text-white/50 line-through" : "text-white"
                }`}
              >
                {item.task}
              </span>
              {item.urgent && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 capitalize shrink-0">
                  urgent
                </span>
              )}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border capitalize shrink-0 ${
                  CATEGORY_COLORS[item.category] ?? "bg-white/10 text-white/60 border-white/20"
                }`}
              >
                {item.category}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
