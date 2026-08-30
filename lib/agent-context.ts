import { createServerSupabaseClient } from "@/lib/supabase-server";
import { readDataJson } from "@/lib/extract-pdfs";

const CACHE_TTL_MS = 60 * 60 * 1000;

let cachedContext: string | null = null;
let cachedAt = 0;

async function fetchProfileContext(): Promise<string> {
  const sections: string[] = [];

  // ── PRIMARY: Structured data.json (parsed into clean markdown) ──
  try {
    const jsonContext = readDataJson({ includePrivate: false });
    if (jsonContext) {
      sections.push(jsonContext);
    }
  } catch (err) {
    console.error("Failed to read data.json:", err);
  }

  // ── SECONDARY: Blog posts from Supabase (live data) ──
  try {
    const supabase = await createServerSupabaseClient();

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("title, excerpt, tags, slug")
      .eq("published", true);

    if (posts && posts.length > 0) {
      const postList = posts
        .map(
          (p) =>
            `- **${p.title}**: ${p.excerpt || ""}\n  Tags: ${(p.tags || []).join(", ")}\n  Link: /blog/${p.slug}`
        )
        .join("\n\n");
      sections.push(`## Blog Posts\n${postList}`);
    }
  } catch (err) {
    console.error("Failed to build DB profile context:", err);
  }

  return sections.length > 0
    ? sections.join("\n\n---\n\n")
    : "Profile data temporarily unavailable.";
}

// Cached per warm function instance — avoids hitting Supabase on every chat
// message. Not shared across instances, but the content changes rarely
// enough (data.json edits, blog publishes) that this trades staleness for
// far fewer DB round trips.
export async function getProfileContext(): Promise<string> {
  const now = Date.now();
  if (cachedContext !== null && now - cachedAt < CACHE_TTL_MS) {
    return cachedContext;
  }
  const context = await fetchProfileContext();
  cachedContext = context;
  cachedAt = now;
  return context;
}

export function invalidateProfileContext(): void {
  cachedContext = null;
  cachedAt = 0;
}
