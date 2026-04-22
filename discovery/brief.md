# Discovery Brief — Weather Widget

## 1. Problem
Users want a quick, at-a-glance weather check for a specific city without loading a full app or website. Developers want a lightweight, embeddable widget they can drop into a demo or portfolio page with minimal setup. No existing solution is both dead-simple to embed and free of framework dependencies.

## 2. Target Users
**Primary:** Developers building demo or portfolio pages who need a real, functional widget without a toolchain.
**Secondary:** Anyone wanting a standalone, browser-openable weather checker for personal use.

## 3. v1 Scope — IN
- Current temperature (°C)
- Weather condition text + icon (from OpenWeatherMap)
- City search by name (text input + Enter key or Search button)
- Refresh button (re-fetches current city)
- Default city: London on first load
- Error state when city is not found or API call fails
- Single `.html` file — no build step, no framework, opens directly in browser
- OpenWeatherMap free-tier API; key hardcoded client-side (documented as not secret — each deployer supplies their own key)

## 4. v1 Scope — OUT
- Geolocation / auto-detect city
- Forecast (hourly or daily)
- Unit toggle (°C / °F)
- localStorage persistence for last searched city
- Multi-city support
- Backend API proxy (key is intentionally client-side for v1)
- Packaging as a reusable component or npm module

## 5. Key Flows
1. **First load** — widget renders immediately with London; no blank state.
2. **City change** — user types a city name, hits Enter or clicks Search; widget fetches and re-renders. Shows error if city not found.
3. **Refresh** — re-fetches conditions for the current city; same city, fresh data.

## 6. Technical Approach
- Single `.html` file — HTML + CSS + vanilla JS, no build toolchain.
- OpenWeatherMap Current Weather API (free tier). Key hardcoded in JS — acceptable for a demo widget. Documented clearly in the file so forkers know to swap it.
- No backend, no proxy, no server required. Open the file in a browser and it works.
- **Notable risk:** API key is publicly visible in client-side source. Mitigated by: free-tier key with low quota, explicit documentation that this is a demo pattern, out-of-scope for v1 to add a proxy.

---

## Sections Requiring Human Input

- **Success metrics** `[NEEDS HUMAN INPUT]` — what does a successful v1 look like in numbers?
- **Monetisation / pricing** `[NEEDS HUMAN INPUT]` — open-source? MIT licence? Anything else?
- **Launch timeline & milestones** `[NEEDS HUMAN INPUT]`
- **Top business risks & mitigations** `[NEEDS HUMAN INPUT]`
