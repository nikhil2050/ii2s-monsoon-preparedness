"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertBannerProps {
  riskLevel: "low" | "moderate" | "high" | "extreme";
}

const CONTACTS = [
  { label: "Police / Fire / Ambulance", number: "112" },
  { label: "Flood Helpline", number: "1078" },
  { label: "NDRF", number: "011-24363260" },
];

export default function AlertBanner({ riskLevel }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const isSevere = riskLevel === "high" || riskLevel === "extreme";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        {isSevere ? (
          <div className="bg-red-600/90 border-2 border-red-400 rounded-xl p-5 mb-6 shadow-lg shadow-red-600/20">
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="text-2xl">🚨</span>
              <div>
                <h4 className="text-white font-bold text-lg">
                  {riskLevel === "extreme" ? "EXTREME RISK" : "HIGH RISK"} — Take Action Now
                </h4>
                <p className="text-red-100 text-sm">
                  Emergency contacts — save these numbers:
                </p>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="ml-auto text-white/60 hover:text-white shrink-0"
              >
                ✕
              </button>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CONTACTS.map((c) => (
                <a
                  key={c.number}
                  href={`tel:${c.number.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors"
                >
                  <span className="text-white font-mono font-bold text-lg">{c.number}</span>
                  <span className="text-red-100 text-xs">{c.label}</span>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-blue-600/60 border border-blue-400/40 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">ℹ️</span>
              <p className="text-blue-100 text-sm flex-1">
                Risk level is <span className="font-semibold capitalize text-white">{riskLevel}</span>.
                Stay aware of local weather updates.
              </p>
              <button
                onClick={() => setDismissed(true)}
                className="text-white/60 hover:text-white shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
