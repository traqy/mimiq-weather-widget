# PRD: Weather Widget — v1

## 1. Problem
Developers and learners need a self-contained weather widget they can drop into a demo or portfolio page without spinning up a backend or installing a toolchain. Existing examples are either over-engineered or missing basic polish (error states, refresh).

## 2. Target Users
- **Primary:** Developers wanting a drop-in weather component for demos, portfolios, or learning exercises.
- **Secondary:** End users viewing a page that embeds the widget.

## 3. v1 Scope (in)
- Single `.html` file — no build step, no dependencies
- Default city on load (London) — no blank first state
- City search input: Enter key or Search button triggers fetch
- Display: temperature, condition icon, condition text
- Refresh button — re-fetches current city
- Error state for city not found or API failure
- OpenWeatherMap free-tier API — user supplies their own key, hardcoded in the file

## 4. v1 Scope (out)
- No backend / API key proxy
- No geolocation ("use my location")
- No multi-city or favourites
- No forecast — current conditions only
- No C/F unit toggle — ship Celsius
- No localStorage persistence
- No React or any framework

## 5. Key Flows
1. **First load** — widget renders with London (default), immediate non-blank state.
2. **City change** — user types city → Enter or Search → fetch → re-render. Error state if city not found.
3. **Refresh** — re-fetches current city, updates display in place.

## 6. Technical Approach
- Plain HTML/CSS/JS, single file
- OpenWeatherMap API (free tier). Key is hardcoded in client-side JS — intentional for a demo widget. Whoever uses this needs their own free key. We are not building a proxy.
- No external dependencies

---

## Needs Human Input
- **Success metrics** — what does done look like in measurable terms?
- **Monetisation / pricing** — n/a for a demo widget, but confirm
- **Launch timeline & milestones** — any deadline or demo target?
- **Top business risks & mitigations** — [NEEDS HUMAN INPUT]
