/**
 * @jest-environment node
 */

import { checkRateLimit } from "@/lib/rateLimiter";

// rateLimiter uses a module-level Map, so tests share state
// We re-import to get fresh state

describe("Rate limiter", () => {
  test("first 10 requests from same IP are allowed", () => {
    for (let i = 0; i < 10; i++) {
      const result = checkRateLimit("test-ip-1");
      expect(result.allowed).toBe(true);
    }
  });

  test("11th request from same IP returns 429", () => {
    // The module-level Map persists across tests, so reset not possible.
    // This test checks that after many requests, rate limiting kicks in.
    // We'll use the state from the previous test (10 requests already sent).
    const result = checkRateLimit("test-ip-1");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  test("request from different IP after limit is not blocked", () => {
    const result = checkRateLimit("different-ip");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThan(0);
  });
});
