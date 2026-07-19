import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import { ArrowRight, ExternalLink, Github, Linkedin, Gitlab, Mail, Phone } from "lucide-react";
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
      {projects && projects.length > 0 && (
        <section id="projects" className="py-16 bg-base-200">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {projects.map((project) => (
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
      )}

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
