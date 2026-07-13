import type { WeatherForecast, ForecastItem, UserProfile, PreparednessPlan, ChecklistItem } from "@/types";

export const mockForecastItems: ForecastItem[] = [
  { date: "2026-07-10", rainMm: 85, windKmh: 32, condition: "thunderstorm with heavy hail" },
  { date: "2026-07-11", rainMm: 45, windKmh: 28, condition: "heavy rain" },
  { date: "2026-07-12", rainMm: 22, windKmh: 15, condition: "moderate rain" },
  { date: "2026-07-13", rainMm: 8, windKmh: 12, condition: "partly cloudy" },
  { date: "2026-07-14", rainMm: 0, windKmh: 8, condition: "clear" },
  { date: "2026-07-15", rainMm: 12, windKmh: 18, condition: "light drizzle" },
  { date: "2026-07-16", rainMm: 55, windKmh: 42, condition: "violent rain showers" },
];

export const mockForecast: WeatherForecast = {
  city: "Pune",
  lat: 18.52,
  lon: 73.86,
  forecast: mockForecastItems,
};

export const mockProfile: UserProfile = {
  name: "Test User",
  location: "Pune",
  profileType: "family",
  householdSize: 4,
  hasElderly: true,
  hasInfants: false,
  hasDisabled: false,
  language: "English",
  alertLevel: "informational",
};

export const mockPlan: PreparednessPlan = {
  personalizedPlan: {
    title: "Pune Monsoon Ready Plan",
    summary: "Your family of 4 faces moderate risk. Key actions include preparing an emergency kit and identifying evacuation routes.",
    priority: "high",
  },
  weatherAwareTips: ["Stock up on essentials for 3 days", "Keep documents waterproof"],
  beforeMonsoon: ["Prepare emergency kit", "Clear gutters"],
  duringMonsoon: ["Stay indoors", "Avoid flood water"],
  afterMonsoon: ["Check for damage", "Dispose contaminated food"],
  safetyRecommendations: ["Call 112 in emergency", "Keep mobile charged"],
  estimatedRisk: "high",
};

export const mockChecklistItems: ChecklistItem[] = [
  { task: "Prepare emergency kit", category: "supplies", urgent: true, done: false },
  { task: "Clear gutters", category: "safety", urgent: false, done: false },
  { task: "Stock medicines", category: "health", urgent: true, done: false },
  { task: "Charge power banks", category: "supplies", urgent: false, done: false },
  { task: "Check roof leaks", category: "safety", urgent: false, done: false },
];
