# QA Report — Weather Widget

**Date**: 2026-04-23  
**Engineer**: Stuart  
**QA**: Mark  
**Build**: `engineering/weather-widget.html`  
**Verdict**: PASS WITH NOTES

---

## Acceptance Criteria

| # | Scenario | Result | Evidence |
|---|----------|--------|----------|
| AC-1 | Page loads → London weather shown | ✅ PASS | `fetchWeather('London')` called inline at L283; `currentCity` initialised to `'London'` at L190 |
| AC-2 | Valid city + Enter → display updates | ✅ PASS | `keydown` listener at L279–281 calls `handleSearch()` on `e.key === 'Enter'` |
| AC-3 | Valid city + Search click → display updates | ✅ PASS | `onclick="handleSearch()"` at L147 |
| AC-4 | Empty input submitted → no-op, focus retained | ✅ PASS | `handleSearch()` trims, checks empty, calls `input.focus()` and returns at L268–271 |
| AC-5 | Invalid city (404) → friendly error | ✅ PASS | `if (!response.ok)` at L249 catches 404; shows `body.message` or status fallback |
| AC-6 | Invalid API key (401) → friendly error | ✅ PASS | Same `response.ok` path as 404 — no special-casing |
| AC-7 | Network failure → friendly error | ✅ PASS | `catch (err)` at L257 shows `'Network error — check your connection.'` |
| AC-8 | Refresh → re-fetches current city, not London | ✅ PASS | `refresh()` at L276 calls `fetchWeather(currentCity)`; `currentCity` updated to `data.name` on every successful fetch at L255 |
| AC-9 | Non-ASCII city name → request succeeds | ✅ PASS | `encodeURIComponent(city)` applied at L246 before URL assembly |

---

## Functional Requirements

### FR-1: Initial Load
- Default city London: ✅ `fetchWeather('London')` at L283
- City name, temp, condition, icon all populated in `showWeather()`: ✅

### FR-2: City Search
- Both Enter and click trigger search: ✅
- Empty input no-op: ✅
- `encodeURIComponent` applied: ✅

### FR-3: Weather Display
- Temperature: `Math.round(data.main.temp) + '°C'` at L210 — integer, no decimal: ✅
- Condition text: `data.weather[0].description` at L211, capitalised via CSS `text-transform`: ✅
- Icon: `https://openweathermap.org/img/wn/{icon}@2x.png` at L217: ✅
- City name from API (`data.name + ', ' + data.sys.country`) at L209: ✅

### FR-4: Refresh
- Re-fetches `currentCity`, which is the canonical API name of the last successful city: ✅

### FR-5: Error Handling
- Non-2xx via `response.ok`: ✅
- Network catch: ✅
- Error replaces weather card: ✅
- `showError()` deliberately does not touch `refresh-btn` visibility (comment at L232 confirms intent): ✅

### FR-6: API Configuration
- Placeholder at L187: `const API_KEY = 'YOUR_API_KEY_HERE';` — greppable, matches spec: ✅
- Inline documentation comment at L183–186 with sign-up URL and key handling note: ✅

---

## Non-Functional Requirements

### NFR-1: Single file
- One `.html` file, CSS and JS inline, no `<link>` or `<script src>` external deps: ✅

### NFR-2: encodeURIComponent
- Applied at L246: ✅

### NFR-3: API key handling
- Placeholder documented, no proxy: ✅

---

## Security

- All API-sourced strings written via `textContent` (L209–214), never `innerHTML`: ✅ XSS-safe
- Icon `src` and `alt` set via DOM property assignment (L217–218), not innerHTML: ✅
- No `eval`, no `document.write`: ✅

---

## Concurrency / Race Conditions

- `isFetching` lock at L241 prevents concurrent fetches on rapid search clicks: ✅
- Both Search and Refresh buttons disabled during fetch (`setButtons(true)` at L243); re-enabled in `finally` at L260: ✅

---

## Notes (non-blocking)

### Note 1 — Refresh button hidden on first-load failure
**Observation**: `refresh-btn` starts hidden (L179). It is revealed only on the first successful `showWeather()` call (L224). `showError()` deliberately does not reveal it. If the very first fetch (London on load) fails — e.g., device is offline at page open — the refresh button never appears. The user must manually type a city to retry.  
**Verdict**: Not a blocker. FR-5 says "remains visible" implying prior visibility. The search input is the correct recovery path when no city has ever loaded. Acceptable.

### Note 2 — Refresh after failed search uses last successful city
**Observation**: Searching for an invalid city returns a 404 error. `currentCity` is only updated on success (L255), so it still holds the previous good city (e.g., `'London'`). Clicking Refresh re-fetches London, not the invalid search term.  
**Verdict**: Correct behaviour. "Refresh the currently *displayed* city" — an error is not a displayed city. No spec violation.

### Note 3 — Whitespace-only input retains spaces after no-op
**Observation**: Input of `"   "` (spaces only) is trimmed to empty, triggers the no-op path, and returns focus — but the spaces remain in the input field. No spec requirement covers this; the user simply sees their whitespace still there.  
**Verdict**: Cosmetic. Not a spec violation. Engineering may optionally clear the input on no-op but it's not required.

---

## Summary

All 9 acceptance criteria pass. All functional and non-functional requirements are met. Security posture is solid. Concurrency is handled. Three notes filed — none require a code fix before ship.

**Overall verdict: PASS WITH NOTES**
