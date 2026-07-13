/**
 * @jest-environment node
 */

import { POST } from "@/app/api/advisory/route";
import { callAI } from "@/lib/ai";

jest.mock("@/lib/ai");

const mockAdvisoryJSON = JSON.stringify({
  safeToTravel: false,
  riskLevel: "high",
  reasons: ["Heavy rain expected"],
  alternativeRoutes: ["Via NH-48"],
  bestTimeToTravel: "Morning hours",
});

beforeEach(() => {
  jest.clearAllMocks();
  (callAI as jest.Mock).mockResolvedValue(mockAdvisoryJSON);
});

function createMockReq(body: Record<string, unknown>, ip = "127.0.0.1"): Request {
  return new Request("http://localhost:3000/api/advisory", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  }) as unknown as Request;
}

describe("POST /api/advisory", () => {
  test("returns 200 with valid origin + destination + date", async () => {
    const req = createMockReq({ origin: "Mumbai", destination: "Pune", date: "2026-07-15" });
    const res = await POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  test("returns 400 when missing origin", async () => {
    const req = createMockReq({ destination: "Pune", date: "2026-07-15" });
    const res = await POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("required");
  });

  test("safeToTravel field is boolean in response", async () => {
    const req = createMockReq({ origin: "Mumbai", destination: "Pune", date: "2026-07-15" });
    const res = await POST(req as any);
    const data = await res.json();
    expect(typeof data.data.safeToTravel).toBe("boolean");
  });
});
