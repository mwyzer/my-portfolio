# Git Workflow & Commit Log

This is the chronological commit log for the repository. For structured release notes organized by version, see [CHANGELOG.md](./CHANGELOG.md). For versioning rules, see [VERSIONING.md](./VERSIONING.md).

---

## Quick Reference

| Command | Description |
|---|---|
| `git log --oneline` | Compact commit history |
| `git log --oneline --graph --decorate` | Visual branch graph |
| `git diff v1.2.0..v1.3.0` | Changes between two releases |
| `git tag -l` | List all tags |
| `git show v1.3.0` | View a specific tag |

---

## Current Branch: `main`

Last updated: **2026-07-27**

### Recent Commits (most recent first)

| Commit | Date | Message |
|---|---|---|
| `668818a` | 2026-07-20 | fix: magic link auth edge case |
| `392468e` | 2026-07-18 | style: update electric border animations |
| `1d45abe` | 2026-07-18 | style: update border transitions |
| `f317ca2` | 2026-07-17 | style: update border rendering |
| `95a9539` | 2026-07-16 | docs: add portfolio visual redesign specification |
| `e7a97ff` | 2026-07-12 | fix: resolve build error |
| `10e39e0` | 2026-07-10 | feat: update AI agent feature |
| `cc215b7` | 2026-07-09 | chore: update environment config |
| `0e23e85` | 2026-07-08 | fix: magic link email and password flow |
| `212cb2f` | 2026-07-06 | feat: update authentication pages |
| `9a82cc9` | 2026-07-05 | style: page layout adjustments |
| `5aa6d4e` | 2026-07-03 | feat: import Vercel analytics |
| `1dd4c5a` | 2026-07-02 | style: page design updates |
| `5488a54` | 2026-06-30 | fix: ESLint config — remove missing dependency |
| `acd684f` | 2026-06-28 | feat: update tech stack with portal-helpdesk |
| `feea73d` | 2026-06-27 | refactor: merge unified tech stack section |
| `ce407b5` | 2026-06-25 | feat: add LMS Mahasiswa project card |
| `5ac9ac0` | 2026-06-22 | docs: add README with tech stack details |
| `e987810` | 2026-06-20 | fix: Supabase client for Vercel build |
| `843ee65` | 2026-06-18 | feat: Vercel config with security headers |
| `930247f` | 2026-06-15 | feat: DaisyUI theme, Supabase, dashboard |

### Older History (2023–2025)

| Commit | Date | Message |
|---|---|---|
| `d536007` | 2025-04 | chore: add package.json for deployment |
| `a2fd14b` | 2025-03 | style: refactor footer section |
| `22a20e1` | 2025-02 | style: dynamic copyright in footer |
| `4a1db81` | 2024-12 | style: update dashboard text |
| `5ef253a` | 2024-10 | feat: add React TV Show app |
| `7364f59` | 2024-08 | feat: add React TV Show |
| `9759f58` | 2024-06 | feat: add WordPress blog integration |
| `4150bdc` | 2024-04 | feat: add Vue Pinia demo |
| `a7ddf97` | 2024-02 | feat: add Vue.js DataTables |
| `0f4891b` | 2023-02 | initial static HTML site |
| `e4c04fc` | 2023-01 | add portfolio page |
| `a34214d` | 2023-01 | add page preview |
| `a1cea5d` | 2023-01 | add calculator app |
| `1b303a9` | 2023-01 | initial commit |

---

## How to Update This File

After committing changes, update this file:

```bash
# Append recent commits to the table above
git log --oneline -10
```

Or re-generate from scratch:

```bash
git log --oneline --all > /tmp/git-log.txt
```

---

## See Also

- [CHANGELOG.md](./CHANGELOG.md) — structured release notes by version
- [VERSIONING.md](./VERSIONING.md) — semantic version rules and release workflow
- [Testing docs](./testing/) — smoke tests for post-deploy validation
