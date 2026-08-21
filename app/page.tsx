import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import { ArrowRight, ExternalLink, Github, Youtube, Linkedin, Gitlab, Mail, Phone, Code2, Database, Palette, Rocket, Layout, Server, Globe, Eye } from "lucide-react";
import type { PortfolioAbout, PortfolioProject, BlogPost, CaseStudy } from "@/types/database";
import { sanitizeUrl } from "@/lib/sanitize";
import ThemeToggle from "@/components/theme-toggle";
import AnimateOnScroll from "@/components/animate-on-scroll";
import DecryptedText from "@/components/decrypted-text";
import HeroCTA from "@/components/hero-cta";
import ProjectPreview from "@/components/project-preview";

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

// A project only gets a "View Case Study" link once Problem/Solution/Architecture
// has actually been filled in via the dashboard.
const hasCaseStudy = (project: PortfolioProject) => {
  const cs = project.case_study as CaseStudy | null;
  return !!(cs && (cs.problem || cs.solution || cs.architecture));
};

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
            <span className="font-display font-semibold text-lg">{profile?.name || "Portfolio"}</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/#projects" className="btn-noir btn-noir-ghost btn-noir-sm">Work</Link>
            <Link href="/#experience" className="btn-noir btn-noir-ghost btn-noir-sm">Experience</Link>
            <Link href="/blog" className="btn-noir btn-noir-ghost btn-noir-sm">Blog</Link>
            {sanitizeUrl(profile?.resume_url) && (
              <a href={sanitizeUrl(profile?.resume_url)} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">Resume</a>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {profile?.avatar_url && (
            <div className="mb-8 inline-block rounded-full glow">
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
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-6">
            <DecryptedText
              text={profile?.name || "Muhammad Wyzer"}
              speed={40}
              className="text-text"
            />
          </h1>
          <p className="text-text-muted max-w-lg mx-auto leading-relaxed">
            {profile?.bio || "I build production-ready web applications, enterprise workflow systems, and AI-powered platforms."}
          </p>

          <HeroCTA />

          <p className="mt-6 text-sm text-text-dim">
            Available for <span className="text-text-muted">{social?.availability || "Freelance · Remote · Contract"}</span>
          </p>

          {social && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {social.email && (
                <a href={`mailto:${social.email}`} aria-label="Email" className="btn-noir btn-noir-ghost btn-noir-sm px-2.5!">
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {social.phone && (
                <a href={`https://wa.me/${social.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="btn-noir btn-noir-ghost btn-noir-sm px-2.5!">
                  <Phone className="h-4 w-4" />
                </a>
              )}
              {sanitizeUrl(social.github) && (
                <a href={sanitizeUrl(social.github)} target="_blank" rel="noreferrer" aria-label="GitHub" className="btn-noir btn-noir-ghost btn-noir-sm px-2.5!">
                  <Github className="h-4 w-4" />
                </a>
              )}
              {sanitizeUrl(social.linkedin) && (
                <a href={sanitizeUrl(social.linkedin)} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="btn-noir btn-noir-ghost btn-noir-sm px-2.5!">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {sanitizeUrl(social.gitlab) && (
                <a href={sanitizeUrl(social.gitlab)} target="_blank" rel="noreferrer" aria-label="GitLab" className="btn-noir btn-noir-ghost btn-noir-sm px-2.5!">
                  <Gitlab className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
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
      {/* ── Skills ── */}
      {profile?.skills && profile.skills.length > 0 && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <AnimateOnScroll y={15} duration={0.5}>
              <h2 className="text-2xl font-bold text-center text-text mb-8">Skills</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.skills.map((skill) => (
                  <span key={skill} className="badge-noir">{skill}</span>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── Featured Projects ── */}
      <section id="projects" className="py-20" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <AnimateOnScroll y={15} duration={0.5}>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-text">Featured Projects</h2>
              <Link href="/projects" className="btn-noir btn-noir-ghost btn-noir-sm">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll stagger={0.08} y={30} duration={0.5} staggerSelector=".card-noir">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project) => {
              const caseStudy = project.case_study as CaseStudy | null;
              const excerpt = caseStudy?.solution || caseStudy?.problem;
              const capabilities = caseStudy?.capabilities
                ? Object.values(caseStudy.capabilities).flat()
                : [];
              return (
              <div key={project.id} className="card-noir flex flex-col h-full">
                {project.category && (
                  <span className="badge-noir self-start mb-2 capitalize">{project.category}</span>
                )}
                {caseStudy ? (
                  <ProjectPreview projectId={project.id} title={project.title} caseStudy={caseStudy}>
                    <h3 className="font-semibold text-text text-lg mb-2 text-left cursor-pointer hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                  </ProjectPreview>
                ) : (
                  <h3 className="font-semibold text-text text-lg mb-2">{project.title}</h3>
                )}
                <p className="text-sm text-text-muted mb-4 flex-1">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((tech, k) => (
                      <span key={`${tech}-${k}`} className="badge-noir">{tech}</span>
                    ))}
                  </div>
                )}
                {excerpt && (
                  <p className="text-xs italic mb-3 line-clamp-2" style={{ color: "var(--text-dim)" }}>
                    {excerpt}
                  </p>
                )}
                {capabilities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {capabilities.slice(0, 4).map((item, i) => (
                      <span key={`${item}-${i}`} className="badge-noir" style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}>
                        {item}
                      </span>
                    ))}
                    {capabilities.length > 4 && (
                      <span className="badge-noir">+{capabilities.length - 4} more</span>
                    )}
                  </div>
                )}
                {hasCaseStudy(project) && (
                  <div className="flex items-center gap-2 mb-2 self-start">
                    <Link href={`/projects/${project.id}`} className="btn-noir btn-noir-ghost btn-noir-sm">
                      View Case Study <ArrowRight className="h-4 w-4" />
                    </Link>
                    {caseStudy && (
                      <ProjectPreview projectId={project.id} title={project.title} caseStudy={caseStudy}>
                        <button
                          className="btn-noir btn-noir-ghost btn-noir-sm px-2.5!"
                          aria-label={`Preview case study for ${project.title}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </ProjectPreview>
                    )}
                  </div>
                )}
                {(sanitizeUrl(project.live_url) || sanitizeUrl(project.github_url) || sanitizeUrl(project.youtube_url)) && (
                  <div className="flex gap-2">
                    {sanitizeUrl(project.live_url) && (
                      <a href={sanitizeUrl(project.live_url)} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                        <ExternalLink className="h-4 w-4" /> Live
                      </a>
                    )}
                    {sanitizeUrl(project.github_url) && (
                      <a href={sanitizeUrl(project.github_url)} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                        <Github className="h-4 w-4" /> Code
                      </a>
                    )}
                    {sanitizeUrl(project.youtube_url) && (
                      <a href={sanitizeUrl(project.youtube_url)} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                        <Youtube className="h-4 w-4" /> Video
                      </a>
                    )}
                  </div>
                )}
              </div>
              );
            })}
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Engineering Stack ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <AnimateOnScroll y={20} duration={0.6}>
            <h2 className="text-3xl font-bold text-center text-text mb-3">Engineering Stack</h2>
            <p className="text-center text-text-dim text-sm mb-12">Tools &amp; technologies I use across my projects</p>
          </AnimateOnScroll>
          <AnimateOnScroll stagger={0.04} y={30} duration={0.5} staggerSelector=".card-noir">
            <div className={`grid gap-4 sm:grid-cols-2 ${techStack.length === 1 ? "lg:grid-cols-1 max-w-md mx-auto" : techStack.length === 2 ? "lg:grid-cols-2 max-w-3xl mx-auto" : "lg:grid-cols-3"}`}>
            {techStack.map((group, i) => {
              const Icon = iconForCategory(group.category);
              const accent = accentForIndex(i);
              return (
                <div key={`${group.category}-${i}`} className="card-noir">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={`h-5 w-5 ${accent}`} />
                    <h3 className="font-semibold text-text">{group.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {group.items.map((item, j) => (
                      <span key={`${item}-${j}`} className="text-sm text-text-muted">{item}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Work Experience ── */}
      {experienceEntries.length > 0 && (
        <section id="experience" className="py-20" style={{ background: "var(--surface)" }}>
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

      {/* ── Contact / CTA ── */}
      <section className="py-24" style={{ background: "var(--surface)" }}>
        <div className="max-w-xl mx-auto px-4 text-center">
          <AnimateOnScroll y={15} duration={0.5}>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Let&apos;s build something.</h2>
            <p className="text-text-muted mb-8">Have a project, role, or idea in mind? Reach out.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {social.email && (
                <a href={`mailto:${social.email}`} className="btn-noir btn-noir-primary btn-noir-sm">
                  <Mail className="h-4 w-4" /> Email
                </a>
              )}
              {social.phone && (
                <a href={`https://wa.me/${social.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                  <Phone className="h-4 w-4" /> WhatsApp
                </a>
              )}
              {sanitizeUrl(social.github) && (
                <a href={sanitizeUrl(social.github)} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {sanitizeUrl(social.linkedin) && (
                <a href={sanitizeUrl(social.linkedin)} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {sanitizeUrl(social.gitlab) && (
                <a href={sanitizeUrl(social.gitlab)} target="_blank" rel="noreferrer" className="btn-noir btn-noir-ghost btn-noir-sm">
                  <Gitlab className="h-4 w-4" /> GitLab
                </a>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

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
      {/* Projects skeleton */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-8 w-32 bg-[var(--surface-hover)] rounded mx-auto mb-12" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-xl bg-[var(--surface-hover)]" />
          ))}
        </div>
      </div>
      {/* Engineering Stack skeleton */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-8 w-48 bg-[var(--surface-hover)] rounded mx-auto mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-[var(--surface-hover)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
