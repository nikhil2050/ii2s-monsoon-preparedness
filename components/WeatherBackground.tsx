"use client";

import { useMemo, useState, useEffect } from "react";

type WeatherCondition = "thunderstorm" | "heavy_rain" | "moderate_rain" | "cloudy" | "clear";

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  city: string;
}

const CONDITION_META: Record<WeatherCondition, { emoji: string; label: string }> = {
  thunderstorm: { emoji: "⛈️", label: "Thunderstorm" },
  heavy_rain: { emoji: "🌧️", label: "Heavy Rain" },
  moderate_rain: { emoji: "🌦️", label: "Moderate Rain" },
  cloudy: { emoji: "☁️", label: "Cloudy" },
  clear: { emoji: "☀️", label: "Clear" },
};

const DISMISS_KEY = "weatherOverlayDismissed";

function RainStreaks({ count, speed, diagonal }: { count: number; speed: number; diagonal: boolean }) {
  const streaks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * speed}s`,
        duration: `${speed * (0.6 + Math.random() * 0.4)}s`,
        top: `${Math.random() * 100}%`,
        opacity: 0.06 + Math.random() * 0.1,
      })),
    [count, speed]
  );

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden rain-streaks" aria-hidden="true" role="presentation">
      {streaks.map((s) => (
        <div
          key={s.id}
          className="absolute w-px bg-white rounded-full rain-streak"
          style={{
            left: s.left,
            top: s.top,
            height: "60px",
            opacity: s.opacity,
            animation: diagonal
              ? `rain-diagonal ${s.duration} linear ${s.delay} infinite`
              : `rain-vertical ${s.duration} linear ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function WeatherBackground({ condition, city }: WeatherBackgroundProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(DISMISS_KEY);
    if (stored === "true") setDismissed(true);
  }, []);

  const meta = CONDITION_META[condition];

  if (condition === "clear") return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, "true");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 ${dismissed ? "opacity-0" : "opacity-100"}`}
        aria-hidden="true"
        role="presentation"
      >
        <div
          className="absolute inset-0 overlay-tint"
          style={{
            backgroundColor:
              condition === "thunderstorm"
                ? "#0a1628"
                : condition === "heavy_rain"
                  ? "#0d2844"
                  : condition === "moderate_rain"
                    ? "#1a3a5c"
                    : "#2c3e50",
            opacity:
              condition === "thunderstorm"
                ? 0.15
                : condition === "heavy_rain"
                  ? 0.12
                  : condition === "moderate_rain"
                    ? 0.08
                    : 0.06,
          }}
        />

        {condition === "thunderstorm" && (
          <>
            <div className="absolute inset-0 lightning-flash" style={{ animation: "lightning 6s ease-in-out infinite", background: "white", opacity: 0 }} />
            <RainStreaks count={20} speed={4} diagonal />
          </>
        )}

        {condition === "heavy_rain" && (
          <RainStreaks count={30} speed={0.6} diagonal={false} />
        )}

        {condition === "moderate_rain" && (
          <RainStreaks count={15} speed={1.2} diagonal={false} />
        )}

        {condition === "cloudy" && (
          <div className="absolute inset-0 cloud-drift" style={{ animation: "cloud-drift 12s ease-in-out infinite", background: "radial-gradient(ellipse at 50% 30%, rgba(100,130,160,0.1) 0%, transparent 70%)" }} />
        )}

        <span className="sr-only">Page background reflects current monsoon weather conditions in {city}.</span>
      </div>

      <noscript>
        <style>{`.overlay-tint, .rain-streaks, .lightning-flash, .cloud-drift, .rain-streak { display: none !important; }`}</style>
      </noscript>

      <style>{`
        @keyframes rain-vertical {
          0% { transform: translateY(-80px); }
          100% { transform: translateY(100vh); }
        }
        @keyframes rain-diagonal {
          0% { transform: translate(-20px, -80px); }
          100% { transform: translate(20px, 100vh); }
        }
        @keyframes lightning {
          0%, 100% { opacity: 0; }
          5% { opacity: 0.25; }
          10% { opacity: 0; }
          15% { opacity: 0.15; }
          20% { opacity: 0; }
        }
        @keyframes cloud-drift {
          0% { transform: translateX(-10%) scale(1); opacity: 0.3; }
          50% { transform: translateX(10%) scale(1.05); opacity: 0.15; }
          100% { transform: translateX(-10%) scale(1); opacity: 0.3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rain-streak, .lightning-flash, .cloud-drift { display: none !important; }
        }
      `}</style>

      {!dismissed && (
        <div
          role="status"
          aria-live="polite"
          aria-label={`Weather background: ${meta.label} conditions in ${city}`}
          className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-xs text-white/80 shadow-lg"
          title="Background reflects current weather in your area"
        >
          <span>{meta.emoji}</span>
          <span>{meta.label} conditions</span>
          <button
            onClick={handleDismiss}
            className="ml-1 text-white/50 hover:text-white/90 transition-colors"
            aria-label="Dismiss weather overlay"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
