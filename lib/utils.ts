export function parseJSON<T>(raw: string): T {
  const trimmed = raw.trim();

  const blockMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  const clean = blockMatch ? blockMatch[1].trim() : trimmed;

  return JSON.parse(clean) as T;
}
