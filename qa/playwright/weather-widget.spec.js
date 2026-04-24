// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const WIDGET_URL = `file://${path.resolve(__dirname, '../../engineering/weather-widget.html')}`;
const TEST_KEY   = 'test-key-12345';
const OWM        = '**/api.openweathermap.org/**';

// ── Mock payloads ─────────────────────────────────────────────────────────────

const LONDON = {
  name: 'London', sys: { country: 'GB' },
  main: { temp: 15.6, humidity: 72, feels_like: 14.2 },
  wind: { speed: 5.3 },
  weather: [{ description: 'overcast clouds', icon: '04d' }],
};

const TOKYO = {
  name: 'Tokyo', sys: { country: 'JP' },
  main: { temp: 22.4, humidity: 58, feels_like: 21.9 },
  wind: { speed: 3.1 },
  weather: [{ description: 'clear sky', icon: '01d' }],
};

const SAO_PAULO = {
  name: 'São Paulo', sys: { country: 'BR' },
  main: { temp: 28.1, humidity: 65, feels_like: 30.2 },
  wind: { speed: 2.8 },
  weather: [{ description: 'few clouds', icon: '02d' }],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

async function openWidget(page) {
  await page.addInitScript((k) => localStorage.setItem('owm_api_key', k), TEST_KEY);
  await page.goto(WIDGET_URL);
}

function cityRouter(page) {
  return page.route(OWM, (route) => {
    const q = new URL(route.request().url()).searchParams.get('q');
    const data = q === 'Tokyo' ? TOKYO : LONDON;
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  });
}

// ── AC-1: Initial load shows London ──────────────────────────────────────────

test('AC-1 — page load shows London weather', async ({ page }) => {
  await page.route(OWM, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LONDON) })
  );
  await openWidget(page);

  await expect(page.locator('#city-display')).toHaveText('London, GB');
  await expect(page.locator('#temperature')).toHaveText('16°C');      // Math.round(15.6)
  await expect(page.locator('#condition-label')).toHaveText('overcast clouds');
  await expect(page.locator('#condition-icon')).toBeVisible();
  await expect(page.locator('#weather-card')).toBeVisible();
  await expect(page.locator('#error-card')).toBeHidden();
});

// ── AC-2: Enter key triggers search ──────────────────────────────────────────

test('AC-2 — Enter key searches city and updates display', async ({ page }) => {
  await cityRouter(page);
  await openWidget(page);

  await expect(page.locator('#city-display')).toHaveText('London, GB');
  await page.locator('#city-input').fill('Tokyo');
  await page.locator('#city-input').press('Enter');
  await expect(page.locator('#city-display')).toHaveText('Tokyo, JP');
  await expect(page.locator('#temperature')).toHaveText('22°C');
});

// ── AC-3: Search button triggers fetch ───────────────────────────────────────

test('AC-3 — Search button click updates display', async ({ page }) => {
  await cityRouter(page);
  await openWidget(page);

  await expect(page.locator('#city-display')).toHaveText('London, GB');
  await page.locator('#city-input').fill('Tokyo');
  await page.locator('#search-btn').click();
  await expect(page.locator('#city-display')).toHaveText('Tokyo, JP');
});

// ── AC-4: Empty input is a no-op ──────────────────────────────────────────────

test('AC-4 — empty input fires no fetch and keeps input focused', async ({ page }) => {
  let requestCount = 0;
  await page.route(OWM, (route) => {
    requestCount++;
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LONDON) });
  });
  await openWidget(page);

  await expect(page.locator('#city-display')).toHaveText('London, GB');
  const countAfterLoad = requestCount;

  await page.locator('#city-input').fill('');
  await page.locator('#search-btn').click();
  await page.locator('#city-input').press('Enter');
  await page.waitForTimeout(300);

  expect(requestCount).toBe(countAfterLoad);
  await expect(page.locator('#city-input')).toBeFocused();
  await expect(page.locator('#city-display')).toHaveText('London, GB');
});

// ── AC-5: 404 → friendly error ────────────────────────────────────────────────

test('AC-5 — invalid city name shows friendly error', async ({ page }) => {
  await page.route(OWM, (route) => {
    const q = new URL(route.request().url()).searchParams.get('q');
    if (q === 'zzznotacity') {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'city not found' }),
      });
    } else {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LONDON) });
    }
  });
  await openWidget(page);

  await expect(page.locator('#city-display')).toHaveText('London, GB');
  await page.locator('#city-input').fill('zzznotacity');
  await page.locator('#search-btn').click();

  await expect(page.locator('#error-card')).toBeVisible();
  await expect(page.locator('#error-msg')).toHaveText('city not found');
  await expect(page.locator('#weather-card')).toBeHidden();
});

// ── AC-6: 401 → friendly error (same response.ok path as 404) ─────────────────

test('AC-6 — invalid API key shows friendly error via response.ok path', async ({ page }) => {
  await page.route(OWM, (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.',
      }),
    })
  );
  await openWidget(page);

  await expect(page.locator('#error-card')).toBeVisible();
  await expect(page.locator('#error-msg')).toContainText('Invalid API key');
  await expect(page.locator('#weather-card')).toBeHidden();
});

// ── AC-7: Network failure → friendly error ────────────────────────────────────

test('AC-7 — network failure shows connection error message', async ({ page }) => {
  await page.route(OWM, (route) => route.abort('failed'));
  await openWidget(page);

  await expect(page.locator('#error-card')).toBeVisible();
  await expect(page.locator('#error-msg')).toHaveText('Network error — check your connection.');
});

// ── AC-8: Refresh re-fetches current city, not London ─────────────────────────

test('AC-8 — Refresh button re-fetches current city, not London default', async ({ page }) => {
  /** @type {string[]} */
  const requested = [];
  await page.route(OWM, (route) => {
    const q = new URL(route.request().url()).searchParams.get('q') || '';
    requested.push(q);
    const data = q === 'Tokyo' ? TOKYO : LONDON;
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  });
  await openWidget(page);

  await expect(page.locator('#city-display')).toHaveText('London, GB');
  await page.locator('#city-input').fill('Tokyo');
  await page.locator('#search-btn').click();
  await expect(page.locator('#city-display')).toHaveText('Tokyo, JP');

  await page.locator('#refresh-btn').click();
  await expect(page.locator('#city-display')).toHaveText('Tokyo, JP');

  expect(requested[requested.length - 1]).toBe('Tokyo');
  expect(requested.filter((r) => r === 'London').length).toBe(1); // only the initial auto-load
});

// ── AC-9: Non-ASCII city is URL-encoded ───────────────────────────────────────

test('AC-9 — non-ASCII city input is URL-encoded before fetch', async ({ page }) => {
  /** @type {string} */
  let capturedUrl = '';
  await page.route(OWM, (route) => {
    capturedUrl = route.request().url();
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SAO_PAULO) });
  });
  await openWidget(page);

  await expect(page.locator('#weather-card')).toBeVisible();

  capturedUrl = '';
  await page.locator('#city-input').fill('São Paulo');
  await page.locator('#search-btn').click();
  await expect(page.locator('#city-display')).toHaveText('São Paulo, BR');

  // encodeURIComponent('São Paulo') === 'S%C3%A3o%20Paulo'
  expect(capturedUrl).toContain('S%C3%A3o%20Paulo');
});

// ── FR-5: Refresh stays visible and active after error ───────────────────────

test('FR-5 — refresh button stays visible and enabled after error follows success', async ({ page }) => {
  let fail = false;
  await page.route(OWM, (route) => {
    if (fail) {
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'city not found' }) });
    } else {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LONDON) });
    }
  });
  await openWidget(page);

  await expect(page.locator('#refresh-btn')).toBeVisible();

  fail = true;
  await page.locator('#city-input').fill('zzznotacity');
  await page.locator('#search-btn').click();
  await expect(page.locator('#error-card')).toBeVisible();

  await expect(page.locator('#refresh-btn')).toBeVisible();
  await expect(page.locator('#refresh-btn')).not.toBeDisabled();
});

// ── Concurrency: isFetching lock prevents duplicate requests ──────────────────

test('Concurrency — rapid double-click fires only one fetch', async ({ page }) => {
  let count = 0;
  await page.route(OWM, async (route) => {
    count++;
    await new Promise((r) => setTimeout(r, 150));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LONDON) });
  });
  await openWidget(page);

  await expect(page.locator('#city-display')).toHaveText('London, GB');
  const base = count;

  await page.locator('#city-input').fill('London');
  await page.locator('#search-btn').click();
  await page.locator('#search-btn').click(); // second click while isFetching = true
  await expect(page.locator('#city-display')).toHaveText('London, GB');

  expect(count - base).toBe(1);
});

// ── API key setup screen shown when no key stored ─────────────────────────────

test('API key setup screen shown when localStorage has no key', async ({ page }) => {
  await page.route(OWM, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(LONDON) })
  );
  // Intentionally do NOT set localStorage — skip openWidget helper
  await page.goto(WIDGET_URL);

  await expect(page.locator('#api-key-setup')).toBeVisible();
  await expect(page.locator('#weather-card')).toBeHidden();
});
