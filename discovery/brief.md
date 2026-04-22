# Weather Widget — Product Requirements Document (50% Draft)

## 1. Problem

Developers and students building frontend demos need a self-contained weather widget they can drop into any page without a backend, build tool, or API proxy. Existing solutions either require React/bundlers or carry too many features to serve as a clean learning example. There is no canonical "open in browser, it works" widget.

## 2. Target Users

**Primary:** Frontend developers and students who want a self-contained demo component — no build step, no backend dependency.

**Secondary:** Anyone who wants a quick weather lookup without installing an app.

## 3. v1 Scope (In)

- Single `.html` file — opens directly in a browser, zero build step
- Default city: London on first load (never a blank state)
- City search: text input + Enter key / Search button
- Current conditions: temperature + weather condition icon
- Refresh button: re-fetches for the active city
- Error state: friendly message when city not found or API fails
- OpenWeatherMap free-tier API, `YOUR_API_KEY_HERE` placeholder with inline comment directing users to swap in their own key

## 4. v1 Scope (Out)

- Geolocation (auto-detect user's city)
- Multi-day forecast
- Celsius / Fahrenheit toggle
- localStorage (remembering last city)
- Multi-city support
- API key proxy or backend of any kind
- Any framework or build toolchain (React, Vite, etc.)

## 5. Key Flows

*Contributed by Stuart (Engineer)*

1. **First load** — Widget renders immediately with London weather. No blank state on open.
2. **City change** — User types a city name, presses Enter or clicks Search. Widget fetches and re-renders. Error state shown if city not found.
3. **Refresh** — Re-fetches current conditions for the active city. Same city, fresh data.

## 6. Technical Approach

*Contributed by Stuart (Engineer)*

- **Stack:** Single `weather.html` — HTML + CSS + vanilla JS, zero dependencies
- **API:** OpenWeatherMap Current Weather endpoint (free tier)
- **Key handling:** `YOUR_API_KEY_HERE` placeholder with inline comment. Key is client-side visible — documented as a known limitation for a demo widget, not a bug. Users supply their own free-tier key.
- **No backend, no proxy** — out of scope by design.
- **Notable risk:** OpenWeatherMap free tier has rate limits (60 calls/min). Acceptable for a single-user demo; not a concern for v1.

## 7. Open Engineering Questions

*Flagged by Mark (QA) — must be resolved during build before QA sign-off*

1. **Empty search input** — What happens when the user hits Search or Enter with an empty field? Options: (a) ignore the action, (b) show an inline validation message, (c) re-fetch the current city. Engineering to pick one and implement consistently.
2. **401 / non-200 error handling** — The error state must trigger on any non-OK API response (including a 401 from an invalid/placeholder key), not only on network-level exceptions. Ensure `response.ok` is checked before parsing JSON — a bare `catch(e)` will not catch a 401.
3. **Special character encoding** — City names like São Paulo or Zürich must be URL-encoded in the fetch call. OpenWeatherMap handles them server-side but the JS input must encode before sending.

---

## [NEEDS HUMAN INPUT]

- **Success metrics** — What does success look like in numbers? (Stars, tutorial adoption, internal use?)
- **Monetisation / pricing** — Likely N/A for a demo widget — confirm.
- **Launch timeline & milestones** — Any deadline or target?
- **Top business risks & mitigations** — Key rotation plan if used beyond demo? Rate limit strategy for production use?
