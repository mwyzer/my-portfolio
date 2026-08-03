# My Portfolio — wyzer.my.id

Personal portfolio website for **Muhammad Wyzer**, built with modern web technologies and deployed on Vercel.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| **UI Library** | [React 19](https://react.dev/) |
| **CSS Framework** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Component Library** | [DaisyUI v5](https://daisyui.com/) — semantic components & theme system |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation |
| **Primitives** | [Radix UI](https://www.radix-ui.com/) (dialog, dropdown, tabs, toast, select, label, slot) |
| **Auth / DB** | [Supabase](https://supabase.com/) (Postgres + Auth + SSR helpers) |
| **AI Chat** | [Vercel AI SDK](https://sdk.vercel.ai/) + [DeepSeek](https://www.deepseek.com/) (`deepseek-v4-flash`) — streaming chat assistant |
| **Hosting** | [Vercel](https://vercel.com/) (custom domain `wyzer.my.id`) |
| **Package Manager** | npm |

## UI & Design

- **DaisyUI** components: `navbar`, `hero`, `card`, `badge`, `btn`, `timeline`, `footer`, `input`, `alert`, `loading`
- **Custom DaisyUI theme** — `"portfolio"` with oklch color tokens
- **Dark/light mode toggle** via `data-theme` attribute with `localStorage` persistence
- **Fully responsive** — mobile-first layout with DaisyUI breakpoints
- **No flash of unstyled content** — inline theme script before hydration
- **AI chat widget** (`components/chat/chat-widget.tsx`) — "Wyzer's AI Secretary" answers visitor questions about background, skills, projects, and blog posts, grounded in `files/data.json` + live Supabase blog data (`/api/agent/chat`), streamed via DeepSeek

## Pages

| Route | Description |
|---|---|
| `/` | Public homepage — hero, about, projects, contact |
| `/blog` | Blog listing with cards & tags |
| `/blog/[slug]` | Individual blog post |
| `/auth/login` | Login page (Supabase Auth) |
| `/dashboard` | Protected dashboard (redirects to login if unauthenticated) |
| `/dashboard/blog` | Blog management |
| `/dashboard/portfolio` | Portfolio management |
| `/dashboard/settings` | Account settings |

## Getting Started

```bash
# Clone
git clone https://github.com/mwyzer/my-portfolio.git
cd my-portfolio

# Install
npm install

# Set up environment
touch .env.local
# Fill in the variables listed below

# Dev server
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm start
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-side only) |
| `DEEPSEEK_API_KEY` | ✅ | DeepSeek API key for the AI chat widget (`/api/agent/chat`) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public site URL, used for auth redirects |

## Documentation

| Document | Description |
|---|---|
| [PRD.md](./docs/PRD.md) | Full product requirements document — goals, personas, functional spec, database schema, API routes, backlog |
| [PORTFOLIO-VISUAL-REDESIGN.md](./docs/PORTFOLIO-VISUAL-REDESIGN.md) | Visual redesign specification with color tokens, typography, and component design |

## Testing

Test strategy, framework configs, and example suites for every layer of the testing pyramid.

```
        ┌─────────┐
        │   E2E   │  ← Playwright (critical user flows)
        ├─────────┤
        │Integration│ ← API routes, Supabase, auth flows
        ├─────────┤
        │  Unit   │  ← Components, utilities, hooks
        └─────────┘
```

| Document | Scope |
|---|---|
| [Testing Overview](./docs/testing/README.md) | Strategy, tooling table, file conventions, CI pipeline |
| [Unit Testing](./docs/testing/unit-testing.md) | Components, hooks, utilities — Vitest + React Testing Library + MSW |
| [Integration Testing](./docs/testing/integration-testing.md) | API routes, Supabase queries, auth middleware |
| [Smoke Testing](./docs/testing/smoke-testing.md) | Post-deploy health checks — 3-tier criticality, Playwright + HTTP scripts |
| [E2E Testing](./docs/testing/e2e-testing.md) | Full browser flows — Playwright, visual regression, auth state |
| [Test Error Log](./docs/testing/test-log.md) | Auto-updated run history with error details & fixes |

### Tooling

| Tool | Purpose |
|---|---|
| **Vitest** | Test runner (fast, Vite-native, Jest-compatible API) |
| **React Testing Library** | Component testing with user-centric queries |
| **MSW (Mock Service Worker)** | Mock Supabase & API responses at the network level |
| **Playwright** | Cross-browser E2E and smoke testing |
| **@testing-library/user-event** | Realistic user interaction simulation |
| **happy-dom** | Lightweight DOM environment (faster than jsdom) |

### Quick Start

```bash
# Install test dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event happy-dom msw playwright @playwright/test

# Run unit + integration tests
npx vitest run

# Run in watch mode
npx vitest

# Smoke tests (post-deploy)
SMOKE_BASE_URL=https://wyzer.my.id npx playwright test --config=playwright.smoke.config.ts

# E2E tests
npx playwright test
```

### Latest Smoke Test Report (2026-07-27)

**Result:** ✅ **All 9 tests passing** — 0 failures across all 3 tiers

| Tier | Test | Status |
|---|---|---|
| Critical | Homepage returns 200 and renders hero | ✅ |
| Critical | Blog index returns 200 | ✅ |
| Critical | API auth endpoint is reachable | ✅ |
| Critical | Custom 404 page renders for unknown routes | ✅ |
| Important | Login page renders form | ✅ |
| Important | Dashboard redirects unauthenticated users to login | ✅ |
| Important | Security headers are present | ✅ |
| Nice-to-have | Favicon is served | ✅ |
| Nice-to-have | No console errors on homepage | ✅ |

**Config:** `playwright.smoke.config.ts` · **Browser:** Chromium  
**Full history:** [Test Error Log](./docs/testing/test-log.md)

---

## Changelog & Versioning

| Document | Description |
|---|---|
| [CHANGELOG.md](./docs/CHANGELOG.md) | Structured release notes (Keep a Changelog format) — v1.3.0 through v0.x |
| [VERSIONING.md](./docs/VERSIONING.md) | Semantic versioning rules, branch strategy, release checklist, commit conventions |
| [GIT-LOG.md](./docs/GIT-LOG.md) | Chronological commit history with quick-reference commands |
| [SECURITY.md](./docs/SECURITY.md) | Security policy, headers, auth, CSP roadmap, vulnerability reporting |

**Current version: v1.3.0** — Performance Optimization (2026-07-27)

## Deployment

Pushes to `main` auto-deploy to Vercel at **[www.wyzer.my.id](https://www.wyzer.my.id)**.

## License

Private — Muhammad Wyzer © 2026
