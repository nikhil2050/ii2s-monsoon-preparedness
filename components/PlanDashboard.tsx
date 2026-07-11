"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { PreparednessPlan, MonsoonPhase } from "@/types";
import PhaseToggle from "./PhaseToggle";
import ChecklistCard from "./ChecklistCard";
import AlertBanner from "./AlertBanner";
import TravelAdvisory from "./TravelAdvisory";
import ChatWidget from "./ChatWidget";

interface PlanDashboardProps {
  plan: PreparednessPlan;
  location: string;
  profile: {
    profileType: string;
    householdSize: number;
    hasElderly: boolean;
    hasInfants: boolean;
    hasDisabled: boolean;
    language?: string;
  };
}

const RISK_COLORS: Record<string, string> = {
  low: "bg-green-500",
  moderate: "bg-yellow-500",
  high: "bg-orange-500",
  extreme: "bg-red-500",
};

const PHASE_MAP: Record<MonsoonPhase, keyof PreparednessPlan> = {
  before: "beforeMonsoon",
  during: "duringMonsoon",
  after: "afterMonsoon",
};

const tabVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function PlanDashboard({ plan, location, profile }: PlanDashboardProps) {
  const [activePhase, setActivePhase] = useState<MonsoonPhase>("before");
  const phaseActions = plan[PHASE_MAP[activePhase]] as string[] | undefined;

  useEffect(() => {
    console.log("[MonsoonReady] PlanDashboard: phase changed", { phase: activePhase, hasActions: !!(phaseActions && phaseActions.length > 0), count: phaseActions?.length });
  }, [activePhase, phaseActions]);

  console.log("[MonsoonReady] PlanDashboard: render", { activePhase, location, riskLevel: plan.estimatedRisk, actionsCount: phaseActions?.length });

  return (
    <div className="space-y-8">
      <AlertBanner riskLevel={plan.estimatedRisk} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/85 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{plan.personalizedPlan.title}</h1>
            <p className="text-blue-100 mt-1">{location}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-blue-100">Risk Level:</span>
            <span
              className={`px-4 py-1.5 rounded-full text-white text-sm font-medium capitalize ${
                RISK_COLORS[plan.estimatedRisk]
              }`}
            >
              {plan.estimatedRisk}
            </span>
          </div>
        </div>

        <p className="text-white/80 mb-6 leading-relaxed">{plan.personalizedPlan.summary}</p>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Weather-Aware Tips</h3>
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="space-y-2"
          >
            {plan.weatherAwareTips.map((tip, i) => (
              <motion.li
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -15 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="flex items-start gap-3 text-white/80"
              >
                <span className="text-blue-400 mt-0.5">•</span>
                {tip}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Safety Recommendations</h3>
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="space-y-2"
          >
            {plan.safetyRecommendations.map((rec, i) => (
              <motion.li
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -15 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="flex items-start gap-3 text-white/80"
              >
                <span className="text-cyan-400 mt-0.5">•</span>
                {rec}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <PhaseToggle activePhase={activePhase} onPhaseChange={(phase) => { console.log("[MonsoonReady] PlanDashboard: phase change", { from: activePhase, to: phase }); setActivePhase(phase); }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="mt-6 p-6 bg-gray-900/85 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-4 capitalize">
              {activePhase === "before" ? "Before" : activePhase === "during" ? "During" : "After"} Monsoon
            </h3>

            {phaseActions && phaseActions.length > 0 && (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                className="space-y-2 mb-6"
              >
                {phaseActions.map((action, i) => (
                  <motion.li
                    key={i}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="flex items-start gap-3 text-white/80 text-sm"
                  >
                    <span className="text-white/40 mt-0.5">{i + 1}.</span>
                    {action}
                  </motion.li>
                ))}
              </motion.ul>
            )}

            <ChecklistCard phase={activePhase} profile={profile} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <TravelAdvisory />

      <ChatWidget language={profile.language ?? "English"} />
    </div>
  );
}
