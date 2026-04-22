# Weather Widget — Requirements Document

## Functional Requirements

### FR-1: Initial Load
- On page load, display weather for London (hardcoded default)
- Display: city name, temperature (°C), condition text, weather icon
- Fetch from OpenWeatherMap current weather endpoint on load

### FR-2: City Search
- Text input accepts any city name
- Search triggered by: clicking Search button OR pressing Enter
- Empty input: no fetch, no message, input stays focused
- City name encoded with `encodeURIComponent` before appending to URL

### FR-3: Weather Display
- Temperature: integer °C (`Math.round`, no decimal)
- Condition: text description from API (e.g. "Clear sky", "Light rain")
- Icon: OpenWeatherMap icon (`https://openweathermap.org/img/wn/{icon}@2x.png`)
- City name: as returned by the API

### FR-4: Refresh
- Refresh button re-fetches weather for the currently displayed city
- Does NOT reset to London default

### FR-5: Error Handling
- Any non-2xx API response (401, 404, 429): display friendly error message
- Network failure (fetch throws): display friendly error message
- Error state replaces weather display; refresh button remains visible and active
- 401 and 404 route through the same `response.ok` code path

### FR-6: API Configuration
- OpenWeatherMap free tier, current weather endpoint
- API key: hardcoded placeholder `YOUR_API_KEY_HERE` in the file
- Placeholder documented with an inline comment — user replaces before use

---

## Non-Functional Requirements

### NFR-1: Delivery format
- Single `.html` file — HTML, CSS, and JS inline
- No build step, no external dependencies, no framework
- Runs by opening directly in any modern browser

### NFR-2: Character encoding
- `encodeURIComponent` applied to city input — handles São Paulo, Zürich, etc.

### NFR-3: API key handling
- Placeholder documented in the file
- No proxy, no server-side secret management — acceptable for demo widget

---

## Out of Scope (v1)

| Feature | Reason deferred |
|---|---|
| Geolocation / auto-detect city | Adds permissions complexity, not core to widget |
| Forecast (multi-day or hourly) | Different API endpoint, different UI — v2 |
| Celsius/Fahrenheit toggle | Scope creep — London audience defaults to °C |
| localStorage persistence | Stateless widget is simpler and good enough |
| Multi-city support | Single-city is the v1 value proposition |
| API proxy / server-side key | Overkill for a demo widget |

---

## Acceptance Criteria

| # | Scenario | Expected result |
|---|----------|----------------|
| AC-1 | Page loads | London weather shown: temp (°C), condition text, icon |
| AC-2 | User types valid city + presses Enter | Display updates to that city |
| AC-3 | User types valid city + clicks Search | Display updates to that city |
| AC-4 | User submits empty input | No fetch, no UI change, input stays focused |
| AC-5 | User types invalid city name (404) | Friendly error message shown |
| AC-6 | API key is invalid (401) | Friendly error message shown (same path as 404) |
| AC-7 | Network unavailable (fetch throws) | Friendly error message shown |
| AC-8 | User clicks Refresh | Re-fetches current city — not London |
| AC-9 | City name contains non-ASCII characters | Request succeeds (encodeURIComponent applied) |
