// In-memory sliding-window rate limiter, scoped per Vercel function instance
// (not shared across instances/regions). Good enough to blunt casual abuse;
// swap the body of checkRateLimit() for @upstash/ratelimit if a global limit
// is ever needed — the call signature below is designed to stay the same.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

const hits = new Map<string, number[]>();
let lastSweep = Date.now();

// Drops entries with no timestamps left in the window so the map doesn't
// grow unbounded over the life of a warm function instance.
function sweep(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  const windowStart = now - WINDOW_MS;
  for (const [key, timestamps] of hits) {
    const fresh = timestamps.filter((t) => t > windowStart);
    if (fresh.length === 0) hits.delete(key);
    else hits.set(key, fresh);
  }
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  sweep(now);

  const windowStart = now - WINDOW_MS;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    const retryAfterSeconds = Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true, retryAfterSeconds: 0 };
}
