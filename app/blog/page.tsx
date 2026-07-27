import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/database";
import ThemeToggle from "@/components/theme-toggle";

export const metadata = {
  title: "Blog",
  description: "Read my latest blog posts",
};

export default async function BlogPage() {
  const supabase = await createServerSupabaseClient();

  const { data: posts } = await (supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false }) as unknown as Promise<{ data: BlogPost[] | null; error: any }>);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg text-text hover:text-accent transition-colors">Portfolio</Link>
          <div className="flex items-center gap-1">
            <Link href="/" className="btn-noir btn-noir-ghost btn-noir-sm">Home</Link>
            <Link href="/blog" className="btn-noir btn-noir-sm" style={{ background: "var(--color-accent)", color: "#fff", borderColor: "var(--color-accent)" }}>Blog</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="mb-2 text-4xl font-bold text-text">Blog</h1>
        <p className="mb-10 text-text-muted">
          Thoughts, tutorials, and insights
        </p>

        {posts && posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="card-noir h-full group-hover:border-accent transition-colors">
                  <h3 className="font-semibold text-text text-lg mb-2 group-hover:text-accent transition-colors">{post.title}</h3>
                  <p className="text-xs text-text-dim mb-3">
                    {formatDate(post.created_at)}
                  </p>
                  <p className="text-sm text-text-muted line-clamp-3 mb-3">
                    {post.excerpt}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="badge-noir">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-text-muted">No posts published yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
