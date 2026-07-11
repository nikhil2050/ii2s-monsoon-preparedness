"use client";

import { motion } from "framer-motion";
import type { MonsoonPhase } from "@/types";

interface PhaseToggleProps {
  activePhase: MonsoonPhase;
  onPhaseChange: (phase: MonsoonPhase) => void;
}

const PHASES: { key: MonsoonPhase; label: string; emoji: string }[] = [
  { key: "before", label: "Before Monsoon", emoji: "☀️" },
  { key: "during", label: "During Monsoon", emoji: "🌧️" },
  { key: "after", label: "After Monsoon", emoji: "🌈" },
];

export default function PhaseToggle({ activePhase, onPhaseChange }: PhaseToggleProps) {
  console.log("[MonsoonReady] PhaseToggle: render", { activePhase });
  return (
    <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
      {PHASES.map(({ key, label, emoji }) => (
        <button
          key={key}
          onClick={() => { console.log("[MonsoonReady] PhaseToggle: click", { key, label }); onPhaseChange(key); }}
          className="relative flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-colors"
        >
          {activePhase === key && (
            <motion.div
              layoutId="phase-bg"
              className="absolute inset-0 bg-blue-500/30 rounded-lg"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-2 text-white">
            <span>{emoji}</span>
            <span className="hidden sm:inline">{label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
