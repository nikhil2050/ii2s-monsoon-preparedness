import type { WeatherForecast, ForecastItem } from "@/types";

const WMO_CONDITIONS: Record<number, string> = {
  0: "clear",
  1: "mainly clear",
  2: "partly cloudy",
  3: "overcast",
  45: "foggy",
  48: "depositing rime fog",
  51: "light drizzle",
  53: "moderate drizzle",
  55: "dense drizzle",
  56: "light freezing drizzle",
  57: "dense freezing drizzle",
  61: "slight rain",
  63: "moderate rain",
  65: "heavy rain",
  66: "light freezing rain",
  67: "heavy freezing rain",
  71: "slight snow",
  73: "moderate snow",
  75: "heavy snow",
  77: "snow grains",
  80: "slight rain showers",
  81: "moderate rain showers",
  82: "violent rain showers",
  85: "slight snow showers",
  86: "heavy snow showers",
  95: "thunderstorm",
  96: "thunderstorm with slight hail",
  99: "thunderstorm with heavy hail",
};

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function geocodeCity(city: string): Promise<{ name: string; lat: number; lon: number } | null> {
  const params = new URLSearchParams({ name: city, count: "1", language: "en", format: "json" });
  const res = await fetch(`${GEOCODING_URL}?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  const result = data.results?.[0];
  if (!result) return null;
  return { name: result.name, lat: result.latitude, lon: result.longitude };
}

async function fetchDailyForecast(lat: number, lon: number): Promise<ForecastItem[]> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    daily: "precipitation_sum,weather_code,wind_speed_10m_max",
    timezone: "auto",
    forecast_days: "7",
  });

  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error(`Forecast API error: ${res.statusText}`);

  const data = await res.json();
  const daily = data.daily;

  return daily.time.map((date: string, i: number) => ({
    date,
    rainMm: daily.precipitation_sum[i] ?? 0,
    windKmh: daily.wind_speed_10m_max[i] ?? 0,
    condition: WMO_CONDITIONS[daily.weather_code[i]] ?? "unknown",
  }));
}

function summarizeForecast(city: string, forecast: ForecastItem[]): string {
  const totalRain = forecast.reduce((s, d) => s + d.rainMm, 0);
  const maxWind = Math.max(...forecast.map((d) => d.windKmh));
  const rainyDays = forecast.filter((d) => d.rainMm > 5);

  if (forecast.length === 0) return "";

  let summary = `Current 7-day forecast for ${city}: ${totalRain.toFixed(0)}mm rain expected in total, `;
  summary += `max wind ${maxWind.toFixed(0)} km/h. `;

  if (rainyDays.length > 0) {
    summary += `Heaviest rain days: ${rainyDays
      .slice(0, 3)
      .map((d) => `${d.date} (${d.rainMm.toFixed(0)}mm, ${d.condition})`)
      .join(", ")}. `;
  }

  return summary.trim();
}

export async function getWeatherForecast(city: string): Promise<{
  forecast: WeatherForecast;
  summary: string;
} | null> {
  const geo = await geocodeCity(city);
  if (!geo) return null;

  const forecast = await fetchDailyForecast(geo.lat, geo.lon);

  const result: WeatherForecast = {
    city: geo.name,
    lat: geo.lat,
    lon: geo.lon,
    forecast,
  };

  return { forecast: result, summary: summarizeForecast(geo.name, forecast) };
}
