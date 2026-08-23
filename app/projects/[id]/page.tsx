import { notFound } from "next/navigation";
import { after } from "next/server";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Youtube, Layout, Database, Sparkles, Rocket, CheckCircle2, UserCircle2, Eye } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { PortfolioProject, CaseStudy } from "@/types/database";
import ThemeToggle from "@/components/theme-toggle";
import { sanitizeUrl } from "@/lib/sanitize";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

const CAPABILITY_GROUPS: { key: keyof CaseStudy["capabilities"]; label: string; icon: typeof Layout }[] = [
  { key: "fullStackEngineering", label: "Full Stack Engineering", icon: Layout },
  { key: "backendData", label: "Backend & Data", icon: Database },
  { key: "aiEngineering", label: "AI Engineering", icon: Sparkles },
  { key: "deliveryQuality", label: "Delivery & Quality", icon: Rocket },
];

export async function generateMetadata({ params }: ProjectPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: project } = await supabase
    .from("portfolio_projects")
    .select("title, description")
    .eq("id", id)
    .single<Pick<PortfolioProject, "title" | "description">>();

  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: project } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("id", id)
    .single<PortfolioProject>();

  if (!project) notFound();

  // Fire after the response is sent so the view-count write never delays render.
  after(() => supabase.rpc("increment_project_views", { project_id: project.id }));

  const caseStudy = project.case_study as CaseStudy | null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg text-text hover:text-accent transition-colors">Portfolio</Link>
          <div className="flex items-center gap-1">
            <Link href="/" className="btn-noir btn-noir-ghost btn-noir-sm">Home</Link>
            <Link href="/projects" className="btn-noir btn-noir-ghost btn-noir-sm">Projects</Link>
            <Link href="/blog" className="btn-noir btn-noir-ghost btn-noir-sm">Blog</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main>
      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/projects" className="btn-noir btn-noir-ghost btn-noir-sm mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>

        <header className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-3">
            {project.category ? (
              <span className="badge-noir capitalize">{project.category}</span>
            ) : <span />}
            {project.views > 0 && (
              <span className="flex items-center gap-1 text-xs text-text-dim">
                <Eye className="h-3.5 w-3.5" /> {project.views.toLocaleString()} views
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-text mb-1">{project.title}</h1>
          {project.subtitle && (
            <p className="text-lg text-text-dim mb-3">{project.subtitle}</p>
          )}
          <p className="text-text-muted leading-relaxed mt-3">{project.description}</p>

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.technologies.map((tech, i) => (
                <span key={`${tech}-${i}`} className="badge-noir">{tech}</span>
              ))}
            </div>
          )}

          {(sanitizeUrl(project.live_url) || sanitizeUrl(project.github_url) || sanitizeUrl(project.youtube_url)) && (
            <div className="flex gap-2 mt-6">
              {sanitizeUrl(project.live_url) && (
                <a href={sanitizeUrl(project.live_url)} target="_blank" rel="noreferrer" className="btn-noir btn-noir-primary btn-noir-sm">
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
        </header>

        {caseStudy ? (
          <div className="space-y-10 border-t pt-10" style={{ borderColor: "var(--border)" }}>
            {caseStudy.problem && (
              <section>
                <h2 className="text-xl font-bold text-text mb-3">Problem</h2>
                <p className="text-text-muted leading-relaxed whitespace-pre-line">{caseStudy.problem}</p>
              </section>
            )}

            {caseStudy.solution && (
              <section>
                <h2 className="text-xl font-bold text-text mb-3">Solution</h2>
                <p className="text-text-muted leading-relaxed whitespace-pre-line">{caseStudy.solution}</p>
              </section>
            )}

            {caseStudy.highlights && caseStudy.highlights.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-text mb-3">What I Built</h2>
                <ul className="space-y-2">
                  {caseStudy.highlights.map((item, i) => (
                    <li key={`${item}-${i}`} className="flex items-start gap-2 text-text-muted">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(sanitizeUrl(caseStudy.architecture) || caseStudy.architectureDiagram) && (
              <section>
                <h2 className="text-xl font-bold text-text mb-3">Architecture</h2>
                {caseStudy.architectureDiagram && (
                  <pre className="card-noir overflow-x-auto whitespace-pre font-mono text-xs text-text-muted leading-relaxed">
                    {caseStudy.architectureDiagram}
                  </pre>
                )}
                {sanitizeUrl(caseStudy.architecture) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sanitizeUrl(caseStudy.architecture)}
                    alt="Architecture diagram"
                    className={`w-full rounded-lg border ${caseStudy.architectureDiagram ? "mt-4" : ""}`}
                    style={{ borderColor: "var(--border)" }}
                  />
                )}
              </section>
            )}

            {caseStudy.images && caseStudy.images.filter((url) => sanitizeUrl(url)).length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-text mb-3">Gallery</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {caseStudy.images.filter((url) => sanitizeUrl(url)).map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${url}-${i}`}
                      src={sanitizeUrl(url)}
                      alt={`${project.title} screenshot ${i + 1}`}
                      className="w-full rounded-lg border"
                      style={{ borderColor: "var(--border)" }}
                    />
                  ))}
                </div>
              </section>
            )}

            {caseStudy.capabilities && CAPABILITY_GROUPS.some((g) => caseStudy.capabilities[g.key]?.length > 0) && (
              <section>
                <h2 className="text-xl font-bold text-text mb-4">Capabilities</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {CAPABILITY_GROUPS.filter((g) => caseStudy.capabilities[g.key]?.length > 0).map((g) => {
                    const Icon = g.icon;
                    return (
                      <div key={g.key} className="card-noir">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="h-5 w-5 text-accent" />
                          <h3 className="font-semibold text-text text-sm">{g.label}</h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {caseStudy.capabilities[g.key].map((item, i) => (
                            <span key={`${item}-${i}`} className="badge-noir">{item}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {caseStudy.engineeringDecisions && caseStudy.engineeringDecisions.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-text mb-3">Engineering Decisions</h2>
                <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-text-dim" style={{ borderColor: "var(--border)" }}>
                        <th className="px-4 py-2.5 font-medium">Problem</th>
                        <th className="px-4 py-2.5 font-medium">Decision</th>
                        <th className="px-4 py-2.5 font-medium">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {caseStudy.engineeringDecisions.map((d, i) => (
                        <tr key={i} className={i > 0 ? "border-t" : ""} style={{ borderColor: "var(--border)" }}>
                          <td className="px-4 py-2.5 text-text-muted">{d.problem}</td>
                          <td className="px-4 py-2.5 text-text font-medium">{d.decision}</td>
                          <td className="px-4 py-2.5 text-text-muted">{d.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {caseStudy.contribution && caseStudy.contribution.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-text mb-3">My Contribution</h2>
                <ul className="space-y-2">
                  {caseStudy.contribution.map((item, i) => (
                    <li key={`${item}-${i}`} className="flex items-start gap-2 text-text-muted">
                      <UserCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {caseStudy.metrics && caseStudy.metrics.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-text mb-3">Results</h2>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.metrics.map((item, i) => (
                    <span
                      key={`${item}-${i}`}
                      className="badge-noir"
                      style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <p className="text-text-dim text-sm border-t pt-8" style={{ borderColor: "var(--border)" }}>
            No case study details have been added for this project yet.
          </p>
        )}
      </article>
      </main>
    </div>
  );
}
