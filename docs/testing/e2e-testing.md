# End-to-End (E2E) Testing Guide

## Philosophy

E2E tests simulate real user journeys through the full application stack — browser, Next.js server, Supabase, and all. They are the slowest but most realistic tests.

---

## Playwright Setup

### Installation

```bash
npm install -D @playwright/test
npx playwright install --with-deps chromium
```

### Configuration

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],

  // Start Next.js dev server before tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

---

## Test Files

### Homepage

```ts
// tests/e2e/homepage.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero content", async ({ page }) => {
    await page.goto("/");

    // Page should have a title
    await expect(page).toHaveTitle(/portfolio/i);

    // Hero section should be visible within viewport
    const nav = page.locator("nav, header").first();
    await expect(nav).toBeVisible();
  });

  test("theme toggle changes theme", async ({ page }) => {
    await page.goto("/");

    // Find theme toggle button — usually in the navbar
    const toggle = page.locator("nav button").last();

    await toggle.click();

    // Light theme should add 'light' class to html element
    await expect(page.locator("html")).toHaveClass(/light/);
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");

    // Click blog link
    await page.click("a[href*='blog']");
    await expect(page).toHaveURL(/\/blog/);
  });

  test("below-fold content renders", async ({ page }) => {
    await page.goto("/");

    // Scroll down to trigger animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500); // Let animations finish

    // Projects section should eventually appear
    await expect(page.locator("text=Projects").first()).toBeVisible({ timeout: 10000 });
  });

  test("mobile menu is usable", async ({ page }) => {
    // Use mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // On mobile, navbar might have a hamburger menu
    const hamburger = page.locator('[aria-label*="menu" i], [aria-label*="open" i]');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await expect(page.locator("a[href*='blog']")).toBeVisible();
    }
  });
});
```

### Blog

```ts
// tests/e2e/blog.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Blog", () => {
  test("blog index loads post cards", async ({ page }) => {
    await page.goto("/blog");

    // If no posts exist, check for empty state
    const posts = page.locator("article, [data-testid='post-card'], a[href*='/blog/']");
    const emptyState = page.locator("text=/no posts|no articles|coming soon/i");

    await expect(posts.first().or(emptyState.first())).toBeVisible({ timeout: 10000 });
  });

  test("post slug page loads content", async ({ page }) => {
    await page.goto("/blog");

    // Find first post link
    const firstPost = page.locator("a[href*='/blog/']").first();
    if (await firstPost.isVisible()) {
      await firstPost.click();

      // Verify we're on a post page
      await expect(page).toHaveURL(/\/blog\/.+/);

      // Post should have some content
      await expect(page.locator("article, main, h1").first()).toBeVisible();
    }
  });

  test("404 page renders for invalid slug", async ({ page }) => {
    const res = await page.goto("/blog/nonexistent-post-12345");
    await expect(page.locator("body")).not.toBeEmpty();
  });
});
```

### Authentication

```ts
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("login page renders form", async ({ page }) => {
    await page.goto("/auth/login");

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/auth/login");

    await page.fill('input[type="email"]', "fake@example.com");
    await page.fill('input[type="password"]', "wrong-password");
    await page.click('button[type="submit"]');

    // Error message should appear
    await expect(page.locator("text=/invalid|error|failed|credentials/i")).toBeVisible({
      timeout: 10000,
    });
  });

  test("unauthenticated dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");

    // Should be redirected to login
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
  });

  test("magic link option is available", async ({ page }) => {
    await page.goto("/auth/login");

    // Should have a "magic link" or "passwordless" option
    const magicLinkButton = page.locator("text=/magic link|passwordless|send link/i");
    // May or may not exist depending on implementation
    if (await magicLinkButton.isVisible()) {
      await magicLinkButton.click();
      // Should show email input for magic link
      await expect(page.locator('input[type="email"]')).toBeVisible();
    }
  });
});
```

### Dashboard

```ts
// tests/e2e/dashboard.spec.ts
import { test, expect } from "@playwright/test";

// NOTE: These tests require authentication setup.
// Use storageState to save an authenticated session:
//   npx playwright test --setup

test.describe("Dashboard (authenticated)", () => {
  test.use({
    // Load authenticated session
    storageState: "tests/e2e/.auth/user.json",
  });

  test("overview shows stats", async ({ page }) => {
    await page.goto("/dashboard");

    // Overview should show stats
    await expect(page.locator("text=/projects|total/i").first()).toBeVisible({
      timeout: 15000,
    });
  });

  test("sidebar navigation works", async ({ page }) => {
    await page.goto("/dashboard");

    // Navigate to blog
    await page.click("a[href*='blog']");
    await expect(page).toHaveURL(/\/dashboard\/blog/);

    // Navigate to portfolio
    await page.click("a[href*='portfolio']");
    await expect(page).toHaveURL(/\/dashboard\/portfolio/);

    // Navigate to settings
    await page.click("a[href*='settings']");
    await expect(page).toHaveURL(/\/dashboard\/settings/);
  });

  test("sign out redirects to home", async ({ page }) => {
    await page.goto("/dashboard");

    // Click sign out
    await page.click("text=/sign out|logout/i");

    // Should redirect to home page
    await expect(page).toHaveURL("/", { timeout: 15000 });
  });
});
```

### AI Chatbot

```ts
// tests/e2e/chatbot.spec.ts
import { test, expect } from "@playwright/test";

test.describe("AI Chatbot", () => {
  test("chat widget is present on homepage", async ({ page }) => {
    await page.goto("/");

    // Chat bubble button should be visible
    const chatButton = page.locator('[aria-label*="chat" i], [aria-label*="assistant" i], button:has(svg)').last();
    await expect(chatButton).toBeVisible({ timeout: 10000 });
  });

  test("chat panel opens on click", async ({ page }) => {
    await page.goto("/");

    // Find and click the chat bubble
    const chatButton = page.locator('button:has-text("")').filter({ has: page.locator("svg") }).last();
    await chatButton.click();

    // Panel should open — look for input field or greeting
    await expect(
      page.locator("text=/hi|hello|ask me/i").or(page.locator('input[type="text"], textarea'))
    ).toBeVisible({ timeout: 5000 });
  });
});
```

---

## Visual Regression Testing

```ts
// tests/e2e/visual.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Visual regression", () => {
  test("homepage matches snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("blog index matches snapshot", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("blog-index.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
```

---

## Authentication Setup

For tests requiring a logged-in user:

```ts
// tests/e2e/auth.setup.ts
import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, ".auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/auth/login");

  await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL("/dashboard", { timeout: 15000 });

  // Save authenticated state
  await page.context().storageState({ path: authFile });
});
```

---

## Running E2E Tests

```bash
# All E2E tests
npx playwright test

# Specific file
npx playwright test tests/e2e/homepage.spec.ts

# With UI mode (watch + debug)
npx playwright test --ui

# With browser visible
npx playwright test --headed

# Generate code from interactions
npx playwright codegen http://localhost:3000

# View HTML report
npx playwright show-report
```
