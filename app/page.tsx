import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import { ArrowRight, ExternalLink, Github, Linkedin, Gitlab, Mail, Phone, Code2, Database, Palette, Rocket, Layout, Server, Globe } from "lucide-react";
import type { PortfolioAbout, PortfolioProject, BlogPost } from "@/types/database";
import ThemeToggle from "@/components/theme-toggle";
import AnimateOnScroll from "@/components/animate-on-scroll";
import DecryptedText from "@/components/decrypted-text";
import ElectricBorderDeferred from "@/components/deferred/electric-border-deferred";

// HeroCTA wraps SpecularButton which imports ogl (WebGL) — defer it
// to remove a heavy JS bundle from the critical rendering path.
const HeroCTA = dynamic(() => import("@/components/hero-cta"), {
  loading: () => <div className="mt-8 h-12" />,
});

// ── Module-level helpers (hoisted out to avoid re-creating per render) ──
const iconForCategory = (cat: string) => {
  const lower = cat.toLowerCase();
  if (lower.includes("front")) return Layout;
  if (lower.includes("back")) return Server;
  if (lower.includes("db") || lower.includes("data")) return Database;
  if (lower.includes("style") || lower.includes("ui") || lower.includes("design")) return Palette;
  if (lower.includes("build") || lower.includes("test") || lower.includes("tool")) return Rocket;
  if (lower.includes("core")) return Code2;
  return Globe;
};

const accentColors = [
  "text-[#6366f1]",
  "text-[#22c55e]",
  "text-[#f59e0b]",
  "text-[#06b6d4]",
  "text-[#ec4899]",
  "text-[#ef4444]",
];
const accentForIndex = (i: number) => accentColors[i % accentColors.length];

// The "LMS Mahasiswa" project card below is hardcoded (not dashboard-managed).
// Guard against it rendering twice if the same project ever also gets added
// to portfolio_projects in Supabase.
const STATIC_PROJECT_TITLE = "lms mahasiswa";

// Shared glow-border color so every project card (static + dynamic) matches.
const PROJECT_GLOW_COLOR = "#6366f1";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // Redirect magic link / OTP auth params to the auth callback
  if (params.code || params.token_hash) {
    const qs = new URLSearchParams();
    if (params.code) qs.set("code", params.code as string);
    if (params.token_hash) qs.set("token_hash", params.token_hash as string);
    if (params.type) qs.set("type", params.type as string);
    if (params.next) qs.set("next", params.next as string);
    redirect(`/auth/callback?${qs.toString()}`);
  }

  const supabase = await createServerSupabaseClient();

  // Fetch profile only — this is all the hero section needs.
  // Projects & blog posts are streamed later via Suspense to reduce TTFB.
  const { data: profile } = await (supabase
    .from("portfolio_about")
    .select("*")
    .single() as unknown as Promise<{ data: PortfolioAbout | null; error: any }>);

  const social = (profile?.social_links as Record<string, any> | null) ?? {};
  const educationEntries: string[] = (typeof social?.education === "string" ? social.education.split("\n\n").filter(Boolean) : []);
  const certEntries: string[] = (typeof social?.certifications === "string" ? social.certifications.split("\n\n").filter(Boolean) : []);
  const experienceEntries: string[] = (typeof social?.experience === "string" ? social.experience.split("\n\n").filter(Boolean) : []);

  const techStack: { category: string; items: string[] }[] = Array.isArray(social?.techstack)
    ? social.techstack
    : [
        {
          category: "Frontend",
          items: ["Next.js 15","Nuxt 4","React 18/19","Vue 3","TypeScript","Pinia","Tailwind CSS","DaisyUI","shadcn/ui","Vuestic UI","Radix UI","Lucide Icons","Recharts","PWA","Zustand","TanStack Query","Axios","React Hook Form","Zod"],
        },
        {
          category: "Backend",
          items: ["ASP.NET Core","Supabase","PostgreSQL","EF Core","pgvector","Nitro","SignalR","Docker","Vite","Vitest","Playwright","xUnit"],
        },
      ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* ── Navigation ── */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-text hover:text-accent transition-colors">
            <span className="font-semibold text-lg">{profile?.name || "Portfolio"}</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/#projects" className="btn-noir btn-noir-ghost btn-noir-sm">Projects</Link>
            <Link href="/blog" className="btn-noir btn-noir-ghost btn-noir-sm">Blog</Link>
            {profile?.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">Resume</a>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {profile?.avatar_url && (
            <div className="mb-8 inline-block" style={{ overflow: "visible" }}>
              <ElectricBorderDeferred
                color="#6366f1"
                speed={0.8}
                chaos={0.15}
                borderRadius={9999}
              >
                <div className="w-32 h-32 rounded-full p-0.5" style={{ background: "linear-gradient(135deg, var(--color-accent), rgba(99,102,241,0.3))" }}>
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name || "Avatar"}
                    width={128}
                    height={128}
                    priority
                    className="w-full h-full rounded-full object-cover"
                    style={{ background: "var(--bg)" }}
                  />
                </div>
              </ElectricBorderDeferred>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-4">
            <DecryptedText
              text={profile?.name || "Welcome"}
              speed={40}
              className="text-text"
            />
          </h1>
          <p className="text-lg md:text-xl text-text-muted mb-2">{profile?.title || ""}</p>
          <p className="text-text-muted max-w-lg mx-auto leading-relaxed">{profile?.bio || ""}</p>

          {profile?.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {profile.skills.map((skill) => (
                <span key={skill} className="badge-noir">{skill}</span>
              ))}
            </div>
          )}

          {social && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {social.email && (
                <a href={`mailto:${social.email}`} className="btn-noir btn-noir-ghost btn-noir-sm">
                  <Mail className="h-4 w-4" /> Email
                </a>
              )}
              {social.phone && (
                <a href={`https://wa.me/${social.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                  <Phone className="h-4 w-4" /> WhatsApp
                </a>
              )}
              {social.github && (
                <a href={social.github} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {social.gitlab && (
                <a href={social.gitlab} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                  <Gitlab className="h-4 w-4" /> GitLab
                </a>
              )}
            </div>
          )}
          <HeroCTA />
        </div>
      </section>

      {/* ── Below-fold: streamed via Suspense ──
          Projects & blog posts are fetched in parallel inside
          HomeBelowFold, so the hero section streams to the browser
          immediately after the single profile query completes. */}
      <Suspense fallback={<BelowFoldSkeleton />}>
        <HomeBelowFold
          profile={profile}
          social={social}
          educationEntries={educationEntries}
          certEntries={certEntries}
          experienceEntries={experienceEntries}
          techStack={techStack}
        />
      </Suspense>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
//  Below-fold content — streamed after the hero section
// ────────────────────────────────────────────────────────────────

type BelowFoldProps = {
  profile: PortfolioAbout | null;
  social: Record<string, any>;
  educationEntries: string[];
  certEntries: string[];
  experienceEntries: string[];
  techStack: { category: string; items: string[] }[];
};

async function HomeBelowFold({
  profile,
  social,
  educationEntries,
  certEntries,
  experienceEntries,
  techStack,
}: BelowFoldProps) {
  const supabase = await createServerSupabaseClient();

  // Fetch projects and blog posts in parallel — no sequential wait
  const [projectsResult, postsResult] = await Promise.all([
    supabase
      .from("portfolio_projects")
      .select("*")
      .order("featured", { ascending: false })
      .order("order", { ascending: true })
      .limit(6) as unknown as Promise<{ data: PortfolioProject[] | null; error: any }>,
    supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3) as unknown as Promise<{ data: BlogPost[] | null; error: any }>,
  ]);

  const projects = projectsResult.data;
  const posts = postsResult.data;

  return (
    <>
      {/* ── Tech Stack ── */}
      <section className="py-20" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <AnimateOnScroll y={20} duration={0.6}>
            <h2 className="text-3xl font-bold text-center text-text mb-3">Tech Stack</h2>
            <p className="text-center text-text-dim text-sm mb-12">Tools &amp; technologies I use across my projects</p>
          </AnimateOnScroll>
          <AnimateOnScroll stagger={0.04} y={30} duration={0.5} staggerSelector=".card-noir">
            <div className={`grid gap-4 sm:grid-cols-2 ${techStack.length === 1 ? "lg:grid-cols-1 max-w-md mx-auto" : techStack.length === 2 ? "lg:grid-cols-2 max-w-3xl mx-auto" : "lg:grid-cols-3"}`}>
            {techStack.map((group, i) => {
              const Icon = iconForCategory(group.category);
              const accent = accentForIndex(i);
              return (
                <div key={group.category} className="card-noir">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={`h-5 w-5 ${accent}`} />
                    <h3 className="font-semibold text-text">{group.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {group.items.map((item) => (
                      <span key={item} className="text-sm text-text-muted">{item}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          </AnimateOnScroll>
          <AnimateOnScroll y={15} duration={0.5} delay={0.3}>
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <a href="https://github.com/mwyzer/vue-lms-mahasiswa" target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
              <Github className="h-4 w-4" /> LMS Mahasiswa
            </a>
            <a href="https://nuxt-lms-mahasiswa.vercel.app" target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
            <a href="https://github.com/mwyzer/portal-helpdesk" target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
              <Github className="h-4 w-4" /> AI Helpdesk
            </a>
            <a href="https://github.com/mwyzer/99999" target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
              <Github className="h-4 w-4" /> 99999
            </a>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Education ── */}
      {educationEntries.length > 0 && (
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4">
            <AnimateOnScroll y={20} duration={0.6}>
              <h2 className="text-3xl font-bold text-center text-text mb-12">Formal Education</h2>
            </AnimateOnScroll>
            <AnimateOnScroll stagger={0.15} y={25} duration={0.5} triggerStart="top 80%">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px" style={{ background: "var(--border)" }} />
              <div className="space-y-8">
                {educationEntries.map((entry, i) => {
                  const lines = entry.split("\n").filter(Boolean);
                  const institution = lines[0] || "";
                  const period = lines[1] || "";
                  const isLeft = i % 2 === 0;
                  return (
                    <div key={i} className={`relative flex items-start gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-1.5 z-10" style={{ background: "var(--color-accent)", boxShadow: "0 0 8px var(--color-accent-glow)" }} />
                      <div className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                        <div className="card-noir !p-4">
                          <h3 className="font-semibold text-text text-base">{institution}</h3>
                          {period && <p className="text-sm text-text-dim mt-1">{period}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── Certifications ── */}
      {certEntries.length > 0 && (
        <section className="py-20" style={{ background: "var(--surface)" }}>
          <div className="max-w-3xl mx-auto px-4">
            <AnimateOnScroll y={20} duration={0.6}>
              <h2 className="text-3xl font-bold text-center text-text mb-12">Certifications &amp; Training</h2>
            </AnimateOnScroll>
            <AnimateOnScroll stagger={0.15} y={25} duration={0.5} triggerStart="top 80%">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px" style={{ background: "var(--border)" }} />
              <div className="space-y-8">
                {certEntries.map((entry, i) => {
                  const [year, ...rest] = entry.split("\t").filter(Boolean);
                  const desc = rest.join(" ");
                  const isLeft = i % 2 === 0;
                  return (
                    <div key={i} className={`relative flex items-start gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-1.5 z-10" style={{ background: "var(--color-accent)", boxShadow: "0 0 8px var(--color-accent-glow)" }} />
                      <div className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                        <div className="card-noir !p-4">
                          <h3 className="font-semibold text-text text-base">{desc}</h3>
                          {year && <p className="text-sm text-text-dim mt-1">{year}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── Work Experience ── */}
      {experienceEntries.length > 0 && (
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4">
            <AnimateOnScroll y={20} duration={0.6}>
              <h2 className="text-3xl font-bold text-center text-text mb-12">Work Experience</h2>
            </AnimateOnScroll>
            <AnimateOnScroll stagger={0.15} y={25} duration={0.5} triggerStart="top 80%">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px" style={{ background: "var(--border)" }} />
              <div className="space-y-8">
                {experienceEntries.map((entry, i) => {
                  const lines = entry.split("\n").filter(Boolean);
                  const period = lines[0] || "";
                  const role = lines[1] || "";
                  const bullets = lines.slice(2).filter(l => l.startsWith("•") || l.startsWith("·") || l.startsWith("-"));
                  const isLeft = i % 2 === 0;
                  return (
                    <div key={i} className={`relative flex items-start gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-1.5 z-10" style={{ background: "var(--color-accent)", boxShadow: "0 0 8px var(--color-accent-glow)" }} />
                      <div className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                        <div className="card-noir !p-4">
                          {period && <p className="text-sm text-text-dim">{period}</p>}
                          {role && <h3 className="font-semibold text-text text-base mt-0.5">{role}</h3>}
                          {bullets.length > 0 && (
                            <ul className="list-disc pl-5 text-sm text-text-muted space-y-1 mt-2">
                              {bullets.map((b, j) => (
                                <li key={j}>{b.replace(/^[•·-]\s*/, "")}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── Projects ── */}
      <section id="projects" className="py-20" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <AnimateOnScroll y={15} duration={0.5}>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-text">Projects</h2>
              <Link href="/projects" className="btn-noir btn-noir-ghost btn-noir-sm">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger={0.08} y={30} duration={0.5} staggerSelector=".card-noir">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Static: LMS Mahasiswa — kept out of Supabase, so filter it out of the
                dynamic list below by title to avoid rendering it twice. Every card
                in this grid (static + dynamic) shares the same glow-border treatment. */}
            <ElectricBorderDeferred color={PROJECT_GLOW_COLOR} speed={0.6} chaos={0.12} borderRadius={12}>
              <div className="card-noir flex flex-col h-full" style={{ borderColor: "transparent" }}>
                <h3 className="font-semibold text-text text-lg mb-2">LMS Mahasiswa</h3>
                <p className="text-sm text-text-muted mb-4 flex-1">
                  Full-stack Learning Management System — multi-role (student, instructor, admin), attendance, assignments, quizzes, AI chat assistant, Python playground &amp; PWA support.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {["Nuxt 4","Vue 3","TypeScript","Pinia","Supabase","Nitro","Vite","Vuestic UI","PWA","Vitest","Playwright"].map(t => (
                    <span key={t} className="badge-noir">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a href="https://nuxt-lms-mahasiswa.vercel.app" target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                    <ExternalLink className="h-4 w-4" /> Live
                  </a>
                  <a href="https://github.com/mwyzer/vue-lms-mahasiswa" target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                    <Github className="h-4 w-4" /> Code
                  </a>
                </div>
              </div>
            </ElectricBorderDeferred>
            {/* Dynamic: Supabase projects */}
            {projects?.filter((p) => p.title.trim().toLowerCase() !== STATIC_PROJECT_TITLE).map((project) => (
              <ElectricBorderDeferred key={project.id} color={PROJECT_GLOW_COLOR} speed={0.6} chaos={0.12} borderRadius={12}>
                <div className="card-noir flex flex-col h-full" style={{ borderColor: "transparent" }}>
                  <h3 className="font-semibold text-text text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-text-muted mb-4 flex-1">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="badge-noir">{tech}</span>
                      ))}
                    </div>
                  )}
                  {(project.live_url || project.github_url) && (
                    <div className="flex gap-2">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                          <ExternalLink className="h-4 w-4" /> Live
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                          <Github className="h-4 w-4" /> Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </ElectricBorderDeferred>
            ))}
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Blog ── */}
      {posts && posts.length > 0 && (
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4">
            <AnimateOnScroll y={15} duration={0.5}>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-text">Latest Posts</h2>
                <Link href="/blog" className="btn-noir btn-noir-ghost btn-noir-sm">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll stagger={0.1} y={25} duration={0.5} staggerSelector=".card-noir">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <div className="card-noir h-full group-hover:border-accent transition-colors">
                    <h3 className="font-semibold text-text text-lg mb-2 group-hover:text-accent transition-colors">{post.title}</h3>
                    <p className="text-xs text-text-dim mb-3">{formatDate(post.created_at)}</p>
                    <p className="text-sm text-text-muted line-clamp-3">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="py-10 text-center border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm text-text-dim" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} {profile?.name || "Portfolio"}. All rights reserved.
        </p>
      </footer>
    </>
  );
}

/** Skeleton shown while the below-fold section streams in */
function BelowFoldSkeleton() {
  return (
    <div className="animate-pulse space-y-20 py-20">
      {/* Tech Stack skeleton */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-8 w-48 bg-[var(--surface-hover)] rounded mx-auto mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-[var(--surface-hover)]" />
          ))}
        </div>
      </div>
      {/* Projects skeleton */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-8 w-32 bg-[var(--surface-hover)] rounded mx-auto mb-12" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-xl bg-[var(--surface-hover)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
