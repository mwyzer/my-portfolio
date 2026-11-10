import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import type { BlogPost } from "@/types/database";
import ThemeToggle from "@/components/theme-toggle";
import { markdownToSafeHtml, sanitizeUrl } from "@/lib/sanitize";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single<Pick<BlogPost, "title" | "excerpt">>();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || "",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single<BlogPost>();

  if (!post) notFound();

  // Markdown to HTML — escapes raw HTML and validates link schemes so
  // dangerouslySetInnerHTML below can't be used to inject scripts. See lib/sanitize.ts.
  const htmlContent = markdownToSafeHtml(post.content);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg text-text hover:text-accent transition-colors">Portfolio</Link>
          <div className="flex items-center gap-1">
            <Link href="/" className="btn-noir btn-noir-ghost btn-noir-sm">Home</Link>
            <Link href="/blog" className="btn-noir btn-noir-ghost btn-noir-sm">Blog</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <article>
          <Link href="/blog" className="btn-noir btn-noir-ghost btn-noir-sm mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>

          <header className="mb-8">
            <h1 className="text-4xl font-bold text-text">{post.title}</h1>
            <div className="mt-3 flex items-center gap-4 text-sm text-text-dim">
              <time>{formatDate(post.created_at)}</time>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge-noir">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {sanitizeUrl(post.cover_image) && (
            <img
              src={sanitizeUrl(post.cover_image)}
              alt={post.title}
              className="mb-8 w-full rounded-lg object-cover max-h-96"
            />
          )}

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </main>
    </div>
  );
}
