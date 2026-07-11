"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Advisory } from "@/types";

export default function TravelAdvisory() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState<Advisory | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !date) return;

    setLoading(true);
    try {
      const res = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, date }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const status = result
    ? result.safeToTravel
      ? "GO"
      : result.riskLevel === "extreme" || result.riskLevel === "high"
        ? "AVOID"
        : "CAUTION"
    : null;

  const STATUS_STYLES: Record<string, string> = {
    GO: "bg-green-600/80 border-green-400 shadow-green-600/20",
    CAUTION: "bg-yellow-600/80 border-yellow-400 shadow-yellow-600/20",
    AVOID: "bg-red-600/80 border-red-400 shadow-red-600/20",
  };

  const STATUS_ICONS: Record<string, string> = {
    GO: "✅",
    CAUTION: "⚠️",
    AVOID: "🚫",
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
      <h2 className="text-xl font-bold text-white mb-2">Travel Advisory</h2>
      <p className="text-blue-100 text-sm mb-6">
        Check if it&apos;s safe to travel between two locations.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-blue-200">Origin</label>
          <input
            type="text"
            required
            placeholder="e.g. Mumbai"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-blue-200">Destination</label>
          <input
            type="text"
            required
            placeholder="e.g. Pune"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-blue-200">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 [color-scheme:dark]"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="sm:col-span-3 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all text-sm"
        >
          {loading ? "Checking..." : "Check Travel Safety"}
        </motion.button>
      </form>

      <AnimatePresence mode="wait">
        {result && status && (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`${STATUS_STYLES[status]} border rounded-xl p-5 shadow-lg`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{STATUS_ICONS[status]}</span>
              <span className="text-white font-bold text-lg">{status}</span>
              <span className="ml-auto text-white/60 text-xs capitalize">
                Risk: {result.riskLevel}
              </span>
            </div>

            {result.reasons.length > 0 && (
              <ul className="space-y-1 mb-3">
                {result.reasons.map((r, i) => (
                  <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                    <span className="text-white/40 mt-0.5">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            )}

            {result.alternativeRoutes.length > 0 && (
              <div className="mb-2">
                <span className="text-white/70 text-xs font-semibold">Alternative routes:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.alternativeRoutes.map((r, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-1 rounded-full bg-white/10 text-white/70"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.bestTimeToTravel && (
              <p className="text-white/60 text-xs mt-2">
                Best time to travel: {result.bestTimeToTravel}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
