/**
 * @jest-environment node
 */

import { POST } from "@/app/api/chat/route";
import { callAI } from "@/lib/ai";

jest.mock("@/lib/ai");

beforeEach(() => {
  jest.clearAllMocks();
  (callAI as jest.Mock).mockResolvedValue("Stay safe during the monsoon. Call 112 in emergencies.");
});

function createMockReq(body: Record<string, unknown>, ip = "127.0.0.1"): Request {
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  }) as unknown as Request;
}

describe("POST /api/chat", () => {
  test("returns 200 with message + history", async () => {
    const req = createMockReq({
      message: "What should I do during floods?",
      history: [{ id: "1", role: "assistant", content: "Hello!", timestamp: new Date().toISOString() }],
    });
    const res = await POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  test("returns 400 when message is empty", async () => {
    const req = createMockReq({ message: "" });
    const res = await POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Message is required");
  });

  test("returns 400 when message is missing", async () => {
    const req = createMockReq({});
    const res = await POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  test("response contains a non-empty reply string", async () => {
    const req = createMockReq({ message: "What should I do?" });
    const res = await POST(req as any);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.message.length).toBeGreaterThan(0);
  });
});
