export function parseJSON<T>(raw: string): T {
  const trimmed = raw.trim();

  const blockMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  let clean = blockMatch ? blockMatch[1].trim() : trimmed;

  clean = clean.replace(/[\u0000-\u001F]/g, "");

  return JSON.parse(clean) as T;
}
