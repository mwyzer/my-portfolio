# Testing Strategy — My Portfolio

## Overview

This directory contains the testing documentation and standards for the **My Portfolio** Next.js application. The testing pyramid is followed: a large base of fast unit tests, a moderate layer of integration tests, and a small set of end-to-end smoke tests.

```
        ┌─────────┐
        │   E2E   │  ← Playwright (critical user flows)
        ├─────────┤
        │Integration│ ← API routes, Supabase, auth flows
        ├─────────┤
        │  Unit   │  ← Components, utilities, hooks
        └─────────┘
```

---

## Docs

| Document | Scope |
|---|---|
| [Unit Testing](./unit-testing.md) | Components, hooks, utilities, pure functions |
| [Integration Testing](./integration-testing.md) | API routes, Supabase queries, auth middleware |
| [Smoke Testing](./smoke-testing.md) | Post-deploy health checks, critical path verification |
| [E2E Testing](./e2e-testing.md) | Full browser flows with Playwright |
| [Test Error Log](./test-log.md) | Auto-updated run history with error details & fixes |

---

## Tooling

| Tool | Purpose |
|---|---|
| **Vitest** | Test runner (fast, Vite-native, Jest-compatible API) |
| **React Testing Library** | Component testing with user-centric queries |
| **MSW (Mock Service Worker)** | Mock Supabase & API responses at the network level |
| **Playwright** | Cross-browser E2E and smoke testing |
| **@testing-library/user-event** | Realistic user interaction simulation |
| **happy-dom** | Lightweight DOM environment (faster than jsdom) |

---

## Quick Start

```bash
# Install test dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event happy-dom msw playwright @playwright/test

# Run unit + integration tests
npx vitest run

# Run in watch mode
npx vitest

# Run E2E tests
npx playwright test

# Run smoke tests (post-deploy)
npx playwright test --config=playwright.smoke.config.ts
```

---

## CI Pipeline (Recommended)

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx vitest run --coverage

  e2e:
    runs-on: ubuntu-latest
    needs: unit
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

---

## File Naming Conventions

| Pattern | Example |
|---|---|
| `*.test.ts` | `utils.test.ts`, `formatDate.test.ts` |
| `*.test.tsx` | `button.test.tsx`, `hero-cta.test.tsx` |
| `__tests__/` | `__tests__/auth-flow.test.tsx` |
| `*.spec.ts` | `homepage.spec.ts` (Playwright E2E) |
| `*.smoke.spec.ts` | `deploy.smoke.spec.ts` (post-deploy smoke) |

---

## Coverage Targets

| Layer | Target |
|---|---|
| Utility functions | ≥ 90% |
| UI components | ≥ 70% |
| Hooks | ≥ 80% |
| API routes | ≥ 75% |
| E2E critical paths | 100% of defined flows |

---

## See Also

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW](https://mswjs.io/)
- [Playwright](https://playwright.dev/)
