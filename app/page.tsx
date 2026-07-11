"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProfileForm from "@/components/ProfileForm";
import type { UserProfile } from "@/types";

const DROP_COUNT = 50;

function RainDrops() {
  console.log("[MonsoonReady] RainDrops: mounted", { dropCount: DROP_COUNT });
  const drops = useMemo(() => {
    const arr = Array.from({ length: DROP_COUNT }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${1 + Math.random() * 1.5}s`,
      height: `${30 + Math.random() * 50}px`,
    }));
    console.log("[MonsoonReady] RainDrops: generated drops", { count: arr.length });
    return arr;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {drops.map((d) => (
        <div
          key={d.id}
          className="rain-drop"
          style={{
            left: d.left,
            animationDelay: d.delay,
            animationDuration: d.duration,
            height: d.height,
          }}
        />
      ))}
    </div>
  );
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const child = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (profile: UserProfile) => {
    console.log("[MonsoonReady] Home: handleSubmit start", { location: profile.location, profileType: profile.profileType });
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/monsoon-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      console.log("[MonsoonReady] Home: API response received", { status: res.status });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error ?? "Failed to generate plan");
      }

      console.log("[MonsoonReady] Home: API success, writing to sessionStorage");
      sessionStorage.setItem("monsoonPlan", JSON.stringify(data.data));
      sessionStorage.setItem("userProfile", JSON.stringify(profile));
      console.log("[MonsoonReady] Home: redirecting to /plan");
      router.push("/plan");
    } catch (err) {
      console.error("[MonsoonReady] Home: handleSubmit error", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      console.log("[MonsoonReady] Home: loading set to false");
    }
  };

  console.log("[MonsoonReady] Home: rendered", { loading, hasError: !!error });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      <RainDrops />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.h1
            variants={child}
            className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400"
          >
            MonsoonReady
          </motion.h1>
          <motion.p
            variants={child}
            className="mt-4 text-lg text-blue-200/80 max-w-xl mx-auto"
          >
            Your personalised monsoon preparedness companion. Get tailored plans,
            checklists, and real-time guidance — in your language.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <ProfileForm onSubmit={handleSubmit} loading={loading} />
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            { icon: "🌊", title: "Personalised Plans", desc: "Tailored to your location and needs" },
            { icon: "✅", title: "Smart Checklists", desc: "Before, during, and after monsoon" },
            { icon: "🤖", title: "Multilingual AI", desc: "Chat in your preferred language" },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              variants={child}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
              <p className="text-blue-200/60 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
