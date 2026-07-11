# Hackathon Submission — MonsoonReady

## Describe changes in deployed version

MonsoonReady is an AI-powered monsoon preparedness assistant built with Next.js 14 (App Router, TypeScript, Tailwind CSS). The application delivers seven core features through a polished, animated interface:

1. **Personalized Preparedness Plans** — Users complete a profile form (name, city, profile type, household size, elderly/infant/disabled status, language, alert preference). On submission, the app geocodes the city, fetches a live 7-day weather forecast from Open-Meteo, and passes both the profile and weather data to an LLM via OpenRouter. The AI returns a structured plan with risk assessment, weather-aware tips, and phase-specific actions.

2. **Phase-Specific Checklists** — Interactive Before/During/After tabs with checkable items, progress bars, urgent-item highlighting, and AI-generated content tailored to the user's profile.

3. **Live Weather-Aware Advice** — The AI prompt includes real precipitation, wind, and condition forecasts, making advice genuinely location-aware ("42mm rain expected Tuesday — clear drains today").

4. **Travel Advisory** — A dedicated form takes origin, destination, and date, calls the AI for a safety assessment, and displays a GO/CAUTION/AVOID banner with reasons, alternative routes, and best travel times.

5. **Multilingual Chat Assistant** — A floating chat widget supports English, Hindi, and Marathi. The AI auto-detects language from user input, displays a live language badge (EN/HI/MR), and always includes emergency numbers in critical contexts.

6. **Emergency Alert Banner** — When risk is high/extreme, a pulsing red banner displays emergency contacts: 112 (Police/Fire/Ambulance), 1078 (Flood Helpline), and NDRF (011-24363260).

7. **Rain Animation** — Fifty CSS-keyframed falling droplets in the landing page hero reinforce the monsoon theme.

All API routes implement rate limiting (10 req/min/IP via in-memory Map), input validation (400 on missing fields), safe JSON parsing (markdown fence stripping), and generic 500 errors that never leak AI response details. Framer Motion powers staggered form animations, AnimatePresence tab transitions, pulsing alerts, and the loading button.

## Gen AI services utilized

All AI functionality is routed through a single shared client (`lib/openrouter.ts`) using **OpenRouter** with the **meta-llama/llama-3.3-70b-instruct:free** model.

### AI touchpoints

**1. `POST /api/monsoon-plan`** — System prompt `PREPAREDNESS_PROMPT`
- Receives user profile (name, location, profile type, household size, elderly/infant/disabled flags, language) and live 7-day weather forecast from Open-Meteo.
- Generates a personalized preparedness plan as JSON with: plan title/summary/priority, weather-aware tips, before/during/after monsoon actions, safety recommendations, and estimated risk level (low/moderate/high/extreme).
- Responds in the user's chosen language (English, Hindi, or Marathi).

**2. `POST /api/checklist`** — System prompt `CHECKLIST_PROMPT`
- Receives a monsoon phase (before/during/after) and user profile subset.
- Generates 8–12 actionable checklist items as JSON, each with task description, category (supplies/documents/safety/communication/health/evacuation), and urgency flag.

**3. `POST /api/advisory`** — System prompt `ADVISORY_PROMPT`
- Receives origin, destination, and travel date.
- Assesses travel safety considering monsoon patterns and flood-prone routes.
- Returns JSON with safeToTravel boolean, risk level, reasons, alternative routes, and best time to travel.

**4. `POST /api/chat`** — System prompt `CHAT_SYSTEM_PROMPT`
- Receives user message, conversation history, and preferred language.
- Auto-detects the user's language from their message.
- Answers as a multilingual monsoon safety assistant knowledgeable about NDRF protocols, flood safety, evacuation procedures, and waterborne disease prevention.
- Always includes "Call 112 (India's emergency number) immediately" in emergency contexts.

### Safety and robustness

- All AI responses are parsed through `parseJSON()` which strips markdown code fences before `JSON.parse()`.
- All catch blocks return generic "Something went wrong" messages — raw errors are never exposed to the client but are logged server-side via `console.error`.
- Rate limiting (10 requests per minute per IP) protects all endpoints via an in-memory sliding-window Map.
- The chat endpoint folds conversation history into the user message string to maintain context within the simplified `callAI(systemPrompt, userMessage)` interface.
