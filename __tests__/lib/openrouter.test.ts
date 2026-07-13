/**
 * @jest-environment node
 */

import { callAI } from "@/lib/ai";

const mockPlanJSON = JSON.stringify({
  personalizedPlan: { title: "Test Plan", summary: "Test", priority: "high" },
  weatherAwareTips: ["Tip 1"],
  beforeMonsoon: ["Action 1"],
  duringMonsoon: ["Action 2"],
  afterMonsoon: ["Action 3"],
  safetyRecommendations: ["Safety 1"],
  estimatedRisk: "moderate",
});

beforeEach(() => {
  jest.resetAllMocks();
  process.env.OPENROUTER_API_KEY = "sk-test-key";
  process.env.AI_PROVIDER = "openrouter";
});

afterAll(() => {
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.AI_PROVIDER;
});

describe("callAI (openrouter)", () => {
  test("returns parsed string on success", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: mockPlanJSON } }] }), {
        status: 200,
      })
    );

    const result = await callAI("system prompt", "user message");
    expect(result).toBe(mockPlanJSON);
  });

  test("throws error when API returns 401", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response("Unauthorized", { status: 401 })
    );

    await expect(callAI("prompt", "msg")).rejects.toThrow("OpenRouter API error (401)");
  });

  test("throws error when response has no content", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: {} }] }), { status: 200 })
    );

    const result = await callAI("prompt", "msg");
    expect(result).toBe("");
  });
});
