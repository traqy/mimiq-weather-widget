# Weather Widget — Playwright Test Suite

Covers all 9 acceptance criteria plus FR-5 (refresh visibility), the isFetching concurrency lock, and the API key setup screen. All tests mock the OpenWeatherMap API — no real key or live network required.

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9

---

## Setup

```sh
cd qa/playwright
npm install
npx playwright install --with-deps chromium firefox webkit
```

---

## Run tests

```sh
# All browsers (chromium, firefox, webkit, mobile chrome)
npm test

# Single browser — fastest for local iteration
npm run test:chromium

# With browser visible (useful for watching what happens)
npm run test:headed
```

---

## View results

After a run, open the HTML report:

```sh
npm run report
```

Or open `qa/playwright/playwright-report/index.html` directly in a browser.

---

## Screen recordings

`video: 'on'` is set in `playwright.config.js` — every test is recorded regardless of pass/fail.

Recordings are written to `test-results/` after each run. Inside each test folder you'll find a `video.webm` file. Open with VLC, QuickTime, or any media player that supports WebM.

Example path after a run:

```
qa/playwright/test-results/
  weather-widget-AC-1-page-load-chromium/
    video.webm
    screenshot.png
  weather-widget-AC-2-Enter-key-chromium/
    video.webm
    screenshot.png
  ...
```

---

## Test coverage

| Test | AC / Requirement |
|------|-----------------|
| Page load shows London weather | AC-1 |
| Enter key searches city | AC-2 |
| Search button click | AC-3 |
| Empty input is a no-op, input stays focused | AC-4 |
| Invalid city (404) → friendly error | AC-5 |
| Invalid API key (401) → friendly error | AC-6 |
| Network failure → friendly error | AC-7 |
| Refresh re-fetches current city, not London | AC-8 |
| Non-ASCII city URL-encoded | AC-9 |
| Refresh visible + enabled after error | FR-5 |
| Rapid double-click fires only one request | Concurrency lock |
| API key setup screen shown with no localStorage key | Setup flow |

---

## Notes

- `TEST_KEY` is injected into `localStorage` via `page.addInitScript()` before page scripts run — the widget skips the API key setup screen in all tests except the setup-screen test itself.
- `page.route()` intercepts all requests to `*.api.openweathermap.org/*` — nothing hits the real API.
- The `cityRouter` helper dispatches mock responses based on the `q` URL parameter, so multi-city tests (AC-2, AC-3, AC-8) get the right city back without re-registering routes.
