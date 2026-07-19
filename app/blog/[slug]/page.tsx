import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import type { BlogPost } from "@/types/database";
import ThemeToggle from "@/components/theme-toggle";

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

  // Simple Markdown to HTML conversion (basic)
  const htmlContent = post.content
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[a-z])/gm, "")
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith("<")) return match;
      return `<p>${match}</p>`;
    });

  return (
    <div className="min-h-screen">
      <div className="navbar bg-base-100 border-b sticky top-0 z-50 backdrop-blur">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl">Portfolio</Link>
        </div>
        <div className="navbar-end gap-1">
          <Link href="/" className="btn btn-ghost btn-sm">Home</Link>
          <Link href="/blog" className="btn btn-ghost btn-sm">Blog</Link>
          <ThemeToggle />
        </div>
      </div>

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/blog" className="btn btn-ghost btn-sm mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm opacity-70">
            <time>{formatDate(post.created_at)}</time>
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="badge badge-sm">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </header>

        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="mb-8 w-full rounded-box object-cover max-h-96"
          />
        )}

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  );
}
