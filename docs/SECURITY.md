# Security Policy

## Supported Versions

Only the latest deployment on Vercel is actively supported with security updates.

| Environment | Supported |
|---|---|
| Production (`wyzer.my.id`) | ✅ |
| Preview / PR deployments | ✅ |
| Local development | ⚠️ (best-effort) |

---

## Current Security Measures

### 1. Security Headers

All routes receive these headers (configured in `next.config.ts`):

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Blocks clickjacking / framing |
| `X-XSS-Protection` | `1; mode=block` | Enables browser XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer leakage |

> **TODO:** Add a Content-Security-Policy header. This requires auditing all inline scripts / styles and third-party resources. See [#CSP] below.

### 2. Authentication (Supabase SSR)

- **Session management:** Supabase SSR with `@supabase/ssr` — HTTP-only cookies, server-side validation.
- **Auth middleware** (`lib/supabase/middleware.ts`): Runs on all protected routes (`/dashboard/*`, `/api/agent/*`, `/api/settings/*`). Refreshes tokens transparently and clears stale auth cookies on failure.
- **Magic link / OTP:** Tokens are single-use, time-limited, validated server-side in `/auth/callback`.
- **OAuth flow:** Code exchange for session happens server-side — no access tokens exposed to the client.
- **Sign-out:** Destroys session server-side via `/auth/signout`.

### 3. Route Protection

| Route | Access | Mechanism |
|---|---|---|
| `/` | Public | — |
| `/blog` | Public | — |
| `/blog/[slug]` | Public | — |
| `/auth/login` | Public | — |
| `/auth/callback` | Public | PKCE code / OTP exchange |
| `/dashboard/*` | Authenticated only | Supabase SSR middleware |
| `/api/agent/*` | Authenticated only | Supabase SSR middleware |
| `/api/settings/*` | Authenticated only | Supabase SSR middleware |

### 4. Environment Variables & Secrets

| Variable | Classification | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Safe to expose (instance URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Row-Level Security (RLS) enforces data access |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Never commit or expose client-side |

- `.env.local` is in `.gitignore`.
- Service role key is only used in server-only contexts (`lib/supabase-server.ts`, scripts).
- Vercel environment variables are managed through the Vercel dashboard (not in the repo).

### 5. Database Security (Supabase)

- **Row-Level Security (RLS)** is enabled on all tables.
- Anonymous (anon) key queries are governed by RLS policies — minimum privilege principle.
- Service role key bypasses RLS and is only used for admin operations (seeding, migrations).

### 6. Dependency Management

- npm `package-lock.json` ensures deterministic installs.
- `npm audit` is run periodically to check for vulnerabilities.
- Outdated dependencies are updated on a best-effort cadence (see [CHANGELOG](./CHANGELOG.md) and [VERSIONING](./VERSIONING.md)).

---

## Reporting a Vulnerability

If you discover a security issue, **do not open a public issue**. Contact the maintainer directly:

- **Email:** wyzer@duck.com
- **GitLab:** [@mwyzer](https://gitlab.com/mwyzer)
- **Response window:** Within 48 hours (usually faster).

We will acknowledge receipt, investigate, and deploy a fix. Public disclosure happens after the fix is live.

---

## Security Checklist (CI / Pre-Deploy)

- [ ] Lint passes (`npm run lint`)
- [ ] Unit + integration tests pass (`npm run test`)
- [ ] Smoke tests pass (`npm run test:smoke`)
- [ ] No hardcoded secrets in source
- [ ] `.env*.local` is in `.gitignore`
- [ ] RLS policies applied to any new Supabase tables
- [ ] Security headers present for new routes
- [ ] Auth middleware covers new protected routes

---

## CSP Roadmap

A Content-Security-Policy is **not yet configured**. Before adding one:

1. Audit all inline `<script>` and `<style>` tags.
2. List all external origins (images, fonts, scripts, APIs).
3. Choose a strict policy (e.g. `strict-dynamic`-based).
4. Deploy with `Content-Security-Policy-Report-Only` first, then enforce.

---

## Related Docs

- [Middleware](../middleware.ts) — Auth middleware source
- [Supabase Middleware](../lib/supabase/middleware.ts) — Session refresh & cleanup
- [next.config.ts](../next.config.ts) — Security headers & remote patterns
- [Testing Overview](./testing/README.md) — Security header smoke tests
- [VERSIONING.md](./VERSIONING.md) — Versioning & dependency update policy
