import { createServerSupabaseClient } from "@/lib/supabase-server";
import { readDataJson } from "@/lib/extract-pdfs";
import { streamText } from "ai";
import { deepseek } from "@ai-sdk/deepseek";

export const runtime = "nodejs";

// GET is required by DefaultChatTransport / useChat for initial connection
export async function GET() {
  return Response.json({ message: "Chat endpoint ready" });
}

async function buildProfileContext(): Promise<string> {
  const sections: string[] = [];

  // ── PRIMARY: Structured data.json (parsed into clean markdown) ──
  try {
    const jsonContext = readDataJson();
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawMessages = body.messages;

    if (!rawMessages || !Array.isArray(rawMessages)) {
      return Response.json({ error: "Messages array is required" }, { status: 400 });
    }

    // Convert UIMessage (parts[]) → CoreMessage (content string) for streamText
    const coreMessages = rawMessages.map((msg: any) => ({
      role: msg.role,
      content:
        typeof msg.content === "string"
          ? msg.content
          : Array.isArray(msg.parts)
            ? msg.parts
                .filter((p: any) => p.type === "text")
                .map((p: any) => p.text ?? "")
                .join("")
            : "",
    }));

    const context = await buildProfileContext();
    console.log("[agent] context length:", context.length, "messages:", coreMessages.length);

    const systemPrompt = `You are **Wyzer's AI Secretary** — a friendly, professional chatbot embedded on Muhammad Wyzer's personal portfolio website. Your job is to answer visitor questions about Wyzer's background, skills, work experience, education, certifications, projects, blog posts, and CV/resume details.

## How to Respond
- Be concise, warm, and helpful. Use a casual but professional tone.
- **Jawab dalam bahasa Indonesia** jika user bertanya dalam bahasa Indonesia. Otherwise respond in English.
- Answer ONLY based on the profile context below. **Never fabricate information.**
- **Jika jawaban TIDAK ada di Profile Context, katakan: "Maaf, saya belum punya informasi itu. Silakan tanya langsung ke Wyzer ya!"**
- If asked in English and the answer isn't available, say: "Sorry, I don't have that information yet — try asking Wyzer directly!"
- For project/tech questions, mention specific technologies and provide live/GitHub links when available.
- For blog posts, mention the title, tags, and link to /blog/[slug].
- If someone asks about contact info, share the details from the Personal Information section or direct them to the social links on the home page.
- The structured sections (Personal Information, Work Experience, Skills, etc.) are your **primary source** — use them first.
- Keep responses under 4 paragraphs unless the user asks for detail.
- If greeted, introduce yourself briefly and invite questions.

## Profile Context
${context}`;

    const result = streamText({
      model: deepseek("deepseek-v4-flash"),
      system: systemPrompt,
      messages: coreMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[agent] POST error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
