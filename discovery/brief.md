# Weather Widget — Draft PRD (50%)

> **Status:** Draft — awaiting human review on sections marked [NEEDS HUMAN INPUT]

---

## 1. Problem

Developers and learning engineers need a lightweight, self-contained weather widget for demos, prototypes, and API-integration examples. Existing options are either framework-heavy libraries or require backend infrastructure. There is no obvious "grab and go" single-file option.

---

## 2. Target Users

**Primary:** Frontend developers building demos or prototypes who need a working weather component without dependencies or a build pipeline.

**Secondary:** Students and early-career engineers learning how to integrate a real external API in a plain HTML/JS project.

---

## 3. v1 Scope — In

- Single `.html` file (HTML + CSS + JS inline — no build step, no framework)
- London loaded automatically on first render
- City search: text input + Search button (Enter key also triggers)
- Displays: temperature (°C), condition text, OpenWeatherMap condition icon
- Refresh button re-fetches the current city
- Error state for invalid city, non-2xx API responses (401, 404, 429), and network failure
- Empty input is ignored — no fetch, no message
- `encodeURIComponent` on city name (handles São Paulo, Zürich, etc.)
- Placeholder API key with a clear documentation comment on how to replace it

---

## 4. v1 Scope — Out

- Geolocation (no auto-detect)
- Forecast or hourly/daily views
- °C/°F unit toggle
- localStorage (no persisting last city between page loads)
- Multi-city or favourites
- API key proxy (key stays client-side, documented as demo-only)
- Framework, bundler, or build step
- Full responsive/mobile-first design (sensible max-width only)

---

## 5. Key Flows

1. **Initial load:** Page loads → fetch London current weather → display temperature + condition text + icon
2. **City search:** User types city name → presses Search or Enter → fetch new city → update display; show error state on any failure
3. **Refresh:** User presses Refresh → re-fetch current city → update display

*Contributed by Stuart (Full-stack Engineer)*

---

## 6. Technical Approach

- Single `.html` file, vanilla JS — no dependencies, no build step
- OpenWeatherMap free tier (current weather endpoint)
- API key: hardcoded placeholder with documentation comment explaining how to replace it
- All fetches: `response.ok` check — any non-2xx routes to a single friendly error state
- City input: `encodeURIComponent`-wrapped before API call
- Empty input: action is ignored, no fetch triggered

*Contributed by Stuart; QA gaps confirmed closed by Mark (QA Engineer)*

---

## [NEEDS HUMAN INPUT]

- **Success metrics** — what does a successful v1 look like in numbers?
- **Monetisation / pricing** — n/a for a demo widget, but please confirm
- **Launch timeline & milestones** — when does this need to ship?
- **Top business risks & mitigations** — e.g. API key exposure, OpenWeatherMap rate limits in production use
