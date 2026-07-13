/**
 * @jest-environment node
 */

import { POST } from "@/app/api/monsoon-plan/route";
import { callAI } from "@/lib/ai";
import { getWeatherForecast } from "@/lib/weatherApi";

jest.mock("@/lib/ai");
jest.mock("@/lib/weatherApi");

const mockPlanJSON = JSON.stringify({
  personalizedPlan: { title: "Plan", summary: "Test", priority: "high" },
  weatherAwareTips: ["Tip"],
  beforeMonsoon: ["Action"],
  duringMonsoon: ["Action"],
  afterMonsoon: ["Action"],
  safetyRecommendations: ["Safety"],
  estimatedRisk: "moderate",
});

beforeEach(() => {
  jest.clearAllMocks();
  (callAI as jest.Mock).mockResolvedValue(mockPlanJSON);
  (getWeatherForecast as jest.Mock).mockResolvedValue(null);
});

function createMockReq(body: Record<string, unknown>, ip = "127.0.0.1"): Request {
  return new Request("http://localhost:3000/api/monsoon-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  }) as unknown as Request;
}

describe("POST /api/monsoon-plan", () => {
  test("returns 200 + parsed plan with valid body", async () => {
    const req = createMockReq({ name: "Test", location: "Pune", profileType: "individual", language: "English", alertLevel: "informational" });
    const res = await POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.personalizedPlan.title).toBe("Plan");
  });

  test("returns 400 when missing location", async () => {
    const req = createMockReq({ name: "Test" });
    const res = await POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Name and location are required");
  });

  test("returns 400 when missing name", async () => {
    const req = createMockReq({ location: "Pune" });
    const res = await POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Name and location are required");
  });

  test("callAI throwing returns 500 with generic message, not raw error", async () => {
    (callAI as jest.Mock).mockRejectedValue(new Error("OPENROUTER_API_KEY secret=sk-abc123"));
    const req = createMockReq({ name: "Test", location: "Pune", profileType: "individual", language: "English", alertLevel: "informational" });
    const res = await POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe("Something went wrong. Please try again.");
    expect(data.error).not.toContain("sk-abc123");
  });

  test("response never contains OPENROUTER_API_KEY string", async () => {
    const req = createMockReq({ name: "Test", location: "Pune", profileType: "individual", language: "English", alertLevel: "informational" });
    const res = await POST(req as any);
    const text = await res.text();
    expect(text).not.toContain("OPENROUTER_API_KEY");
    expect(text).not.toContain("sk-");
    expect(text).not.toContain("api_key");
  });
});
