# Test Error Log

> Auto-generated test run history. Each run appends a new entry.
> Latest run at the top.

---

## 2026-07-27 20:21 — Vitest + Playwright (full suite)

### Vitest (unit + integration)

**Result:** ✅ 3 files passed, 26 tests passed (0 failures)

| File | Tests | Status |
|---|---|---|
| `lib/utils.test.ts` | 13 | ✅ |
| `components/ui/button.test.tsx` | 6 | ✅ |
| `components/ui/use-toast.test.ts` | 7 | ✅ |

**Config:** `vitest.config.ts`, environment: `happy-dom`

---

### Playwright Smoke (post-deploy)

**Result:** ✅ 9 passed, 0 failed

| Tier | Test | Status |
|---|---|---|
| Critical | homepage returns 200 and renders hero | ✅ |
| Critical | blog index returns 200 | ✅ |
| Critical | API auth endpoint is reachable | ✅ |
| Critical | custom 404 page renders for unknown routes | ✅ |
| Important | login page renders form | ✅ |
| Important | dashboard redirects unauthenticated users to login | ✅ |
| Important | security headers are present | ✅ |
| Nice-to-have | favicon is served | ✅ |
| Nice-to-have | no console errors on homepage | ✅ |

**Config:** `playwright.smoke.config.ts`, baseURL: `http://localhost:3000`

---

## 2026-07-27 20:19 — Initial fix: `type: module`

### Error

```
Vitest cannot be imported in a CommonJS module using require().
Please use "import" instead.
```

**Affected files:** `lib/utils.test.ts`, `components/ui/button.test.tsx`, `components/ui/use-toast.test.ts`

### Root Cause

`package.json` was missing `"type": "module"`. Vitest 4.x is ESM-only, but Node was treating `.ts` files as CommonJS.

### Fix

Added `"type": "module"` to `package.json`.

### Result

✅ All 26 tests pass.

---

## 2026-07-27 20:24 — Playwright smoke failures (4 failures)

### Failure 1 — homepage returns 500

```
Expected: 200, Received: 500
```

**Cause:** Transient Supabase connection issue during cold start.
**Fix:** Re-ran after dev server stabilized — resolved.

---

### Failure 2 — security headers missing

```
Expected: "nosniff", Received: undefined
```

**Cause:** Middleware (`middleware.ts`) only ran on `/dashboard/**`, `/api/agent/**`, `/api/settings/**`. The `/` route had no security headers.
**Fix:** Added `headers()` async function in `next.config.ts`:

```ts
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ],
  }];
}
```

---

### Failure 3 — favicon 404

```
Expected value: 404, Received array: [200, 304]
```

**Cause:** No `favicon.ico` file existed in the project.
**Fix:** Created `app/icon.svg` and updated test to point to `/icon.svg`.

---

### Failure 4 — console error (next/image hostname)

```
Invalid src prop (https://gitlab.com/...) on `next/image`,
hostname "gitlab.com" is not configured under images in your `next.config.js`
```

**Cause:** GitLab avatar URLs were not in `images.remotePatterns`.
**Fix:** Added `gitlab.com` and `**.githubusercontent.com` to `remotePatterns`:

```ts
remotePatterns: [
  { protocol: "https", hostname: "**.supabase.co" },
  { protocol: "https", hostname: "gitlab.com" },
  { protocol: "https", hostname: "**.githubusercontent.com" },
]
```

---

## Template

```markdown
## YYYY-MM-DD HH:MM — <description>

### <Suite Name>

**Result:** ✅/❌ X passed, Y failed

| File | Tests | Status |
|---|---|---|
| | | |

### Errors (if any)

#### Error N — <title>

**Affected files:**
**Cause:**
**Fix:**

---
```


---

## 2026-07-27 20:45 — Vitest + Playwright

**Result:** ✅ 35 passed, 0 failed

| File | Status |
|---|---|
| `lib/utils.test.ts` | ✅ |
| `components/ui/button.test.tsx` | ✅ |
| `components/ui/use-toast.test.ts` | ✅ |
| `tests/smoke/deploy.smoke.spec.ts` | ✅ |
| `tests/smoke/http.smoke.ts` | ✅ |

