"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types";

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  loading: boolean;
}

const PROFILE_TYPES: { value: UserProfile["profileType"]; label: string; desc: string }[] = [
  { value: "individual", label: "Individual", desc: "Just yourself" },
  { value: "family", label: "Family", desc: "You + family members" },
  { value: "community", label: "Community Group", desc: "A group or organisation" },
];

const LANGUAGES: { value: string; label: string }[] = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "हिन्दी" },
  { value: "Marathi", label: "मराठी" },
];

const ALERT_LEVELS: { value: UserProfile["alertLevel"]; label: string }[] = [
  { value: "informational", label: "Informational" },
  { value: "urgent", label: "Urgent only" },
];

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function ProfileForm({ onSubmit, loading }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    location: "",
    profileType: "individual",
    householdSize: 1,
    hasElderly: false,
    hasInfants: false,
    hasDisabled: false,
    language: "English",
    alertLevel: "informational",
  });

  useEffect(() => {
    console.log("[MonsoonReady] ProfileForm: profileType changed", { profileType: profile.profileType, showHouseholdSize: profile.profileType === "family" || profile.profileType === "community" });
  }, [profile.profileType]);

  useEffect(() => {
    console.log("[MonsoonReady] ProfileForm: render state", { loading, hasName: !!profile.name, hasLocation: !!profile.location });
  }, [loading, profile.name, profile.location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[MonsoonReady] ProfileForm: submit", { name: profile.name, location: profile.location, profileType: profile.profileType, language: profile.language });
    onSubmit(profile);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20"
    >
      <h2 className="text-2xl font-bold text-white">Your Profile</h2>
      <p className="text-blue-100 text-sm -mt-4">
        Tell us about yourself so we can personalise your plan.
      </p>

      <motion.div
        custom={0}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-blue-100">Your Name</label>
        <input
          type="text"
          required
          placeholder="e.g. Rajesh"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
        />
      </motion.div>

      <motion.div
        custom={1}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-blue-100">City / District in India</label>
        <input
          type="text"
          required
          placeholder="e.g. Pune, Maharashtra"
          value={profile.location}
          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
        />
      </motion.div>

      <motion.div
        custom={2}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <label className="block text-sm font-medium text-blue-100">Profile Type</label>
        <div className="grid grid-cols-3 gap-3">
          {PROFILE_TYPES.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setProfile({
                  ...profile,
                  profileType: value,
                  householdSize: value === "individual" ? 1 : profile.householdSize,
                })
              }
              className={`p-4 rounded-xl border text-left transition-all ${
                profile.profileType === value
                  ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/10"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className={`text-sm font-semibold ${profile.profileType === value ? "text-cyan-300" : "text-white"}`}>
                {label}
              </div>
              <div className="text-xs text-blue-200/60 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {(profile.profileType === "family" || profile.profileType === "community") && (
        <motion.div
          custom={3}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <label className="block text-sm font-medium text-blue-100">
            Household Size{profile.profileType === "community" ? " (approx.)" : ""}
          </label>
          <input
            type="number"
            min={1}
            max={500}
            value={profile.householdSize}
            onChange={(e) =>
              setProfile({ ...profile, householdSize: Math.max(1, parseInt(e.target.value) || 1) })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
          />
        </motion.div>
      )}

      <motion.div
        custom={4}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <label className="block text-sm font-medium text-blue-100">Special Considerations</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
            <input
              type="checkbox"
              checked={profile.hasElderly}
              onChange={(e) => setProfile({ ...profile, hasElderly: e.target.checked })}
              className="w-4 h-4 rounded accent-cyan-400"
            />
            <span className="text-sm text-white">Has elderly members</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
            <input
              type="checkbox"
              checked={profile.hasInfants}
              onChange={(e) => setProfile({ ...profile, hasInfants: e.target.checked })}
              className="w-4 h-4 rounded accent-cyan-400"
            />
            <span className="text-sm text-white">Has infants</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
            <input
              type="checkbox"
              checked={profile.hasDisabled}
              onChange={(e) => setProfile({ ...profile, hasDisabled: e.target.checked })}
              className="w-4 h-4 rounded accent-cyan-400"
            />
            <span className="text-sm text-white">Has disabled members</span>
          </label>
        </div>
      </motion.div>

      <motion.div
        custom={5}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <label className="block text-sm font-medium text-blue-100">Preferred Language</label>
        <div className="flex gap-2">
          {LANGUAGES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setProfile({ ...profile, language: value })}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                profile.language === value
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        custom={6}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <label className="block text-sm font-medium text-blue-100">Alert Level Preference</label>
        <div className="flex gap-2">
          {ALERT_LEVELS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setProfile({ ...profile, alertLevel: value })}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                profile.alertLevel === value
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={loading ? { scale: [1, 1.02, 1] } : {}}
        transition={loading ? { repeat: Infinity, duration: 1.5 } : {}}
        type="submit"
        disabled={loading || !profile.name || !profile.location}
        className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? "Generating Your Plan..." : "Generate My Preparedness Plan"}
      </motion.button>
    </motion.form>
  );
}
