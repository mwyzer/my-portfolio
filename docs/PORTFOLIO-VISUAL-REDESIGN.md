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

Recommended responsibility:

| Tool | Responsibility |
|---|---|
| React Three Fiber | React-based 3D scenes |
| Three.js | 3D engine |
| Drei | R3F helpers |
| Motion | Component animations |
| GSAP | Complex scroll timelines |
| Lenis | Smooth scrolling |

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

- [ ] Establish Noir design system
- [ ] Define typography
- [ ] Define color tokens
- [ ] Redesign navigation
- [ ] Redesign buttons
- [ ] Redesign cards
- [ ] Improve spacing system
- [ ] Improve responsive layouts

## Phase 2 — Hero Experience

- [ ] Redesign hero
- [ ] Add typography reveal
- [ ] Add parallax
- [ ] Add initial 3D Wyzer Orb
- [ ] Add CTA interactions

## Phase 3 — Motion System

- [ ] Add Motion animations
- [ ] Add GSAP ScrollTrigger
- [ ] Add page transitions
- [ ] Add magnetic buttons
- [ ] Add custom cursor

## Phase 4 — Project Showcase

- [ ] Redesign project cards
- [ ] Add hover interactions
- [ ] Add project-specific visuals
- [ ] Add case-study layout
- [ ] Add scroll storytelling

## Phase 5 — Tech Constellation

- [ ] Create interactive technology graph
- [ ] Add relationship highlighting
- [ ] Add contextual technology panels

## Phase 6 — Experience & Contact

- [ ] Redesign timeline
- [ ] Add scroll-driven timeline
- [ ] Create final CTA
- [ ] Integrate Wyzer Orb ending animation

## Phase 7 — Performance & QA

- [ ] Lighthouse optimization
- [ ] WebGL performance testing
- [ ] Mobile testing
- [ ] Reduced-motion testing
- [ ] Accessibility audit
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
