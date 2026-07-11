const requestLog = new Map<string, number[]>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];

  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  const remaining = Math.max(0, MAX_REQUESTS - recent.length);
  const resetIn = recent.length > 0 ? WINDOW_MS - (now - recent[0]) : 0;

  if (recent.length >= MAX_REQUESTS) {
    requestLog.set(ip, recent);
    return { allowed: false, remaining: 0, resetIn };
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return { allowed: true, remaining, resetIn };
}
