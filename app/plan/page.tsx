"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import PlanDashboard from "@/components/PlanDashboard";
import WeatherSidebar from "@/components/WeatherSidebar";
import WeatherBackground from "@/components/WeatherBackground";
import type { PreparednessPlan, UserProfile, WeatherForecast } from "@/types";

function deriveCondition(forecast: WeatherForecast | null): "thunderstorm" | "heavy_rain" | "moderate_rain" | "cloudy" | "clear" {
  if (!forecast || !forecast.forecast || forecast.forecast.length === 0) return "clear";
  const items = forecast.forecast;
  const avgRain = items.reduce((s, d) => s + d.rainMm, 0) / items.length;
  if (items.some((d) => d.rainMm > 60)) return "thunderstorm";
  if (avgRain > 30) return "heavy_rain";
  if (avgRain > 10) return "moderate_rain";
  if (avgRain > 0) return "cloudy";
  return "clear";
}

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<PreparednessPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("monsoonPlan");
    const storedProfile = sessionStorage.getItem("userProfile");
    const storedForecast = sessionStorage.getItem("monsoonForecast");

    console.log("[MonsoonReady] PlanPage: sessionStorage read", { hasPlan: !!storedPlan, hasProfile: !!storedProfile, hasForecast: !!storedForecast });

    if (!storedPlan || !storedProfile) {
      console.log("[MonsoonReady] PlanPage: missing data, redirecting to /");
      router.push("/");
      return;
    }

    setPlan(JSON.parse(storedPlan));
    setProfile(JSON.parse(storedProfile));
    if (storedForecast) setForecast(JSON.parse(storedForecast));
  }, [router]);

  const dominantCondition = useMemo(() => deriveCondition(forecast), [forecast]);

  console.log("[MonsoonReady] PlanPage: render state", { hasPlan: !!plan, hasProfile: !!profile, condition: dominantCondition });

  if (!plan || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-white/60 text-lg">Loading your plan...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative">
      <WeatherBackground condition={dominantCondition} city={profile.location} />

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push("/")}
              className="text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Edit Profile</span>
            </button>
          </div>

          {forecast && (
            <div className="lg:hidden mb-6">
              <WeatherSidebar forecast={forecast} />
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <PlanDashboard plan={plan} location={profile.location} profile={profile} />
            </div>

            {forecast && (
              <div className="hidden lg:block shrink-0">
                <WeatherSidebar forecast={forecast} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
