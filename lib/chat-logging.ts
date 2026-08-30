import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

// Hashed, never raw — chat_logs stores ip_hash so we can rate-limit-audit
// abuse patterns without retaining visitor IPs.
function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function logChatInteraction(entry: {
  question: string;
  answer: string;
  provider: string;
  ip: string;
}): Promise<void> {
  if (process.env.CHAT_LOGGING !== "1") return;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.warn("[agent] CHAT_LOGGING=1 but SUPABASE_SERVICE_ROLE_KEY is missing — skipping log");
    return;
  }

  try {
    // chat_logs has RLS enabled with no policies, so only the service role
    // key (which bypasses RLS) can write to it.
    const supabase = createClient(url, serviceKey);
    const { error } = await supabase.from("chat_logs").insert({
      question: entry.question,
      answer: entry.answer,
      provider: entry.provider,
      ip_hash: hashIp(entry.ip),
    });
    if (error) throw error;
  } catch (err) {
    console.error("[agent] failed to log chat interaction:", err);
  }
}
