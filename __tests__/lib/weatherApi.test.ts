/**
 * @jest-environment node
 */

import { getWeatherForecast } from "@/lib/weatherApi";

const mockGeocodingResponse = {
  results: [{ name: "Pune", latitude: 18.52, longitude: 73.86 }],
};

const mockForecastResponse = {
  daily: {
    time: ["2026-07-10", "2026-07-11", "2026-07-12"],
    precipitation_sum: [45, 22, 8],
    weather_code: [65, 63, 3],
    wind_speed_10m_max: [28, 15, 12],
  },
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("getWeatherForecast", () => {
  test("returns correctly shaped forecast array for valid city", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(mockGeocodingResponse), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockForecastResponse), { status: 200 }));

    const result = await getWeatherForecast("Pune");
    expect(result).not.toBeNull();
    expect(result!.forecast.city).toBe("Pune");
    expect(result!.forecast.forecast).toHaveLength(3);
    expect(result!.summary).toContain("Pune");
  });

  test("returns null when city not found", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ results: [] }), { status: 200 })
    );

    const result = await getWeatherForecast("UnknownCityXYZ");
    expect(result).toBeNull();
  });

  test("rainMm and windKmh are numbers, not strings", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(mockGeocodingResponse), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockForecastResponse), { status: 200 }));

    const result = await getWeatherForecast("Pune");
    expect(result).not.toBeNull();
    result!.forecast.forecast.forEach((day) => {
      expect(typeof day.rainMm).toBe("number");
      expect(typeof day.windKmh).toBe("number");
    });
  });
});
