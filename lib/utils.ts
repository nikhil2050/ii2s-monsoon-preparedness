import JSON5 from "json5";

export function parseJSON<T>(raw: string): T {
  const trimmed = raw.trim();

  const blockMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  let clean = blockMatch ? blockMatch[1].trim() : trimmed;

  clean = clean.replace(/[\u0000-\u001F]/g, "");

  try {
    return JSON5.parse(clean) as T;
  } catch (err) {
    console.error("parseJSON failed on:", clean.slice(0, 500));
    throw err;
  }
}
