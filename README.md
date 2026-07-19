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
| **Hosting** | [Vercel](https://vercel.com/) (custom domain `wyzer.my.id`) |
| **Package Manager** | npm |

## UI & Design

- **DaisyUI** components: `navbar`, `hero`, `card`, `badge`, `btn`, `timeline`, `footer`, `input`, `alert`, `loading`
- **Custom DaisyUI theme** — `"portfolio"` with oklch color tokens
- **Dark/light mode toggle** via `data-theme` attribute with `localStorage` persistence
- **Fully responsive** — mobile-first layout with DaisyUI breakpoints
- **No flash of unstyled content** — inline theme script before hydration

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
cp .env.example .env.local
# Fill in your Supabase keys

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

## Deployment

Pushes to `main` auto-deploy to Vercel at **[www.wyzer.my.id](https://www.wyzer.my.id)**.

## License

Private — Muhammad Wyzer © 2026
