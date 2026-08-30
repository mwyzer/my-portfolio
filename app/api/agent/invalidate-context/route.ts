import { createHash, timingSafeEqual } from "crypto";
import { invalidateProfileContext } from "@/lib/agent-context";

export const runtime = "nodejs";

// Constant-time comparison so the secret isn't leaked via timing. Both values
// are hashed to fixed-length buffers (which timingSafeEqual requires) before
// comparing.
function secureCompare(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

// Call this after publishing/editing a blog post or files/data.json so the
// chat agent's cached context (see lib/agent-context.ts) picks up the change
// within this request instead of waiting out the 1-hour TTL. Protected by a
// shared secret since it's unauthenticated by design (a CMS webhook, not a
// logged-in user).
export async function POST(req: Request) {
  const secret = process.env.AGENT_CACHE_INVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "Invalidation endpoint is not configured" }, { status: 503 });
  }

  const supplied = req.headers.get("x-invalidate-secret") ?? "";
  if (!secureCompare(supplied, secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  invalidateProfileContext();
  return Response.json({ invalidated: true });
}
