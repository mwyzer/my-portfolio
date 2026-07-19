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
    <div className="min-h-screen">
      {/* Navigation — DaisyUI navbar */}
      <div className="navbar bg-base-100 border-b sticky top-0 z-50 backdrop-blur">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl">Portfolio</Link>
        </div>
        <div className="navbar-end gap-1">
          <Link href="/" className="btn btn-ghost btn-sm">Home</Link>
          <Link href="/blog" className="btn btn-ghost btn-sm btn-active">Blog</Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-2 text-4xl font-bold">Blog</h1>
        <p className="mb-10 text-muted-foreground">
          Thoughts, tutorials, and insights
        </p>

        {posts && posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="card bg-base-100 shadow-sm border h-full hover:shadow-md transition-shadow">
                  <div className="card-body">
                    <h3 className="card-title text-lg">{post.title}</h3>
                    <p className="text-xs opacity-70">
                      {formatDate(post.created_at)}
                    </p>
                    <p className="text-sm opacity-70 line-clamp-3">
                      {post.excerpt}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="card-actions mt-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="badge badge-sm">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="opacity-70">No posts published yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
