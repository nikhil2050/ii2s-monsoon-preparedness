export function createMockFetch(overrides?: Record<string, (url: string, options?: RequestInit) => Promise<Response>>) {
  return jest.fn().mockImplementation((url: string, options?: RequestInit) => {
    // Check overrides first
    if (overrides) {
      for (const [pattern, handler] of Object.entries(overrides)) {
        if (url.includes(pattern)) return handler(url, options);
      }
    }
    // Default: return OK with empty JSON
    return Promise.resolve(new Response(JSON.stringify({}), { status: 200 }));
  });
}

export function mockOpenRouterResponse(content: string): Response {
  return new Response(
    JSON.stringify({
      choices: [{ message: { content } }],
    }),
    { status: 200 }
  );
}

export function mockOpenMeteoGeocoding(lat = 18.52, lon = 73.86, name = "Pune"): Response {
  return new Response(
    JSON.stringify({
      results: [{ name, latitude: lat, longitude: lon }],
    }),
    { status: 200 }
  );
}

export function mockOpenMeteoForecast(): Response {
  return new Response(
    JSON.stringify({
      daily: {
        time: ["2026-07-10", "2026-07-11", "2026-07-12", "2026-07-13", "2026-07-14", "2026-07-15", "2026-07-16"],
        precipitation_sum: [85, 45, 22, 8, 0, 12, 55],
        weather_code: [95, 65, 63, 3, 0, 51, 82],
        wind_speed_10m_max: [32, 28, 15, 12, 8, 18, 42],
      },
    }),
    { status: 200 }
  );
}

export function createMockNextRequest(url: string, body: Record<string, unknown>, ip = "127.0.0.1"): Request {
  const request = new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
  return request;
}
