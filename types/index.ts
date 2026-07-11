export interface UserProfile {
  name: string;
  location: string;
  profileType: "individual" | "family" | "community";
  householdSize: number;
  hasElderly: boolean;
  hasInfants: boolean;
  hasDisabled: boolean;
  language: string;
  alertLevel: "informational" | "urgent";
}

export type MonsoonPhase = "before" | "during" | "after";

export interface PreparednessPlan {
  personalizedPlan: {
    title: string;
    summary: string;
    priority: "high" | "medium" | "low";
  };
  weatherAwareTips: string[];
  beforeMonsoon: string[];
  duringMonsoon: string[];
  afterMonsoon: string[];
  safetyRecommendations: string[];
  estimatedRisk: "low" | "moderate" | "high" | "extreme";
}

export interface ChecklistItem {
  task: string;
  category: string;
  urgent: boolean;
  done: boolean;
}

export interface ChecklistResponse {
  items: ChecklistItem[];
}

export interface Advisory {
  safeToTravel: boolean;
  riskLevel: "low" | "moderate" | "high" | "extreme";
  reasons: string[];
  alternativeRoutes: string[];
  bestTimeToTravel: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ForecastItem {
  date: string;
  rainMm: number;
  windKmh: number;
  condition: string;
}

export interface WeatherForecast {
  city: string;
  lat: number;
  lon: number;
  forecast: ForecastItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
