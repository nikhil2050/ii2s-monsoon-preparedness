import {
  PREPAREDNESS_PROMPT,
  CHAT_SYSTEM_PROMPT,
  CHECKLIST_PROMPT,
  ADVISORY_PROMPT,
  buildPlanPrompt,
  buildChecklistPrompt,
  buildAdvisoryPrompt,
} from "@/lib/prompts";

describe("Prompt constants", () => {
  test("PREPAREDNESS_PROMPT contains the word JSON", () => {
    expect(PREPAREDNESS_PROMPT).toContain("JSON");
  });

  test("CHAT_SYSTEM_PROMPT contains 112 (India emergency number)", () => {
    expect(CHAT_SYSTEM_PROMPT).toContain("112");
  });

  test("CHECKLIST_PROMPT mentions monsoon, phase, and emergency", () => {
    expect(CHECKLIST_PROMPT).toContain("monsoon");
    expect(CHECKLIST_PROMPT).toContain("checklist");
    expect(CHECKLIST_PROMPT).toContain("emergency");
  });

  test("all prompts are non-empty strings", () => {
    expect(PREPAREDNESS_PROMPT).toBeTruthy();
    expect(typeof PREPAREDNESS_PROMPT).toBe("string");
    expect(PREPAREDNESS_PROMPT.length).toBeGreaterThan(10);

    expect(CHAT_SYSTEM_PROMPT).toBeTruthy();
    expect(typeof CHAT_SYSTEM_PROMPT).toBe("string");
    expect(CHAT_SYSTEM_PROMPT.length).toBeGreaterThan(10);

    expect(CHECKLIST_PROMPT).toBeTruthy();
    expect(typeof CHECKLIST_PROMPT).toBe("string");
    expect(CHECKLIST_PROMPT.length).toBeGreaterThan(10);

    expect(ADVISORY_PROMPT).toBeTruthy();
    expect(typeof ADVISORY_PROMPT).toBe("string");
    expect(ADVISORY_PROMPT.length).toBeGreaterThan(10);
  });
});

describe("buildPlanPrompt", () => {
  test("includes weather summary when provided", () => {
    const profile = {
      name: "Test",
      location: "Pune",
      profileType: "individual" as const,
      householdSize: 1,
      hasElderly: false,
      hasInfants: false,
      hasDisabled: false,
      language: "English",
      alertLevel: "informational" as const,
    };
    const result = buildPlanPrompt(profile, "Heavy rain expected");
    expect(result).toContain("Live Weather Data");
    expect(result).toContain("Heavy rain expected");
  });

  test("omits weather summary when not provided", () => {
    const profile = {
      name: "Test",
      location: "Pune",
      profileType: "individual" as const,
      householdSize: 1,
      hasElderly: false,
      hasInfants: false,
      hasDisabled: false,
      language: "English",
      alertLevel: "informational" as const,
    };
    const result = buildPlanPrompt(profile);
    expect(result).not.toContain("Live Weather Data");
  });
});

describe("buildChecklistPrompt", () => {
  test("includes phase and profile in output", () => {
    const profile = { profileType: "family", householdSize: 3, hasElderly: true, hasInfants: false, hasDisabled: false };
    const result = buildChecklistPrompt("before", profile);
    expect(result).toContain("before");
    expect(result).toContain("family");
  });
});

describe("buildAdvisoryPrompt", () => {
  test("includes origin, destination, and date", () => {
    const result = buildAdvisoryPrompt("Mumbai", "Pune", "2026-07-15");
    expect(result).toContain("Mumbai");
    expect(result).toContain("Pune");
    expect(result).toContain("2026-07-15");
  });
});
