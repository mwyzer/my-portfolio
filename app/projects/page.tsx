import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Youtube } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { PortfolioProject, CaseStudy } from "@/types/database";
import ThemeToggle from "@/components/theme-toggle";
import ElectricBorderDeferred from "@/components/deferred/electric-border-deferred";
import { sanitizeUrl } from "@/lib/sanitize";

// A project only gets a "View Case Study" link once Problem/Solution/Architecture
// has actually been filled in via the dashboard.
const hasCaseStudy = (project: PortfolioProject) => {
  const cs = project.case_study as CaseStudy | null;
  return !!(cs && (cs.problem || cs.solution || cs.architecture));
};

export const metadata = {
  title: "Projects",
  description: "All projects, past and present",
};

// Kept in sync with the STATIC_PROJECT_TITLE guard in app/page.tsx —
// this card is hardcoded (not dashboard-managed), so it's filtered out of
// the Supabase list below to avoid a duplicate.
const STATIC_PROJECT_TITLE = "lms mahasiswa";

// Shared glow-border color so every project card (static + dynamic) matches
// the homepage's Projects section.
const PROJECT_GLOW_COLOR = "#6366f1";

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient();

  const { data } = await (supabase
    .from("portfolio_projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("order", { ascending: true }) as unknown as Promise<{ data: PortfolioProject[] | null; error: any }>);

  const projects = (data || []).filter((p) => p.title.trim().toLowerCase() !== STATIC_PROJECT_TITLE);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg text-text hover:text-accent transition-colors">Portfolio</Link>
          <div className="flex items-center gap-1">
            <Link href="/" className="btn-noir btn-noir-ghost btn-noir-sm">Home</Link>
            <Link href="/projects" className="btn-noir btn-noir-sm" style={{ background: "var(--color-accent)", color: "#fff", borderColor: "var(--color-accent)" }}>Projects</Link>
            <Link href="/blog" className="btn-noir btn-noir-ghost btn-noir-sm">Blog</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="mb-2 text-4xl font-bold text-text">Projects</h1>
        <p className="mb-10 text-text-muted">
          Everything I&apos;ve built, in one place
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Static: LMS Mahasiswa */}
          <ElectricBorderDeferred color={PROJECT_GLOW_COLOR} speed={0.6} chaos={0.12} borderRadius={12}>
            <div className="card-noir flex flex-col h-full" style={{ borderColor: "transparent" }}>
              <h3 className="font-semibold text-text text-lg mb-2">LMS Mahasiswa</h3>
              <p className="text-sm text-text-muted mb-4 flex-1">
                Full-stack Learning Management System — multi-role (student, instructor, admin), attendance, assignments, quizzes, AI chat assistant, Python playground &amp; PWA support.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["Nuxt 4", "Vue 3", "TypeScript", "Pinia", "Supabase", "Nitro", "Vite", "Vuestic UI", "PWA", "Vitest", "Playwright"].map((t) => (
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

          {/* Dynamic: all Supabase projects */}
          {projects.map((project) => (
            <ElectricBorderDeferred key={project.id} color={PROJECT_GLOW_COLOR} speed={0.6} chaos={0.12} borderRadius={12}>
              <div className="card-noir flex flex-col h-full" style={{ borderColor: "transparent" }}>
                <h3 className="font-semibold text-text text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-text-muted mb-4 flex-1">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span key={`${tech}-${i}`} className="badge-noir">{tech}</span>
                    ))}
                  </div>
                )}
                {hasCaseStudy(project) && (
                  <Link href={`/projects/${project.id}`} className="btn-noir btn-noir-ghost btn-noir-sm mb-2 self-start">
                    View Case Study <ArrowRight className="h-4 w-4" />
                  </Link>
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
            </ElectricBorderDeferred>
          ))}
        </div>
      </div>
    </div>
  );
}
