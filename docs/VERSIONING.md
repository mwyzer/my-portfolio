# Versioning & Release Workflow

## Overview

This project follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`) and uses the [Keep a Changelog](https://keepachangelog.com/) format.

---

## Version Scheme

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └── Bug fixes, typos, minor corrections
  │     └──────── New features, non-breaking additions
  └────────────── Breaking changes, major redesigns
```

### Examples

| Change | Version bump |
|---|---|
| Fix a typo in a blog post | `1.3.0` → `1.3.1` |
| Add RSS feed feature | `1.3.0` → `1.4.0` |
| Migrate from Pages Router to App Router | `1.x.x` → `2.0.0` |
| Redesign entire UI | `1.x.x` → `2.0.0` |

---

## Branch Strategy

```
main
  ├── Production branch. Deploys to wyzer.my.id via Vercel.
  │   Only merge from develop or hotfix branches.
  │
  └── develop (optional, for larger features)
       ├── feature/ai-chatbot
       ├── feature/performance-optimization
       └── hotfix/preconnect-fix
```

### Current (Simplified)

Since this is a solo project, work happens directly on `main` with small, atomic commits.

---

## Release Checklist

### Before Release

- [ ] All unit tests pass: `npx vitest run`
- [ ] Build succeeds: `npx next build`
- [ ] Lint passes: `npm run lint`
- [ ] Manual smoke test on local: `npx playwright test --config=playwright.smoke.config.ts`
- [ ] Changes documented in `CHANGELOG.md` under `[Unreleased]`

### Release Steps

1. **Bump version**
   ```bash
   # Determine new version (e.g., 1.3.0 → 1.3.1)
   NEW_VERSION=1.3.1
   ```

2. **Update CHANGELOG.md**
   - Move `[Unreleased]` changes to `[NEW_VERSION] — YYYY-MM-DD`
   - Commit: `git commit -m "chore: release v$NEW_VERSION"`

3. **Tag the release**
   ```bash
   git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
   git push origin main --tags
   ```

4. **Deploy**
   - Vercel auto-deploys on push to `main`
   - Monitor deployment at [vercel.com](https://vercel.com/)

5. **Smoke test production**
   ```bash
   SMOKE_BASE_URL=https://wyzer.my.id npx playwright test --config=playwright.smoke.config.ts
   ```

---

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/) where feasible:

| Prefix | Use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, CSS, whitespace |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `perf:` | Performance improvement |
| `test:` | Adding or updating tests |
| `chore:` | Build, CI, dependencies, tooling |
| `revert:` | Reverting a previous commit |

### Examples

```
feat: add AI chatbot with RAG pipeline
fix: preconnect tags not rendering on production
perf: lazy-load GSAP and defer heavy JS
docs: add testing strategy documentation
chore: bump dependencies
```

---

## Current Version

**v1.3.0** — Performance Optimization (2026-07-27)

See [CHANGELOG.md](./CHANGELOG.md) for full history.
