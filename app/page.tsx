import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import { ArrowRight, ExternalLink, Github, Linkedin, Gitlab, Mail, Phone, Code2, Database, Palette, Rocket } from "lucide-react";
import type { PortfolioAbout, PortfolioProject, BlogPost } from "@/types/database";
import ThemeToggle from "@/components/theme-toggle";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await (supabase
    .from("portfolio_about")
    .select("*")
    .single() as unknown as Promise<{ data: PortfolioAbout | null; error: any }>);

  const { data: projects } = await (supabase
    .from("portfolio_projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("order", { ascending: true })
    .limit(6) as unknown as Promise<{ data: PortfolioProject[] | null; error: any }>);

  const { data: posts } = await (supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3) as unknown as Promise<{ data: BlogPost[] | null; error: any }>);

  const social = (profile?.social_links as Record<string, string> | null) ?? {};
  const educationEntries = social?.education?.split("\n\n").filter(Boolean) ?? [];
  const certEntries = social?.certifications?.split("\n\n").filter(Boolean) ?? [];
  const experienceEntries = social?.experience?.split("\n\n").filter(Boolean) ?? [];

  return (
    <div className="min-h-screen">
      {/* Navigation — DaisyUI navbar */}
      <div className="navbar bg-base-100 border-b sticky top-0 z-50 backdrop-blur">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl">
            {profile?.avatar_url ? (
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img src={profile.avatar_url} alt="Logo" />
                </div>
              </div>
            ) : null}
            {profile?.name || "Portfolio"}
          </Link>
        </div>
        <div className="navbar-end gap-1">
          <Link href="/#projects" className="btn btn-ghost btn-sm">Projects</Link>
          <Link href="/blog" className="btn btn-ghost btn-sm">Blog</Link>
          {profile?.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">Resume</a>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Hero Section — DaisyUI hero */}
      <div className="hero bg-base-200 py-20">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            {profile?.avatar_url && (
              <div className="avatar mb-8">
                <div className="w-32 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img src={profile.avatar_url} alt={profile.name || "Avatar"} />
                </div>
              </div>
            )}
            <h1 className="text-5xl font-bold">{profile?.name || "Welcome"}</h1>
            <p className="py-4 text-xl opacity-70">{profile?.title || ""}</p>
            <p className="opacity-70">{profile?.bio || ""}</p>

            {/* Skills — DaisyUI badges */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 py-6">
                {profile.skills.map((skill) => (
                  <span key={skill} className="badge badge-outline">{skill}</span>
                ))}
              </div>
            )}

            {/* Social Links — DaisyUI buttons */}
            {social && (
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {social.email && (
                  <a href={`mailto:${social.email}`} className="btn btn-ghost btn-sm">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                )}
                {social.phone && (
                  <a href={`https://wa.me/${social.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                    <Phone className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                {social.github && (
                  <a href={social.github} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                )}
                {social.gitlab && (
                  <a href={social.gitlab} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                    <Gitlab className="h-4 w-4" /> GitLab
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack Section — DaisyUI cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">Tech Stack</h2>
          <p className="text-center text-sm opacity-60 mb-10">Tools &amp; technologies I use across my projects</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Core */}
            <div className="card bg-base-100 border shadow-sm">
              <div className="card-body p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Core</h3>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span className="text-sm">Next.js 15</span>
                  <span className="text-sm">Nuxt 4</span>
                  <span className="text-sm">React 18/19</span>
                  <span className="text-sm">Vue 3</span>
                  <span className="text-sm">TypeScript</span>
                  <span className="text-sm">ASP.NET Core</span>
                  <span className="text-sm">Pinia</span>
                </div>
              </div>
            </div>
            {/* Styling & UI */}
            <div className="card bg-base-100 border shadow-sm">
              <div className="card-body p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="h-5 w-5 text-secondary" />
                  <h3 className="font-semibold">Styling &amp; UI</h3>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span className="text-sm">Tailwind CSS</span>
                  <span className="text-sm">DaisyUI</span>
                  <span className="text-sm">shadcn/ui</span>
                  <span className="text-sm">Vuestic UI</span>
                  <span className="text-sm">Radix UI</span>
                  <span className="text-sm">Lucide Icons</span>
                  <span className="text-sm">Recharts</span>
                  <span className="text-sm">PWA</span>
                </div>
              </div>
            </div>
            {/* Backend & DB */}
            <div className="card bg-base-100 border shadow-sm">
              <div className="card-body p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold">Backend &amp; DB</h3>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span className="text-sm">Supabase</span>
                  <span className="text-sm">PostgreSQL</span>
                  <span className="text-sm">EF Core</span>
                  <span className="text-sm">pgvector</span>
                  <span className="text-sm">Nitro</span>
                  <span className="text-sm">SignalR</span>
                  <span className="text-sm">Docker</span>
                </div>
              </div>
            </div>
            {/* Build, Test & Tools */}
            <div className="card bg-base-100 border shadow-sm">
              <div className="card-body p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="h-5 w-5 text-info" />
                  <h3 className="font-semibold">Build, Test &amp; Tools</h3>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span className="text-sm">Vite</span>
                  <span className="text-sm">Vitest</span>
                  <span className="text-sm">Playwright</span>
                  <span className="text-sm">xUnit</span>
                  <span className="text-sm">React Hook Form</span>
                  <span className="text-sm">Zod</span>
                  <span className="text-sm">Zustand</span>
                  <span className="text-sm">TanStack Query</span>
                  <span className="text-sm">Axios</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <a href="https://github.com/mwyzer/vue-lms-mahasiswa" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
              <Github className="h-4 w-4" /> LMS Mahasiswa
            </a>
            <a href="https://nuxt-lms-mahasiswa.vercel.app" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
            <a href="https://github.com/mwyzer/portal-helpdesk" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
              <Github className="h-4 w-4" /> AI Helpdesk
            </a>
          </div>
        </div>
      </section>

      {/* Education Section — DaisyUI timeline */}
      {educationEntries.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Formal Education</h2>
            <ul className="timeline timeline-vertical">
              {educationEntries.map((entry, i) => {
                const lines = entry.split("\n").filter(Boolean);
                const institution = lines[0] || "";
                const period = lines[1] || "";
                const side = i % 2 === 0 ? "timeline-start" : "timeline-end";
                const altSide = i % 2 === 0 ? "timeline-end" : "timeline-start";
                return (
                  <li key={i}>
                    <hr />
                    <div className={side}>
                      <div className="card bg-base-100 border">
                        <div className="card-body p-4">
                          <h3 className="card-title text-base">{institution}</h3>
                          {period && <p className="text-sm opacity-70">{period}</p>}
                        </div>
                      </div>
                    </div>
                    <div className={altSide} />
                    <hr />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Certifications Section — DaisyUI timeline */}
      {certEntries.length > 0 && (
        <section className="py-16 bg-base-200">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Certifications &amp; Training</h2>
            <ul className="timeline timeline-vertical">
              {certEntries.map((entry, i) => {
                const [year, ...rest] = entry.split("\t").filter(Boolean);
                const desc = rest.join(" ");
                const side = i % 2 === 0 ? "timeline-start" : "timeline-end";
                const altSide = i % 2 === 0 ? "timeline-end" : "timeline-start";
                return (
                  <li key={i}>
                    <hr />
                    <div className={side}>
                      <div className="card bg-base-100 border">
                        <div className="card-body p-4">
                          <h3 className="card-title text-base">{desc}</h3>
                          {year && <p className="text-sm opacity-70">{year}</p>}
                        </div>
                      </div>
                    </div>
                    <div className={altSide} />
                    <hr />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Work Experience Section — DaisyUI timeline */}
      {experienceEntries.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Work Experience</h2>
            <ul className="timeline timeline-vertical">
              {experienceEntries.map((entry, i) => {
                const lines = entry.split("\n").filter(Boolean);
                const period = lines[0] || "";
                const role = lines[1] || "";
                const bullets = lines.slice(2).filter(l => l.startsWith("•") || l.startsWith("·") || l.startsWith("-"));
                const side = i % 2 === 0 ? "timeline-start" : "timeline-end";
                const altSide = i % 2 === 0 ? "timeline-end" : "timeline-start";
                return (
                  <li key={i}>
                    <hr />
                    <div className={side}>
                      <div className="card bg-base-100 border">
                        <div className="card-body p-4">
                          {period && <p className="text-sm opacity-70">{period}</p>}
                          {role && <h3 className="card-title text-base">{role}</h3>}
                          {bullets.length > 0 && (
                            <ul className="list-disc pl-5 text-sm opacity-70 space-y-1 mt-2">
                              {bullets.map((b, j) => (
                                <li key={j}>{b.replace(/^[•·-]\s*/, "")}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={altSide} />
                    <hr />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Projects Section — DaisyUI cards */}
      <section id="projects" className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* Static: LMS Mahasiswa */}
            <div className="card bg-base-100 shadow-sm border border-primary/20">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">📚</span>
                  <h3 className="card-title">LMS Mahasiswa</h3>
                </div>
                <p className="text-sm opacity-70">
                  Full-stack Learning Management System — multi-role (student, instructor, admin), attendance, assignments, quizzes, AI chat assistant, Python playground &amp; PWA support.
                </p>
                <div className="card-actions mt-3">
                  <span className="badge badge-sm">Nuxt 4</span>
                  <span className="badge badge-sm">Vue 3</span>
                  <span className="badge badge-sm">TypeScript</span>
                  <span className="badge badge-sm">Pinia</span>
                  <span className="badge badge-sm">Supabase</span>
                  <span className="badge badge-sm">Nitro</span>
                  <span className="badge badge-sm">Vite</span>
                  <span className="badge badge-sm">Vuestic UI</span>
                  <span className="badge badge-sm">PWA</span>
                  <span className="badge badge-sm">Vitest</span>
                  <span className="badge badge-sm">Playwright</span>
                </div>
                <div className="card-actions mt-3">
                  <a href="https://nuxt-lms-mahasiswa.vercel.app" target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost">
                    <ExternalLink className="h-4 w-4" /> Live
                  </a>
                  <a href="https://github.com/mwyzer/vue-lms-mahasiswa" target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost">
                    <Github className="h-4 w-4" /> Code
                  </a>
                </div>
              </div>
            </div>
            {/* Dynamic: Supabase projects */}
            {projects?.map((project) => (
              <div key={project.id} className="card bg-base-100 shadow-sm border">
                <div className="card-body">
                  <h3 className="card-title">{project.title}</h3>
                  <p className="text-sm opacity-70">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="card-actions mt-3">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="badge badge-sm">{tech}</span>
                      ))}
                    </div>
                  )}
                  {(project.live_url || project.github_url) && (
                    <div className="card-actions mt-3">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost">
                          <ExternalLink className="h-4 w-4" /> Live
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost">
                          <Github className="h-4 w-4" /> Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>
        </section>

      {/* Blog Section — DaisyUI cards */}
      {posts && posts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between max-w-5xl mx-auto mb-10">
              <h2 className="text-3xl font-bold">Latest Posts</h2>
              <Link href="/blog" className="btn btn-ghost btn-sm">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="card bg-base-100 shadow-sm border h-full hover:shadow-md transition-shadow">
                    <div className="card-body">
                      <h3 className="card-title text-lg">{post.title}</h3>
                      <p className="text-xs opacity-70">{formatDate(post.created_at)}</p>
                      <p className="text-sm opacity-70 line-clamp-3">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer — DaisyUI footer */}
      <footer className="footer footer-center bg-base-200 text-base-content p-10">
        <aside>
          <p>&copy; {new Date().getFullYear()} {profile?.name || "Portfolio"}. All rights reserved.</p>
        </aside>
      </footer>
    </div>
  );
}
