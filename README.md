# MonsoonReady 🌧️

**AI-powered monsoon preparedness assistant for India.**

MonsoonReady generates personalized preparedness plans, location-aware checklists, travel advisories, and provides a multilingual conversational assistant — all tailored to the user's profile, language, and local weather forecast.

---

## Problem It Solves

Every year, the Indian monsoon season causes devastating floods, landslides, and infrastructure collapse, affecting millions. Most preparedness resources are generic PDFs or one-size-fits-all checklists that ignore a user's specific circumstances — their location, household composition (elderly, infants, disabled), language, and the actual weather forecast for their area.

MonsoonReady bridges this gap by combining **real-time weather data** (via Open-Meteo) with a **large language model** (via OpenRouter) to produce genuinely personalized, actionable preparedness guidance in the user's preferred language.

---

## Features

1. **Personalized Preparedness Plans** — AI-generated plan based on name, location, profile type (individual/family/community), household size, and special needs. Risk level color-coded green/yellow/orange/red.

2. **Phase-Specific Checklists** — Interactive checklists for Before / During / After Monsoon phases with progress tracking and urgent-item highlighting.

3. **Live Weather-Aware Advice** — 7-day Open-Meteo forecast (precipitation, wind, conditions) is fetched for the user's city and injected into the AI prompt, making advice genuinely location-aware.

4. **Travel Advisory** — Enter origin, destination, and date to get a GO / CAUTION / AVOID assessment with reasons, alternative routes, and recommended travel times.

5. **Multilingual Chat Assistant** — Floating chat widget supporting English, Hindi, and Marathi. Auto-detects language from user input. Always includes emergency number 112 in critical situations.

6. **Emergency Alert Banner** — When risk is high/extreme, a pulsing red banner displays with clickable emergency contacts: 112 (Police/Fire/Ambulance), 1078 (Flood Helpline), and NDRF (011-24363260).

7. **Rain Animation** — CSS-keyframed falling droplets in the background hero reinforce the monsoon theme.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| AI | OpenRouter (meta-llama/llama-3.3-70b-instruct:free) |
| Weather | Open-Meteo (free, no API key) |
| Geocoding | Open-Meteo Geocoding API |
| Rate Limiting | In-memory Map (10 req/min/IP) |

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/your-username/monsoon-ready.git
cd monsoon-ready

# 2. Install dependencies
npm install

# 3. Set environment variable
echo "OPENROUTER_API_KEY=sk-or-v1-your-key-here" > .env.local

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | API key from [openrouter.ai/keys](https://openrouter.ai/keys) |

The free model `meta-llama/llama-3.3-70b-instruct:free` is used, so no billing is required beyond a free OpenRouter account.

Open-Meteo weather and geocoding APIs are completely free and require no API key.

---

## Deployment on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fmonsoon-ready)

1. Push the repo to GitHub
2. Import into Vercel
3. Add `OPENROUTER_API_KEY` to Environment Variables in the Vercel dashboard
4. Deploy — zero configuration required

The free OpenRouter model has rate limits (~20 req/min). For production, consider upgrading to a paid model.

---

## Gen AI Usage

All AI functionality is routed through a single shared client (`lib/openrouter.ts`) using **OpenRouter** with the **meta-llama/llama-3.3-70b-instruct:free** model.

| Endpoint | System Prompt | Purpose |
|----------|--------------|---------|
| `POST /api/monsoon-plan` | `PREPAREDNESS_PROMPT` | Generates a personalized plan including risk assessment, phase-specific actions, weather-aware tips, and safety recommendations. Live weather data from Open-Meteo is injected into the prompt. |
| `POST /api/checklist` | `CHECKLIST_PROMPT` | Generates 8–12 actionable checklist items for a given monsoon phase (before/during/after), with urgency markers. |
| `POST /api/advisory` | `ADVISORY_PROMPT` | Assesses travel safety between two locations on a given date, returning risk level, reasons, alternative routes, and best travel time. |
| `POST /api/chat` | `CHAT_SYSTEM_PROMPT` | Powers the multilingual assistant. Auto-detects language, knows NDRF protocols and flood safety, and always includes "Call 112" for emergencies. |

All responses are parsed as JSON with markdown fence stripping for robustness. Errors never leak raw AI output to the client.

---

## Project Structure

```
app/
  page.tsx                  ← Landing page + profile form + rain animation
  plan/page.tsx             ← Results dashboard
  api/
    monsoon-plan/route.ts   ← Personalized plan (with weather injection)
    checklist/route.ts      ← Phase-specific checklists
    advisory/route.ts       ← Travel advisory
    chat/route.ts           ← Multilingual chat
components/
  ProfileForm.tsx           ← Profile collection (name, location, profile type, etc.)
  PlanDashboard.tsx         ← Dashboard layout with all sections
  PhaseToggle.tsx           ← Before/During/After tab switcher
  ChecklistCard.tsx         ← Interactive checklist with progress
  TravelAdvisory.tsx        ← Travel safety form + GO/CAUTION/AVOID result
  AlertBanner.tsx           ← Emergency alert banner with contacts
  ChatWidget.tsx            ← Floating multilingual chat
lib/
  openrouter.ts             ← Shared AI client (callAI)
  weatherApi.ts             ← Open-Meteo 7-day forecast
  prompts.ts                ← All system prompts + prompt builders
  rateLimiter.ts            ← In-memory rate limiter (10 req/min/IP)
  utils.ts                  ← JSON parser (markdown fence stripping)
types/
  index.ts                  ← Shared TypeScript interfaces
```
