"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlanDashboard from "@/components/PlanDashboard";
import type { PreparednessPlan, UserProfile } from "@/types";

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<PreparednessPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("monsoonPlan");
    const storedProfile = sessionStorage.getItem("userProfile");

    if (!storedPlan || !storedProfile) {
      router.push("/");
      return;
    }

    setPlan(JSON.parse(storedPlan));
    setProfile(JSON.parse(storedProfile));
  }, [router]);

  if (!plan || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-white/60 text-lg">Loading your plan...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push("/")}
              className="text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Edit Profile</span>
            </button>
          </div>

          <PlanDashboard plan={plan} location={profile.location} profile={profile} />
        </div>
      </div>
    </main>
  );
}
