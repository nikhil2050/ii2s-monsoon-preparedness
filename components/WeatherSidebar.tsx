"use client";

import { motion } from "framer-motion";
import type { WeatherForecast } from "@/types";

interface WeatherSidebarProps {
  forecast: WeatherForecast;
}

function getDayName(dateStr: string): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(dateStr).getDay()];
}

function getRainColor(mm: number): string {
  if (mm > 80) return "text-red-600";
  if (mm > 40) return "text-blue-700";
  if (mm > 10) return "text-blue-500";
  return "text-blue-200";
}

function getConditionLabel(condition: string): string {
  const lower = condition.toLowerCase();
  if (lower.includes("thunderstorm") || lower.includes("hail")) return "Thunderstorm";
  if (lower.includes("heavy") || lower.includes("violent") || lower.includes("dense")) return "Heavy Rain";
  if (lower.includes("moderate") || lower.includes("slight") || lower.includes("light") || lower.includes("drizzle") || lower.includes("rain")) return "Moderate Rain";
  if (lower.includes("cloudy") || lower.includes("overcast") || lower.includes("fog") || lower.includes("rime")) return "Cloudy";
  return "Clear";
}

function getConditionIcon(condition: string): string {
  const label = getConditionLabel(condition);
  switch (label) {
    case "Thunderstorm": return "⛈️";
    case "Heavy Rain": return "🌧️";
    case "Moderate Rain": return "🌦️";
    case "Cloudy": return "☁️";
    default: return "☀️";
  }
}

const maxRain = (forecast: { rainMm: number }[]): number =>
  Math.max(...forecast.map((d) => d.rainMm), 1);

const BAR_HEIGHT_MAX = 80;

export default function WeatherSidebar({ forecast }: WeatherSidebarProps) {
  const { city } = forecast;
  const max = maxRain(forecast.forecast);

  return (
    <div className="lg:sticky lg:top-6 lg:w-80 shrink-0">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className="bg-gray-900/85 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🌤️</span>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">{city}</h3>
            <p className="text-blue-200/60 text-xs">7-Day Monsoon Forecast</p>
          </div>
        </div>

        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-1">
          {forecast.forecast.map((day) => (
            <motion.div
              key={day.date}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex lg:flex-row items-center gap-3 p-2.5 rounded-xl bg-gray-900/85 border border-white/10 min-w-[140px] lg:min-w-0 shrink-0"
            >
              <span className="text-sm font-semibold text-white w-10 shrink-0">
                {getDayName(day.date)}
              </span>

              <span className="text-sm flex items-center gap-1 w-[80px] shrink-0">
                <span>{getConditionIcon(day.condition)}</span>
                <span className={`font-mono text-xs font-medium ${getRainColor(day.rainMm)}`}>
                  {day.rainMm.toFixed(0)}mm
                </span>
              </span>

              <span className="text-xs text-blue-200/60 flex items-center gap-1 w-[70px] shrink-0">
                <span>💨</span>
                {day.windKmh.toFixed(0)} km/h
              </span>

              <span className="text-[11px] text-white/50 hidden lg:inline ml-auto shrink-0">
                {getConditionLabel(day.condition)}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-[11px] text-blue-200/40 uppercase tracking-wider mb-2 font-medium">
            Rain Intensity
          </p>
          <div className="flex items-end gap-1.5 h-20">
            {forecast.forecast.map((day) => {
              const h = Math.max(4, (day.rainMm / max) * BAR_HEIGHT_MAX);
              return (
                <div
                  key={day.date}
                  title={`${getDayName(day.date)}: ${day.rainMm.toFixed(0)}mm`}
                  className="flex-1 rounded-t-sm"
                  style={{ height: `${h}px` }}
                >
                  <div
                    className={`w-full h-full rounded-t-sm transition-all ${getRainColor(day.rainMm).replace("text-", "bg-")}`}
                    style={{ opacity: 0.6 + (day.rainMm / max) * 0.4 }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex gap-1.5 mt-1">
            {forecast.forecast.map((day) => (
              <span key={day.date} className="flex-1 text-[10px] text-blue-200/40 text-center">
                {getDayName(day.date).slice(0, 1)}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
