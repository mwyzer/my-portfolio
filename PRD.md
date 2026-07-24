# Product Requirements Document — My Portfolio

## 1. Executive Summary

**My Portfolio** is a personal portfolio & blog platform built with **Next.js 15**, **React 19**, **TypeScript**, and **Supabase**. It serves as a single-page showcase for a developer's work, skills, and writing — with a secure dashboard for content management. The site is deployed on **Vercel** and uses **Supabase** (PostgreSQL) for data persistence and authentication.

---

## 2. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Showcase portfolio projects | Visitors can browse projects with live & repo links |
| Publish technical blog posts | Posts render with slug-based routing, readable on all devices |
| Self-service content management | Authenticated user can CRUD projects, posts, and profile via dashboard |
| Fast, SEO-friendly public pages | Lighthouse score ≥ 90; ISR/SSG where possible |
| Dark/light theme support | Theme toggle works, respects OS preference, persists in localStorage |

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Component primitives | Radix UI (dialog, dropdown-menu, label, select, slot, tabs, toast) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth (password + magic link) |
| Hosting | Vercel |
| Analytics | Vercel Analytics |
| AI / LLM | OpenAI GPT-4o-mini (or Anthropic Claude Haiku), Vercel AI SDK |
| Vector DB | Supabase pgvector (for RAG embeddings) |

---

## 4. User Personas

### 4.1 Public Visitor
- Lands on the home page
- Browses projects, reads blog posts
- Views resume, social links, education, certifications, experience, tech stack
- No authentication required

### 4.2 Site Owner (Admin)
- Authenticates via `/auth/login` (password or magic link)
- Manages portfolio projects (CRUD)
- Manages blog posts (CRUD, publish/unpublish)
- Edits profile, social links, education, certifications, experience, tech stack
- Views dashboard overview with counts

---

## 5. Functional Requirements

### 5.1 Public Pages

#### 5.1.1 Home Page (`/`)
- **Hero section** with avatar, name, title, bio, resume link, social icon links (GitHub, GitLab, LinkedIn, email, phone)
- **Tech Stack section** — categorized list (Frontend, Backend) with icons per category
- **Education**, **Certifications**, **Experience** sections — rendered from `social_links` JSONB field
- **Projects grid** — up to 6 featured projects ordered by `featured` desc, `order` asc; each card shows title, description, technologies, live URL, GitHub URL
- **Recent Blog Posts** — up to 3 published posts ordered by `created_at` desc
- **Navigation bar** — sticky top, logo/avatar + name, Projects link, Blog link, Resume link, Theme Toggle
- All data fetched server-side from Supabase

#### 5.1.2 Blog Index (`/blog`)
- Lists all published posts
- Each card: title, excerpt, tags, date
- Links to individual post

#### 5.1.3 Blog Post (`/blog/[slug]`)
- Full-post view: title, cover image, content, tags, publish date
- Back navigation to blog index

#### 5.1.4 404 Page (`/not-found`)
- Custom not-found page

#### 5.1.5 Secretary Agent — AI Chatbot
- **Purpose**: An always-available AI assistant that answers visitor questions about the site owner's CV, skills, work experience, education, certifications, projects, and blog content.
- **Placement**: Floating chat bubble / slide-out panel accessible from any public page.
- **Behavior**:
  - Greets visitors and invites questions (e.g., *"Hi! I'm Wyzer's AI assistant. Ask me anything about his background, skills, or projects!"*)
  - Answers using a **RAG (Retrieval-Augmented Generation)** approach — the LLM is grounded in the owner's actual profile data, projects, and blog posts.
  - Maintains conversation context within a session (short-term memory).
  - Politely declines off-topic questions (e.g., *"I'm here to help you learn about Wyzer's work — try asking about his experience or projects!"*).
- **Knowledge Sources** (fed as system prompt / vector embeddings):
  - `portfolio_about` — name, title, bio, skills, social_links (education, certifications, experience, tech stack)
  - `portfolio_projects` — all published projects with descriptions, technologies, URLs
  - `blog_posts` — published post titles, excerpts, and tags (full content optionally)
  - Resume PDF (if `resume_url` is set, extract and index its text)
- **Technical Approach**:
  - **API Route**: `/api/agent/chat` — Next.js Route Handler that accepts `{ messages }` and streams back the assistant's reply.
  - **LLM Provider**: OpenAI (GPT-4o-mini) or Anthropic (Claude Haiku) for cost-effective, fast responses.
  - **RAG Pipeline** (build step or on-demand):
    1. Fetch all public data from Supabase at build time or via a cron/scheduled function.
    2. Chunk and embed the text using an embedding model (e.g., `text-embedding-3-small`).
    3. Store embeddings in Supabase with `pgvector`.
    4. At query time, embed the user's question, run a similarity search, and inject the top-K chunks into the LLM system prompt.
  - **Streaming**: Use AI SDK (`@vercel/ai-sdk`) or direct fetch with SSE to stream tokens to the chat UI.
  - **Rate Limiting**: Prevent abuse with a simple in-memory or Redis-based rate limiter (e.g., 20 requests/min per IP).
- **UI Components**:
  - Floating action button (bottom-right corner) — a chat bubble icon.
  - Expandable chat panel with message list, typing indicator, and input field.
  - Dark/light theme aware.
  - Accessible — keyboard-navigable, screen-reader friendly.
- **Data Freshness**: Re-index knowledge base whenever profile, projects, or blog posts are updated (trigger via Supabase webhooks or dashboard save hooks).

### 5.2 Authentication

#### 5.2.1 Login (`/auth/login`)
- Email + password sign-in
- Magic link (passwordless) sign-in
- Password reset flow
- Error/success feedback via inline messages
- Redirects to `/dashboard` on success

#### 5.2.2 Auth Callback (`/auth/callback`)
- Server-side route handler for Supabase auth code exchange

#### 5.2.3 Sign Out (`/auth/signout`)
- Signs out and redirects to home

### 5.3 Dashboard (Authenticated)

#### 5.3.1 Layout (`/dashboard/layout.tsx`)
- Client-side auth guard — checks session, redirects to `/auth/login` if invalid
- Responsive sidebar navigation (collapsible on mobile): Overview, Portfolio, Blog Posts, Settings
- Dark/light toggle
- Sign-out button
- `"use client"` with `force-dynamic`

#### 5.3.2 Overview (`/dashboard`)
- Server component
- Stats cards: total projects, total blog posts, published posts
- Greeting with profile name

#### 5.3.3 Portfolio Management (`/dashboard/portfolio`)
- CRUD interface for `portfolio_projects` table
- Fields: title, description, image URL, live URL, GitHub URL, technologies, featured toggle, order

#### 5.3.4 Blog Management (`/dashboard/blog`)
- CRUD interface for `blog_posts` table
- Fields: title, slug, content, excerpt, cover image, published toggle, tags

#### 5.3.5 Settings (`/dashboard/settings`)
- Tabbed interface: Profile, Social Links, Education, Certifications, Experience, Tech Stack
- Profile tab: name, title, bio, skills, resume URL, avatar URL
- Social Links tab: LinkedIn, GitLab, GitHub, email, phone (with defaults)
- Education tab: multi-entry text area
- Certifications tab: multi-entry text area
- Experience tab: multi-entry text area
- Tech Stack tab: categorized list editor (category + items)
- All persisted to `portfolio_about` table (single row)

### 5.4 API Routes

#### 5.4.1 Auth (`/api/auth/route.ts`)
- Supabase auth route handler

#### 5.4.2 Blog API (`/api/blog/`)
- CRUD endpoints for blog posts

#### 5.4.3 Portfolio API (`/api/portfolio/`)
- CRUD endpoints for portfolio projects

#### 5.4.4 Settings API (`/api/settings/`)
- Update endpoints for site settings

---

## 6. Database Schema

### 6.1 `portfolio_projects`
| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | PK, default `gen_random_uuid()` |
| `created_at` | `TIMESTAMPTZ` | default `now()` |
| `updated_at` | `TIMESTAMPTZ` | auto-updated via trigger |
| `title` | `TEXT` | required |
| `description` | `TEXT` | required |
| `image_url` | `TEXT` | nullable |
| `live_url` | `TEXT` | nullable |
| `github_url` | `TEXT` | nullable |
| `technologies` | `TEXT[]` | default `{}` |
| `featured` | `BOOLEAN` | default `false` |
| `order` | `INTEGER` | default `0` |

### 6.2 `portfolio_about`
| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | PK |
| `created_at` | `TIMESTAMPTZ` | |
| `updated_at` | `TIMESTAMPTZ` | auto-updated |
| `name` | `TEXT` | required |
| `title` | `TEXT` | required |
| `bio` | `TEXT` | required |
| `avatar_url` | `TEXT` | nullable |
| `resume_url` | `TEXT` | nullable |
| `skills` | `TEXT[]` | default `{}` |
| `social_links` | `JSONB` | stores social URLs, education, certifications, experience, techstack |

### 6.3 `blog_posts`
| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | PK |
| `created_at` | `TIMESTAMPTZ` | |
| `updated_at` | `TIMESTAMPTZ` | auto-updated |
| `title` | `TEXT` | required |
| `slug` | `TEXT` | required, UNIQUE |
| `content` | `TEXT` | required |
| `excerpt` | `TEXT` | default `''` |
| `cover_image` | `TEXT` | nullable |
| `published` | `BOOLEAN` | default `false` |
| `author_id` | `UUID` | required |
| `tags` | `TEXT[]` | default `{}` |

### 6.4 `site_settings`
| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | PK |
| `created_at` | `TIMESTAMPTZ` | |
| `updated_at` | `TIMESTAMPTZ` | auto-updated |
| `key` | `TEXT` | required, UNIQUE |
| `value` | `JSONB` | default `{}` |

### Triggers & RLS
- `update_updated_at_column()` trigger on all 4 tables
- RLS enabled on all tables
- Public read access for all tables
- Authenticated users have full CRUD access

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Server Components used for public pages (no client-side JS where possible)
- Static generation for blog posts where feasible
- Image optimization via Next.js `<Image>` or Supabase storage CDN
- Lighthouse: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90

### 7.2 Security
- Supabase RLS on all tables
- Auth guard on dashboard routes (middleware + client-side check)
- Service-role key used only server-side
- Environment variables for all secrets
- Magic link token expiry handled by Supabase

### 7.3 Responsive Design
- Mobile-first with Tailwind responsive utilities
- DaisyUI navbar with mobile collapse
- Dashboard sidebar collapses to hamburger on mobile
- Project/blog cards stack on small screens

### 7.4 Accessibility
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard-navigable (Radix primitives provide this)
- Sufficient color contrast in both light and dark themes

---

## 8. Project Structure

```
my-portfolio/
├── app/
│   ├── globals.css              # Global styles + Tailwind + DaisyUI
│   ├── layout.tsx               # Root layout (metadata, theme script, Toaster, Analytics)
│   ├── page.tsx                 # Home page (server component)
│   ├── not-found.tsx            # 404 page
│   ├── api/
│   │   ├── auth/route.ts
│   │   ├── blog/
│   │   ├── portfolio/
│   │   └── settings/
│   ├── auth/
│   │   ├── callback/route.ts    # Auth callback handler
│   │   ├── login/page.tsx       # Login page (client)
│   │   └── signout/route.ts     # Sign-out handler
│   ├── blog/
│   │   ├── page.tsx             # Blog index
│   │   └── [slug]/page.tsx      # Individual post
│   └── dashboard/
│       ├── layout.tsx           # Dashboard shell (client, auth guard)
│       ├── page.tsx             # Overview (server)
│       ├── blog/page.tsx
│       ├── portfolio/page.tsx
│       └── settings/page.tsx
├── components/
│   ├── theme-toggle.tsx
│   ├── dashboard/
│   └── ui/                      # shadcn-style primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       └── use-toast.ts
├── lib/
│   ├── supabase-server.ts       # Server-side Supabase client
│   ├── supabase.ts              # Client-side Supabase client
│   ├── utils.ts                 # Utilities (cn, formatDate, etc.)
│   └── supabase/
│       └── middleware.ts        # Session refresh middleware
├── scripts/
│   └── seed-profile.mjs         # Database seeding script
├── supabase/
│   └── migrations/
│       └── 00001_init.sql       # Initial schema migration
├── types/
│   └── database.ts              # TypeScript types for DB schema
├── middleware.ts                # Next.js middleware entry
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── vercel.json
├── eslint.config.mjs
├── postcss.config.mjs
└── .env                        # Environment variables
```

---

## 9. Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used for auth redirects) |

---

## 10. Future Enhancements (Backlog)

- [ ] **Secretary Agent (AI Chatbot)** — See §5.1.5 for full spec; high-priority feature
- [ ] RSS feed for blog
- [ ] Comments system (Supabase or third-party)
- [ ] Project filtering by technology tag
- [ ] Blog search
- [ ] Image upload for projects/posts via Supabase Storage
- [ ] ISR/SSG for blog posts
- [ ] Sitemap & robots.txt generation
- [ ] Email newsletter subscription
- [ ] Multi-author blog support
- [ ] Admin user management (invite additional admins)
- [ ] Analytics dashboard (page views, popular posts)
- [ ] Custom domain setup guide
- [ ] Playwright E2E tests

---

## 11. Changelog

| Date | Version | Changes |
|---|---|---|
| 2026-07-24 | 1.0.0 | Initial PRD — covers all existing features |
| 2026-07-24 | 1.1.0 | Added Secretary Agent (AI Chatbot) feature — §5.1.5 |

---

*Generated from codebase analysis. Last updated: 2026-07-24.*
