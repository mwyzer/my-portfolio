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
| `Content-Security-Policy` | see below | Restricts script/style/image/connect origins |

A `Content-Security-Policy` is configured in `next.config.ts` (`img-src` allows `self`, `data:`, `*.supabase.co`, `*.githubusercontent.com`, `gitlab.com`, `*.googleusercontent.com`; `script-src`/`style-src` need `'unsafe-inline'` because the App Router streams RSC payloads via inline `<script>` and this app sets layout/color via inline `style={{...}}` throughout — see the comment above the `headers()` function for the full rationale and the nonce-based approach that would remove it). `'unsafe-eval'` is added to `script-src` in dev only (Next.js Fast Refresh requires it), gated on build `phase`, not `NODE_ENV`. See the [CSP Roadmap](#csp-roadmap) below for what's left.

### 2. Authentication (Supabase SSR)

- **Session management:** Supabase SSR with `@supabase/ssr` — HTTP-only cookies, server-side validation.
- **Auth middleware** (`middleware.ts` + `lib/supabase/middleware.ts`): runs on `/dashboard/*`, `/api/agent/*`, `/api/settings/*`. For `/dashboard/*` specifically, it redirects unauthenticated requests to `/auth/login` and authenticated-but-non-owner accounts to `/forbidden` — this is real server-side enforcement, not just a session-cookie refresh. `/api/agent/*` (the visitor-facing AI chat widget) is intentionally left public; `/api/settings/*` is reserved in the matcher but no route exists there yet.
- **Magic link / OTP:** Tokens are single-use, time-limited, validated server-side in `/auth/callback`. The post-auth redirect target (`?next=`) is restricted to same-origin paths (must start with a single `/`) to prevent an open redirect via the `Location` header.
- **OAuth flow:** Code exchange for session happens server-side — no access tokens exposed to the client.
- **Sign-out:** Destroys session server-side via `/auth/signout`.
- **Single-owner enforcement:** `/dashboard/*` is gated to one email (`OWNER_EMAIL`, currently set in both `middleware.ts` and `app/dashboard/layout.tsx`) — non-owner authenticated accounts are redirected to `/forbidden`. This is UX/defense-in-depth; the actual data-layer enforcement is the RLS policies in `supabase/migrations/00004_restrict_writes_to_owner.sql`, which scope every write to that same email regardless of what the client sends.

### 3. Route Protection

| Route | Access | Mechanism |
|---|---|---|
| `/` | Public | — |
| `/blog` | Public | — |
| `/blog/[slug]` | Public | — |
| `/auth/login` | Public | — |
| `/auth/callback` | Public | PKCE code / OTP exchange, sanitized redirect target |
| `/forbidden` | Public | 403 page — reached via middleware redirect, not directly gated |
| `/dashboard/*` | Owner only | `middleware.ts`: unauthenticated → `/auth/login`, wrong account → `/forbidden` |
| `/api/agent/*` | Public (intentional) | No rate limiting yet — see Known Gaps |
| `/api/settings/*` | N/A | No route currently implemented; matcher entry is reserved for future use |

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

A baseline CSP is live (see Security Headers above). Remaining work to tighten it:

1. Move to a nonce-based `script-src`/`style-src` to drop `'unsafe-inline'` — requires generating a per-request nonce in middleware and widening its route matcher to run on every page (currently scoped to `/dashboard`, `/api/agent`, `/api/settings` to avoid the extra Supabase session-refresh latency on public pages).
2. Re-audit `img-src`/`connect-src` allowlists whenever a new external origin is added (e.g. the `*.googleusercontent.com` addition for Google Drive-hosted case-study images).

---

## Known Gaps

- **`/api/agent/chat` has no rate limiting.** It's intentionally public (visitor-facing AI chat widget) and calls paid LLM providers (Gemini/OpenAI/DeepSeek fallback chain) using this project's own API keys. There's currently no per-IP/per-session throttle or message-size cap, so a scripted client could drive up API costs. Needs a rate-limit policy decision before fixing.
- **`next dev`'s local Edge Runtime sandbox** throws `EvalError: Code generation from strings disallowed for this context` when middleware runs against `/dashboard/*` routes, because `@supabase/ssr` pulls in the Realtime client, which uses `eval`/`Function()` internally. Confirmed **not** present in production builds (`next build && next start`) — it's a `next dev`-only quirk, not a deployed bug. Avoid diagnosing "middleware doesn't work" reports using `next dev` alone; verify against a production build.

---

## Related Docs

- [Middleware](../middleware.ts) — Auth middleware source, `/dashboard` gating
- [Supabase Middleware](../lib/supabase/middleware.ts) — Session refresh & cleanup
- [Auth Callback](../app/auth/callback/route.ts) — OTP/OAuth exchange, redirect sanitization
- [Forbidden Page](../app/forbidden/page.tsx) — 403 page
- [next.config.ts](../next.config.ts) — Security headers, CSP & remote patterns
- [Testing Overview](./testing/README.md) — Security header smoke tests
- [VERSIONING.md](./VERSIONING.md) — Versioning & dependency update policy
