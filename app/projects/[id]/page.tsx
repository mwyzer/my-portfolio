import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Youtube, Layout, Database, Sparkles, Rocket } from "lucide-react";
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

      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/projects" className="btn-noir btn-noir-ghost btn-noir-sm mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-3">{project.title}</h1>
          <p className="text-text-muted leading-relaxed">{project.description}</p>

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

            {caseStudy.architecture && (
              <section>
                <h2 className="text-xl font-bold text-text mb-3">Architecture Solution</h2>
                <p className="text-text-muted leading-relaxed whitespace-pre-line">{caseStudy.architecture}</p>
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
          </div>
        ) : (
          <p className="text-text-dim text-sm border-t pt-8" style={{ borderColor: "var(--border)" }}>
            No case study details have been added for this project yet.
          </p>
        )}
      </article>
    </div>
  );
}
