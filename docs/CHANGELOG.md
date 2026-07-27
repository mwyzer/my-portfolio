# Changelog

All notable changes to **My Portfolio** are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] — 2026-07-27

### Added

- **Performance optimization sweep** — 6 Lighthouse audits addressed:
  - Middleware narrowed to `/dashboard/*`, `/api/agent/*`, `/api/settings/*` (saves 50–150ms on public pages)
  - `vercel.json` cache tiers: 1-year immutable for `_next/static`, 1-week for `_next/image`, 1-hour for public pages
  - Render-blocking JS deferred: SplashCursor, ChatWidget, Vercel Analytics, and HeroCTA moved to `next/dynamic`
  - Fixed forced reflows: CSS `var()` resolution cached in `useMemo`, DOM writes deferred to `requestAnimationFrame`, `getBoundingClientRect` cached in ref
  - Streaming Suspense with `Promise.all` for parallel Supabase queries on homepage
  - Duplicate Supabase avatar removed from critical request chain
- Hardcoded Supabase preconnect + dns-prefetch in `<head>` (previous conditional `new URL()` approach was silently failing)
- `optimizePackageImports: ["lucide-react"]` — tree-shakes barrel imports, cuts ~62 KiB unused JS
- `tsconfig` target bumped from **ES2017 → ES2022** — SWC stops transpiling baseline features, saves ~12 KiB
- `browserslist` added to `package.json` for modern-browser targeting
- Next.js image config: AVIF/WebP formats, proper `deviceSizes` and `imageSizes`
- GSAP + ScrollTrigger lazy-loaded via dynamic `import()` in `animate-on-scroll.tsx`
- Deferred component wrappers in `components/deferred/` (required for Next.js 15.5 SSR rules)
- `skipTrailingSlashRedirect: true` and `skipMiddlewareUrlNormalize: true` in `next.config.ts`
- HSTS header in `vercel.json`: `max-age=63072000; includeSubDomains; preload`
- Testing documentation: unit, integration, smoke, and E2E testing guides in `docs/testing/`
- `docs/PRD.md` and `docs/CHANGELOG.md`

### Changed

- Public page cache TTL: `max-age=60` → `max-age=3600` with `stale-while-revalidate=86400`
- `splash-cursor.tsx`: missing return statement fixed (pre-existing bug)
- `animate-on-scroll.tsx`: GSAP import moved from static to dynamic

### Fixed

- Preconnect `<link>` tags now render unconditionally (was silently blank due to `new URL()` runtime failure)
- `ssr: false` dynamic imports moved from server layout into `"use client"` wrapper components
- `splash-cursor.tsx` syntax error (missing closing JSX and brace)

---

## [1.2.0] — 2026-07-15

### Added

- AI Secretary Agent (`/api/agent/chat`) — RAG-powered chatbot using DeepSeek / OpenAI, Supabase pgvector, and Vercel AI SDK
- Chat widget (`components/chat/chat-widget.tsx`) — floating bubble + slide-out panel, streaming responses
- Magic link (passwordless) sign-in on `/auth/login`

### Changed

- Refactored dashboard pages for consistent Radix UI patterns
- CSS animation borders updated

### Fixed

- Magic link email + password flow edge cases
- Auth callback route handling

---

## [1.1.0] — 2026-06-28

### Added

- Portfolio Visual Redesign specification (`docs/PORTFOLIO-VISUAL-REDESIGN.md`)
- Supabase database schema: `portfolio_projects`, `portfolio_about`, `blog_posts`, `site_settings`
- RLS enabled on all tables (public read, authenticated CRUD)
- Supabase SSR helpers (`@supabase/ssr`) with middleware for session refresh
- Auth flow: `/auth/login`, `/auth/callback`, `/auth/signout`
- Dashboard: blog management, portfolio management, settings editor
- DaisyUI portfolio theme with `oklch` color tokens
- Markdown blog with slug-based routing

### Changed

- Refactored from static HTML to Next.js 15 App Router
- Moved from plain CSS to Tailwind CSS v4 + DaisyUI v5

### Fixed

- ESLint config — removed missing `next/core-web-vitals`
- Supabase client initialization for Vercel production builds

---

## [1.0.0] — 2026-05-10

### Added

- Initial Next.js 15 + TypeScript project scaffold
- Tailwind CSS v4 configuration
- Radix UI primitives (dialog, dropdown-menu, label, select, slot, tabs, toast)
- React Hook Form + Zod validation layer
- Vercel deployment with `vercel.json` (security headers, redirects)
- Dark/light theme toggle with `localStorage` persistence
- Tech Stack section on homepage
- Portfolio project cards (LMS Mahasiswa + others)
- `README.md` with tech stack and UI details

---

## [0.x] — Pre-Next.js Era (2023–2025)

### 2025
- DaisyUI integration with custom theme
- Supabase backend + PostgreSQL migrations
- Dashboard layout with sidebar navigation

### 2023–2024
- React TV Show app added
- Vue.js Pinia state management demo
- Vue.js DataTables CRUD demo
- WordPress blog integration
- Static HTML portfolio with custom CSS
- Calculator, portfolio preview, and various experiments

---

## Legend

| Icon | Meaning |
|---|---|
| Added | New features |
| Changed | Changes in existing functionality |
| Deprecated | Soon-to-be removed features |
| Removed | Removed features |
| Fixed | Bug fixes |
| Security | Vulnerability fixes |
