# Portfolio Visual Redesign — Noir 3D Interactive Experience

## 1. Overview

This document defines the visual redesign direction for **Muhammad Wyzer's personal portfolio** (`wyzer.my.id`). The goal is to evolve the portfolio from a conventional developer portfolio into a premium, interactive personal brand experience that communicates:

- Full Stack Engineering capability
- AI Engineering and LLM expertise
- RAG and Agentic AI experience
- Strong frontend and backend engineering
- Product-building mindset
- Modern visual and interaction design skills

The redesign should feel **premium, technical, cinematic, minimal, and professional** rather than overloaded with visual effects.

### Design Direction

> **Minimalist Noir × 3D × AI Engineer × Cinematic Motion**

Core principle:

> **80% clean UI + 20% wow effect**

Animations and 3D elements should support the story and brand, not distract from content or reduce usability.

---

## 2. Current Technology Foundation

The current project is built with:

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- DaisyUI v5
- Lucide React
- Radix UI
- Supabase
- Vercel

The existing architecture already supports a strong foundation for the redesign. The visual layer should be enhanced incrementally rather than rewriting the application architecture unnecessarily.

### Existing AI Chat Infrastructure

The project already includes a production-quality AI chat system:

- `@ai-sdk/deepseek` — DeepSeek LLM provider via Vercel AI SDK
- `@ai-sdk/react` — React hooks for streaming AI responses (`useChat`)
- `ai` — Vercel AI SDK core
- `ChatWidget` component (`components/chat/chat-widget.tsx`) — floating chat bubble rendered in root layout
- API route at `api/agent/chat/route.ts` — server-side chat endpoint

The existing chat widget should be restyled to match the Noir design system and can serve as a live demonstration of AI engineering capability directly on the portfolio.

### DaisyUI Strategy Decision

The current `globals.css` defines a DaisyUI "portfolio" theme with a light base (`--color-base-100: oklch(1 0 0)` — pure white). The Noir redesign requires a **dark-first, near-black background with a monochromatic palette**.

**Decision: Remove DaisyUI.**

DaisyUI provides pre-built component classes that conflict with the custom Noir visual language. The redesign requires full control over colors, spacing, and component styling. DaisyUI's utility classes and opinionated defaults would require constant overriding.

**Migration path:**

1. Port existing DaisyUI-dependent components to raw Tailwind + Radix UI primitives
2. Define Noir color tokens as CSS custom properties in `globals.css`
3. Remove `@plugin "daisyui"` and the `@plugin "daisyui/theme"` block
4. Keep `tailwindcss-animate` for animation utilities

This simplifies the CSS pipeline and ensures the Noir design system has no conflicting opinions.

---

## 3. Target Experience

When a recruiter, client, or technical lead opens the portfolio, the intended impression is:

> "This developer can build serious software and understands modern AI, frontend, backend, and product experiences."

The website should communicate this within the first 5–10 seconds through:

1. Strong hero statement
2. Distinctive 3D visual identity
3. Smooth motion
4. Clear technical positioning
5. High-quality project presentation
6. Fast and responsive interaction

---

## 4. Proposed Homepage Structure

```text
01 — INTRO / HERO
        ↓
02 — WHO I AM
        ↓
03 — WHAT I BUILD
        ↓
04 — SELECTED WORK
        ↓
05 — AI & TECH STACK
        ↓
06 — EXPERIENCE
        ↓
07 — BLOG / KNOWLEDGE
        ↓
08 — LET'S BUILD
```

Each section should have a clear purpose and a distinct visual rhythm while maintaining one coherent design system.

---

# 5. Section Design

## 5.1 Hero — The First Impression

### Goal

Create an immediate visual identity and clearly communicate the developer's positioning.

### Recommended Content

```text
MUHAMMAD WYZER

Full Stack Developer · AI Engineer · Builder

I build intelligent digital products,
AI-powered systems, and scalable web applications.

[ VIEW WORK ]    [ LET'S CONNECT ]
```

### Visual Direction

Use a dark, cinematic background with:

- Abstract 3D object
- Floating particles
- Subtle grid
- Soft ambient lighting
- Mouse parallax
- Cursor interaction
- Slow object rotation
- Text reveal animation

### Recommended 3D Concept

Create a signature abstract object called the **Wyzer Orb**.

The orb becomes a recurring visual identity across the website.

Potential visual variations:

- Home: abstract 3D orb
- AI project: orb becomes a neural particle network
- Web3 project: orb becomes connected nodes
- Backend project: orb becomes system architecture nodes
- Contact: orb collapses into a single point

### Technologies

- React Three Fiber
- Three.js
- Drei
- Motion / Framer Motion
- GSAP where advanced timeline control is required

---

## 5.2 About — Interactive Developer Profile

Replace a standard text-heavy About section with a structured interactive profile.

Example:

```text
┌─────────────────────────────────────────────┐
│ MUHAMMAD WYZER                              │
│ ─────────────────────────────────────────── │
│                                             │
│ ROLE                                        │
│ Full Stack Developer                         │
│                                             │
│ SPECIALIZATION                              │
│ AI · RAG · Agentic Systems · Web             │
│                                             │
│ FOCUS                                       │
│ Intelligent Products & Scalable Systems      │
│                                             │
│ LOCATION                                    │
│ Indonesia                                   │
└─────────────────────────────────────────────┘
```

### Motion

- Section entrance reveal
- Text masking
- Subtle parallax
- Hover states
- Data-like micro-interactions

Avoid excessive animations on mobile.

---

## 5.3 What I Build

Introduce capability categories rather than presenting a generic skill list.

Recommended categories:

### AI Engineering

- LLM Applications
- RAG
- Agentic Workflows
- Tool Calling
- MCP
- Prompt Engineering
- AI APIs
- Evaluation

### Full Stack Engineering

- Next.js
- React
- TypeScript
- Vue
- Laravel
- Node.js
- NestJS
- FastAPI
- PostgreSQL

### AI Infrastructure

- Ollama
- vLLM
- GPU Optimization
- Vector Databases
- Milvus
- Chroma
- Embeddings
- Hybrid Search
- Reranking

### Backend & Systems

- Redis
- Celery
- RabbitMQ
- WebSockets
- REST APIs
- Authentication
- ACL
- Audit Logging

Each category can be displayed as an interactive card with subtle motion.

---

# 6. Project Showcase

## 6.1 Main Concept

Projects should feel like **case studies**, not simple cards.

Instead of:

```text
[ IMAGE ]
Project Name
Description
Tech Stack
```

Use:

```text
PROJECT 01

AI RECRUITMENT ASSISTANT

AI-powered recruitment workflow
using RAG, CV parsing, semantic search,
and intelligent candidate matching.

AI · RAG · FastAPI · PostgreSQL

[ VIEW CASE STUDY ]
```

### Visual Behavior

On hover:

- 3D card tilt
- Image zoom
- Cursor-following glow
- Tech stack animation
- CTA reveal
- Background transition

### Project-Specific Visuals

Each project should have a visual metaphor.

| Project Type | Visual Metaphor |
|---|---|
| AI / RAG | Neural particles / knowledge graph |
| Agentic AI | Connected workflow nodes |
| Web3 | Blockchain network |
| Full Stack | Isometric application architecture |
| SaaS | Product dashboard abstraction |
| Computer Vision | Detection grid / tracking points |
| Education | Interactive knowledge nodes |

---

# 7. Interactive Tech Stack

Create a visual technology constellation rather than a static logo grid.

Example:

```text
                    Python
                       │
                       │
         React ─────── YOU ─────── Next.js
            │           │             │
            │           │             │
         FastAPI    PostgreSQL      Node.js
                         │
                       Redis
                         │
                       Docker
```

### Interaction

When hovering a technology:

- Highlight related technologies
- Dim unrelated technologies
- Show a small contextual panel
- Animate connection lines

Example:

```text
Python
├── FastAPI
├── AI / LLM
├── RAG
├── LangChain
└── Machine Learning
```

This section should demonstrate technical depth without relying on arbitrary skill percentages.

---

# 8. Experience Timeline

Use a cinematic vertical timeline.

Each item should contain:

- Role
- Organization
- Period
- Short impact statement
- Technologies or domain

### Interaction

As the user scrolls:

- Timeline line grows
- Current item becomes active
- Supporting visual appears
- Previous items reduce opacity

Avoid overly complex 3D effects in the timeline to keep the content readable.

---

# 9. Blog / Knowledge Section

The blog should reinforce technical credibility.

Recommended categories:

- AI Engineering
- RAG
- Agentic AI
- Full Stack
- Backend
- DevOps
- Learning
- Tutorials

### Visual Direction

Use editorial cards with:

- Large typography
- Category label
- Reading time
- Date
- Hover image movement
- Subtle magnetic CTA

The existing blog and dashboard functionality should remain intact.

---

# 10. Contact — Final CTA

The final section should be minimal and memorable.

Suggested copy:

```text
LET'S BUILD SOMETHING
INTELLIGENT.

Have an idea, product, or AI system in mind?
Let's turn it into something real.

[ START A CONVERSATION ]
```

### Visual

The Wyzer Orb slowly contracts and becomes a single glowing point.

On CTA hover:

- Orb expands
- Background reacts subtly
- Button becomes magnetic

---

# 11. Motion System

Motion should be consistent across the entire website.

## Micro Interactions

- Button hover
- Magnetic buttons
- Card tilt
- Cursor-following glow
- Link underline animation
- Icon movement

## Section Transitions

- Fade + translate
- Clip-path reveal
- Text masking
- Scale transition

## Scroll Animations

Use GSAP ScrollTrigger selectively for:

- Hero storytelling
- Horizontal project showcase
- Tech constellation
- Experience timeline

Use Motion for simpler component-level animations.

---

# 12. Custom Cursor

Desktop-only custom cursor.

States:

```text
Default
●

Hover Link
→

Hover Project
VIEW

Hover Image
EXPLORE
```

Requirements:

- Disable on touch devices
- Disable when `prefers-reduced-motion` is enabled
- Never block pointer events
- Keep latency extremely low

---

# 13. 3D Architecture

The 3D system should be modular and lazy-loaded.

Recommended structure:

```text
components/
├── 3d/
│   ├── WyzerOrb.tsx
│   ├── ParticleField.tsx
│   ├── NeuralNetwork.tsx
│   ├── TechConstellation.tsx
│   └── Scene.tsx
```

### Performance Rules

- Lazy-load Three.js components
- Avoid rendering heavy 3D scenes above the fold on low-end devices
- Use lower particle counts on mobile
- Use static fallback images where necessary
- Pause animation when the section is not visible
- Use IntersectionObserver where appropriate
- Support `prefers-reduced-motion`

---

# 14. Recommended Dependencies

Potential additions:

```bash
npm install three @react-three/fiber @react-three/drei
npm install motion gsap
npm install lenis
```

Only add dependencies that are actually required. Avoid overlapping animation libraries for the same use case.

**Animation library strategy — primary vs secondary:**

- **Motion (Framer Motion)** is the primary animation library for all component-level animations (hover, enter, exit, layout, gestures).
- **GSAP + ScrollTrigger** is secondary — use only when complex scroll-driven timelines are required (hero storytelling, horizontal project showcase, experience timeline). Do not use GSAP for simple fade/translate animations.
- **Lenis** for smooth scrolling — test carefully with Next.js App Router. Lenis manipulates the native scroll, which can conflict with Next.js's scroll restoration and `useRouter` navigation. If issues arise, fall back to CSS `scroll-behavior: smooth`.
- **`tailwindcss-animate`** remains for simple utility-driven animations (e.g., `animate-fade-in`, `animate-slide-up`). These are sufficient for 80% of micro-interactions.

**Decision tree:**

```
Animation needed?
├── Simple CSS transition/utility? → tailwindcss-animate
├── Component enter/exit/layout? → Motion
├── Scroll-driven complex timeline? → GSAP ScrollTrigger
└── Page smooth scrolling? → Lenis (with Next.js caveat)
```

Responsibility table:

| Tool | Responsibility | Priority |
|---|---|---|
| tailwindcss-animate | Utility CSS animations | Primary |
| Motion (Framer Motion) | Component-level animations | Primary |
| GSAP + ScrollTrigger | Complex scroll timelines | Secondary |
| React Three Fiber | React-based 3D scenes | Feature |
| Three.js | 3D engine (peer dep of R3F) | Feature |
| Drei | R3F helpers | Feature |
| Lenis | Smooth scrolling | Optional |

Full install command:

```bash
npm install three @react-three/fiber @react-three/drei motion gsap lenis
npm install -D @types/three
```

Only add dependencies when the corresponding feature is being implemented in that phase.

---

## 14.5 Bundle Size Budget

Adding 3D and animation libraries significantly impacts bundle size. Set and enforce a budget.

### Budget Targets

| Metric | Target |
|---|---|
| Initial JS (gzip) | < 150 KB |
| Total JS (gzip) | < 300 KB |
| Lighthouse Performance | ≥ 90 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.0s |

### Code-Splitting Strategy

- **`next/dynamic`** with `ssr: false` for all Three.js / R3F components
- **Route-based splitting** — 3D scenes only on the homepage; other pages exclude R3F entirely
- **GSAP + ScrollTrigger** — imported only in components that use them, not globally
- **Lenis** — initialized only on the homepage, destroyed on route change
- **Static fallbacks** — render a static CSS alternative when a 3D component is loading or on mobile

### Monitoring

- Run `next build` and inspect the output for chunk sizes
- Use `@vercel/analytics` (already installed) for real-user Core Web Vitals
- Run Lighthouse CI in CI/CD if available

---

## 14.6 AI Chat Widget Integration

The existing `ChatWidget` component and DeepSeek-powered chat API route should be preserved and enhanced as a demonstration of AI engineering capability.

### Current State

- Floating chat bubble rendered in `app/layout.tsx`
- Uses `@ai-sdk/deepseek` for LLM inference
- Streaming responses via `useChat` from `@ai-sdk/react`
- Styled with DaisyUI utility classes

### Redesign Integration

1. **Restyle the chat widget** to match the Noir design system (dark glassmorphism, accent glow, sharp typography).
2. **Position the chat as an "Ask My AI" feature** — a live demonstration that the developer builds AI systems, not just talks about them.
3. **Expand the chat system prompt** to include portfolio context (projects, skills, experience) so visitors can ask questions about the developer's work.
4. **Add a subtle visual indicator** in the Hero section (e.g., "💬 Ask my AI assistant anything") to drive engagement.
5. **Keep the existing API route intact** — only modify the system prompt and UI styling.

This turns the chat widget from a generic feature into a portfolio differentiator that directly supports the "AI Engineer" brand positioning.

---

# 15. Design System

## Visual Style

- Dark-first
- Noir
- Minimal
- Technical
- Editorial
- Cinematic

## Typography

Use a strong display font for headlines and a highly readable sans-serif for body content.

Suggested direction:

- Display: Space Grotesk / Sora / Geist
- Body: Geist / Inter
- Monospace: Geist Mono / JetBrains Mono

Do not use too many font families.

## Color Strategy

Use a mostly monochromatic palette:

- Near-black background
- White / off-white typography
- Muted gray surfaces
- One accent color
- Subtle gradients only where needed

The accent color should be used for:

- CTA
- Active states
- Interactive 3D lighting
- Links
- Key highlights

---

# 16. Accessibility

The redesign must preserve accessibility.

Requirements:

- Keyboard navigable
- Visible focus states
- Semantic HTML
- Sufficient contrast
- Reduced-motion support
- Alt text for meaningful images
- 3D visuals must not contain essential information unavailable in text
- Custom cursor must not replace standard interaction feedback

---

# 17. Responsive Strategy

## Desktop

Full experience:

- 3D
- Cursor effects
- Parallax
- Horizontal scroll
- Complex motion

## Tablet

Reduced 3D complexity.

## Mobile

Prioritize:

- Content
- Typography
- Performance
- Touch interactions

Disable or simplify:

- Custom cursor
- Heavy particle systems
- Excessive parallax
- Complex WebGL scenes

Mobile should feel intentionally designed, not like a reduced desktop version.

---

# 18. Implementation Phases

## Phase 1 — Visual Foundation

- [x] Remove DaisyUI; port components to raw Tailwind + Radix
- [x] Define Noir color tokens (CSS custom properties)
- [ ] Define typography (display, body, mono) — still on `system-ui` stack; no Space Grotesk/Sora/Geist or mono font loaded
- [x] Redesign navigation (sticky, glassmorphism, Noir) — see Section 5
- [x] Redesign buttons (magnetic, accent, outline variants) — `btn-noir` primary/ghost variants + `SpecularButton` (mouse-follow) for the CTA
- [ ] Redesign cards (dark surface, border glow, hover tilt) — `card-noir` has dark surface + border-color hover only; no glow/tilt on standard cards
- [x] Improve spacing system
- [x] Improve responsive layouts

## Phase 2 — Hero Experience

- [x] Redesign hero with Noir visual direction
- [x] Add typography reveal animation — implemented via custom `DecryptedText` component rather than the Motion library
- [x] Add parallax / mouse-follow effect — `SplashCursor` (WebGL fluid cursor) + `SpecularButton` mouse-follow
- [ ] Add initial 3D Wyzer Orb (React Three Fiber, lazy-loaded) — not started; no R3F/Three.js in the project (only `ogl` for cursor/border effects)
- [x] Add CTA interactions (magnetic buttons, hover glow) — `SpecularButton` + `ElectricBorder` on the avatar
- [ ] Add "Ask my AI" teaser linking to chat widget — chat widget exists as a floating bubble, but no explicit hero teaser copy

## Phase 3 — About & Capabilities

- [ ] Redesign "Who I Am" section as interactive profile (Section 5.2) — no dedicated structured profile block yet
- [ ] Redesign "What I Build" as capability cards (Section 5.3) — current Tech Stack section groups by data-driven categories (Frontend/Backend), not the AI/Full Stack/Infra/Systems capability framing from spec
- [x] Add section entrance reveals — `AnimateOnScroll` (GSAP ScrollTrigger) used across Tech Stack, Education, Certifications, Experience, Projects, Blog
- [x] Add hover micro-interactions on capability cards — `card-noir` hover border-color change
- [ ] Data-like text masking animations — only the hero name uses a reveal effect (`DecryptedText`)

## Phase 4 — Motion System

- [x] Add Motion animations to all sections — implemented via GSAP (`AnimateOnScroll`) rather than the Motion/Framer Motion library
- [x] Add GSAP ScrollTrigger for complex timelines (hero, timeline) — used for staggered section/timeline reveals
- [ ] Add page transitions
- [x] Add magnetic buttons — `SpecularButton` (`followMouse`, `proximity`)
- [ ] Add custom cursor (desktop only, respects `prefers-reduced-motion`) — `SplashCursor` exists but doesn't gate on touch devices or `prefers-reduced-motion`

## Phase 5 — Project Showcase

- [ ] Redesign project cards as case-study cards (Section 6) — cards show title/description/tech badges/links, not the numbered case-study format
- [ ] Add 3D card tilt on hover
- [ ] Add cursor-following glow — `ElectricBorder` gives a static animated glow, not cursor-following
- [ ] Add project-specific visual metaphors
- [ ] Add case-study detail layout
- [ ] Add horizontal scroll storytelling (GSAP)

## Phase 6 — Tech Constellation

- [ ] Create interactive technology graph (Section 7) — current Tech Stack is a static card grid, not a constellation graph
- [ ] Add relationship highlighting on hover
- [ ] Add contextual technology panels
- [ ] Add connection line animations

## Phase 7 — Experience Timeline & Blog

- [x] Redesign experience timeline (Section 8) — vertical alternating timeline with dot markers for Education/Certifications/Experience
- [ ] Add scroll-driven timeline progression (GSAP ScrollTrigger) — entrance reveal is scroll-triggered, but no growing line / active-item progression
- [ ] Redesign blog cards as editorial cards (Section 9) — current cards are simple `card-noir` (title, date, excerpt), not the large-typography editorial format
- [ ] Add blog hover interactions (image movement, magnetic CTA)
- [x] Ensure existing blog CRUD functionality is preserved — `app/dashboard/blog/page.tsx` intact

## Phase 8 — Contact & Chat Integration

- [ ] Redesign contact section as minimal final CTA (Section 10) — contact links currently live in the hero, no dedicated closing CTA section
- [ ] Integrate Wyzer Orb ending animation (contracts to point) — no Wyzer Orb exists yet
- [x] Restyle ChatWidget to Noir design system
- [x] Expand chat system prompt with portfolio context — `buildProfileContext()` reads `files/data.json` + live blog posts into the system prompt
- [ ] Test chat streaming with new styling

## Phase 9 — Performance & QA

- [ ] Lighthouse optimization (target ≥ 90)
- [ ] Bundle size audit (target < 150 KB initial JS gzip)
- [x] Code-splitting verification (R3F, GSAP lazy-loaded) — `SplashCursor`, `ChatWidget`, `ElectricBorder` use `next/dynamic` with `ssr: false`; GSAP is dynamically imported in `AnimateOnScroll`; `HeroCTA` (ogl-based) is deferred too. No R3F in use.
- [ ] WebGL performance testing (low-end device)
- [ ] Mobile testing (simplified 3D, no custom cursor)
- [ ] Reduced-motion testing
- [ ] Accessibility audit (keyboard nav, focus states, contrast)
- [ ] SEO audit
- [ ] Vercel production testing

---

# 19. Success Criteria

The redesign is considered successful when:

1. The portfolio immediately communicates Full Stack + AI Engineering expertise.
2. The visual identity is memorable without becoming distracting.
3. The Hero contains a distinctive 3D experience.
4. Projects are presented as high-quality case studies.
5. Motion feels smooth and intentional.
6. Mobile performance remains strong.
7. Lighthouse performance remains acceptable.
8. Accessibility is preserved.
9. Existing blog and dashboard functionality continues working.
10. The website feels like a premium developer/product portfolio rather than a template.

---

# 20. Recommended Final Direction

The strongest version of the portfolio should combine:

```text
                 PREMIUM
                    │
                    ▼
          ┌─────────────────┐
          │   NOIR VISUAL   │
          └─────────────────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
        3D                  MOTION
          │                   │
          └─────────┬─────────┘
                    ▼
           TECHNICAL STORY
                    │
                    ▼
             STRONG PROJECTS
                    │
                    ▼
             AI + FULL STACK
                    │
                    ▼
          MEMORABLE PERSONAL BRAND
```

The key is not to maximize the number of effects. The goal is to create a **coherent visual narrative** where 3D, motion, typography, project presentation, and technical content all reinforce the same personal brand.

> **Final creative direction:** Minimalist Noir × Interactive 3D × AI Engineering × Cinematic Motion.
