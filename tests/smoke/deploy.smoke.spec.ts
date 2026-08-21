import { test, expect } from "@playwright/test";

// ── Tier 1: Critical ────────────────────────────────────────

test.describe("Critical smoke tests", () => {
  test("homepage returns 200 and renders hero", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("blog index returns 200", async ({ page }) => {
    const res = await page.goto("/blog");
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("API auth endpoint is reachable", async ({ request }) => {
    const res = await request.get("/api/auth");
    expect(res.status()).not.toBe(500);
    expect(res.status()).not.toBe(502);
    expect(res.status()).not.toBe(503);
  });

  test("custom 404 page renders for unknown routes", async ({ page }) => {
    const res = await page.goto("/this-page-definitely-does-not-exist-98765");
    expect(res?.status()).toBe(404);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  // Regression test for "Invalid Refresh Token: Refresh Token Not Found"
  // crashing HomePage — see lib/supabase-server.ts. A stale/garbage cookie
  // shaped like a Supabase auth-token session must never turn into a 500;
  // createServerSupabaseClient() is responsible for swallowing that failure.
  test("homepage survives a stale/invalid Supabase auth cookie", async ({ request }) => {
    const res = await request.get("/", {
      headers: {
        Cookie:
          "sb-portfolio-auth-token=base64-eyJhY2Nlc3NfdG9rZW4iOiJkZWFkIiwicmVmcmVzaF90b2tlbiI6ImRlYWQiLCJleHBpcmVzX2F0IjoxfQ==",
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body.length).toBeGreaterThan(0);
  });
});

// ── Tier 2: Important ───────────────────────────────────────

test.describe("Important smoke tests", () => {
  test("login page renders form", async ({ page }) => {
    const res = await page.goto("/auth/login");
    expect(res?.status()).toBe(200);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("dashboard redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15000 });
  });

  test("security headers are present", async ({ request }) => {
    const res = await request.get("/");
    const headers = res.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
  });
});

// ── Tier 3: Nice-to-have ────────────────────────────────────

test.describe("Nice-to-have smoke tests", () => {
  test("favicon is served", async ({ request }) => {
    const res = await request.get("/icon.svg");
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
