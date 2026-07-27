# Smoke Testing Guide

## Philosophy

Smoke tests are a **minimal set of high-level checks** that verify the application is "alive" after deployment. They answer the question: *"Is the site fundamentally broken?"*

Unlike full E2E suites, smoke tests should:
- Run in **< 2 minutes**
- Touch **every critical surface** (homepage, blog, auth, dashboard, API)
- Be safe to run **in production** (read-only, no side effects)
- Run **automatically after every deploy**

---

## What to Smoke Test

### Tier 1 — Critical (must pass, site is down otherwise)

| Test | Endpoint | Check |
|---|---|---|
| Homepage loads | `GET /` | HTTP 200, contains hero text, no JS errors |
| Blog index loads | `GET /blog` | HTTP 200, renders post cards or empty state |
| API health | `GET /api/auth` | Non-500 response (401 is ok — means auth is working) |
| Static assets | `GET /_next/static/...` | HTTP 200 with long cache headers |
| 404 page | `GET /nonexistent-page-123` | HTTP 404, renders custom not-found |

### Tier 2 — Important (degraded experience if failing)

| Test | Endpoint | Check |
|---|---|---|
| Blog post | `GET /blog/{slug}` | HTTP 200, renders content |
| Login page | `GET /auth/login` | HTTP 200, form present |
| Robots.txt | `GET /robots.txt` | HTTP 200 (or 200 with proper content) |
| Favicon | `GET /favicon.ico` | HTTP 200 |
| Image proxy | `GET /_next/image?...` | HTTP 200, proper content-type |

### Tier 3 — Nice-to-have

| Test | Endpoint | Check |
|---|---|---|
| Dashboard redirect | `GET /dashboard` | HTTP 302 → `/auth/login` (unauthenticated) |
| API CORS headers | `OPTIONS /api/auth` | Proper CORS headers |
| Security headers | Any page | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` |

---

## Playwright Smoke Test Suite

### Configuration

```ts
// playwright.smoke.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/smoke",
  timeout: 30_000,
  retries: 0, // No retries for smoke — if it fails, the deploy is broken
  use: {
    baseURL: process.env.SMOKE_BASE_URL || "http://localhost:3000",
    ignoreHTTPSErrors: true, // For staging with self-signed certs
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

### Smoke Tests

```ts
// tests/smoke/deploy.smoke.spec.ts
import { test, expect } from "@playwright/test";

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:3000";

// ── Tier 1: Critical ────────────────────────────────────────

test.describe("Critical smoke tests", () => {
  test("homepage returns 200 and renders hero", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);

    // Hero section should have some visible text (not blank page)
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("blog index returns 200", async ({ page }) => {
    const res = await page.goto("/blog");
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("API auth endpoint is reachable", async ({ request }) => {
    const res = await request.get("/api/auth");
    // 401 = auth working; 200 = unexpected but not broken
    expect(res.status()).not.toBe(500);
    expect(res.status()).not.toBe(502);
    expect(res.status()).not.toBe(503);
  });

  test("_next/static assets are served with cache headers", async ({ request }) => {
    // Fetch the homepage first to find a static asset URL
    const pageRes = await request.get("/");
    const html = await pageRes.text();

    // Find a _next/static/chunks/ URL in the HTML
    const match = html.match(/\/_next\/static\/chunks\/[^"]+\.js/);
    if (!match) {
      test.skip(true, "No static chunk found in HTML");
      return;
    }

    const assetRes = await request.get(match[0]);
    expect(assetRes.status()).toBe(200);
    expect(assetRes.headers()["cache-control"]).toMatch(/immutable/);
  });

  test("custom 404 page renders for unknown routes", async ({ page }) => {
    const res = await page.goto("/this-page-definitely-does-not-exist-98765");
    expect(res?.status()).toBe(404);
    await expect(page.locator("body")).not.toBeEmpty();
  });
});

// ── Tier 2: Important ───────────────────────────────────────

test.describe("Important smoke tests", () => {
  test("login page renders form", async ({ page }) => {
    const res = await page.goto("/auth/login");
    expect(res?.status()).toBe(200);

    // Should have an email input
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("dashboard redirects unauthenticated users", async ({ page }) => {
    const res = await page.goto("/dashboard");
    // Should redirect to login
    expect(page.url()).toContain("/auth/login");
  });

  test("security headers are present", async ({ request }) => {
    const res = await request.get("/");
    const headers = res.headers();

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["strict-transport-security"]).toBeDefined();
  });
});

// ── Tier 3: Nice-to-have ────────────────────────────────────

test.describe("Nice-to-have smoke tests", () => {
  test("favicon is served", async ({ request }) => {
    const res = await request.get("/favicon.ico");
    expect([200, 304]).toContain(res.status());
  });

  test("no console errors on homepage", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toEqual([]);
  });
});
```

---

## HTTP-Level Smoke (No Browser)

For ultra-fast checks without a browser, use a simple script:

```ts
// tests/smoke/http.smoke.ts
// Run with: npx tsx tests/smoke/http.smoke.ts

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:3000";

const ENDPOINTS = [
  { path: "/", name: "Homepage", minStatus: 200, maxStatus: 299 },
  { path: "/blog", name: "Blog", minStatus: 200, maxStatus: 299 },
  { path: "/auth/login", name: "Login", minStatus: 200, maxStatus: 299 },
  { path: "/dashboard", name: "Dashboard", minStatus: 301, maxStatus: 399 },
  { path: "/api/auth", name: "Auth API", minStatus: 200, maxStatus: 401 },
  { path: "/nonexistent", name: "404 Page", minStatus: 404, maxStatus: 404 },
];

async function main() {
  let failures = 0;

  for (const { path, name, minStatus, maxStatus } of ENDPOINTS) {
    const url = `${BASE}${path}`;
    try {
      const res = await fetch(url, { redirect: "manual" });
      const ok = res.status >= minStatus && res.status <= maxStatus;
      const icon = ok ? "✅" : "❌";
      console.log(`${icon} ${name.padEnd(15)} ${res.status} ${url}`);

      if (!ok) {
        failures++;
        // Check security headers on success responses
      } else if (res.status >= 200 && res.status < 300) {
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("text/html") && !ct.includes("application/json")) {
          console.log(`   ⚠️ Unexpected Content-Type: ${ct}`);
        }
      }
    } catch (err) {
      console.log(`❌ ${name.padEnd(15)} ERROR ${(err as Error).message}`);
      failures++;
    }
  }

  console.log(`\n${failures === 0 ? "✅ All smoke tests passed" : `❌ ${failures} failures`}`);
  process.exit(failures > 0 ? 1 : 0);
}

main();
```

---

## Deployment Hook

Add to `vercel.json` or your CI pipeline:

```json
{
  "crons": [
    {
      "path": "/api/cron/smoke",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

Or run post-deploy in GitHub Actions:

```yaml
- name: Smoke Test Deploy
  run: |
    npx playwright test --config=playwright.smoke.config.ts
  env:
    SMOKE_BASE_URL: ${{ steps.vercel.outputs.preview-url }}
```

---

## Failure Response

| Severity | Response |
|---|---|
| Any Tier 1 failure | **Rollback deploy immediately** |
| 2+ Tier 2 failures | Page on-call, investigate |
| Only Tier 3 failures | Log ticket, fix in next cycle |
