import Link from "next/link";
import { ArrowRight, ExternalLink, Eye, CheckCircle2 } from "lucide-react";
import { Github, Youtube } from "@/components/brand-icons";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { mergeWithFlagshipProjects } from "@/lib/flagship-projects";
import type { PortfolioProject, CaseStudy } from "@/types/database";
import ThemeToggle from "@/components/theme-toggle";
import ProjectPreview from "@/components/project-preview";
import { sanitizeUrl } from "@/lib/sanitize";

// A project only gets a "View Case Study" link once Problem/Solution/Architecture
// has actually been filled in via the dashboard or flagship enrichment.
const hasCaseStudy = (project: PortfolioProject) => {
  const cs = project.case_study as CaseStudy | null;
  return !!(cs && (cs.problem || cs.solution || cs.architecture));
};

export const metadata = {
  title: "Projects",
  description: "Production systems, multi-service backends, and AI engineering repositories",
};

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient();

  const { data } = await (supabase
    .from("portfolio_projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("order", { ascending: true }) as unknown as Promise<{ data: PortfolioProject[] | null; error: any }>);

  const projects = mergeWithFlagshipProjects(data);

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

      <main className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="mb-2 text-4xl font-bold text-text">Projects &amp; Engineering Systems</h1>
        <p className="mb-10 text-text-muted">
          Multi-service backends, deterministic verification engines, and full-stack applications across Python 3, Go, Java 21, and TypeScript.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const caseStudy = project.case_study as CaseStudy | null;
            const highlights = caseStudy?.highlights ?? [];
            const metrics = caseStudy?.metrics ?? [];
            const excerpt = caseStudy?.solution || caseStudy?.problem;
            const capabilities = caseStudy?.capabilities
              ? Object.values(caseStudy.capabilities).flat()
              : [];
            return (
            <div key={project.id} className="card-noir flex flex-col h-full">
              <div className="flex items-start justify-between gap-2 mb-2">
                {project.category ? (
                  <span className="badge-noir capitalize">{project.category}</span>
                ) : <span />}
                {project.views > 0 && (
                  <span className="flex items-center gap-1 text-xs text-text-dim shrink-0">
                    <Eye aria-hidden="true" className="h-3.5 w-3.5" /> {project.views.toLocaleString()}
                  </span>
                )}
              </div>
              {caseStudy ? (
                <ProjectPreview projectId={project.id} title={project.title} caseStudy={caseStudy}>
                  <button
                    type="button"
                    className="font-semibold text-text text-lg text-left cursor-pointer hover:text-accent transition-colors"
                  >
                    {project.title}
                  </button>
                </ProjectPreview>
              ) : (
                <h3 className="font-semibold text-text text-lg">{project.title}</h3>
              )}
              {project.subtitle && (
                <p className="text-sm text-text-dim mb-2">{project.subtitle}</p>
              )}
              {metrics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 my-2">
                  {metrics.slice(0, 3).map((metric, mIdx) => (
                    <span
                      key={`${metric}-${mIdx}`}
                      className="badge-noir text-xs font-medium"
                      style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm text-text-muted mb-3 mt-1">{project.description}</p>
              {highlights.length > 0 ? (
                <div className="mb-4 flex-1 rounded-lg border p-3" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
                  <p className="text-xs font-semibold text-text mb-1.5">Architecture &amp; Engineering Highlights</p>
                  <ul className="space-y-1.5">
                    {highlights.slice(0, 2).map((hl, hIdx) => (
                      <li key={`${hl}-${hIdx}`} className="flex items-start gap-1.5 text-xs text-text-muted leading-relaxed">
                        <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" />
                        <span className="line-clamp-2">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : excerpt ? (
                <p className="text-xs italic mb-3 flex-1 line-clamp-2" style={{ color: "var(--text-dim)" }}>
                  {excerpt}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span key={`${tech}-${i}`} className="badge-noir">{tech}</span>
                  ))}
                </div>
              )}
              {highlights.length === 0 && capabilities.length > 0 && (
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
      </main>
    </div>
  );
}
