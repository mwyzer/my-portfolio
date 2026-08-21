import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

// Request-scoped: every call within a single request/render returns the
// same client instance instead of a fresh one. Without this, independent
// callers (e.g. HomePage + its Suspense-streamed HomeBelowFold, or
// generateMetadata + the page component, which Next.js can run concurrently)
// each read the same incoming cookies and, if the access token is expired,
// can each try to refresh with the same refresh token. Supabase rotates
// refresh tokens on use, so whichever call loses that race gets "Invalid
// Refresh Token: Refresh Token Not Found" — a single shared client avoids
// the race since concurrent refreshes on one GoTrueClient are serialized.
export const createServerSupabaseClient = cache(async () => {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );

  // Defense in depth: a dead/revoked refresh token makes getUser() throw
  // rather than resolve with an error. Postgrest's own internal session
  // resolution already tolerates this in practice (falls back to the anon
  // key), but that's undocumented library behavior, not a guarantee — so
  // resolve it explicitly once here (this factory is cache()'d, so it only
  // runs once per request either way) and clear the dead cookie so the
  // browser stops resending a token that's never going to work again.
  try {
    await supabase.auth.getUser();
  } catch {
    cookieStore
      .getAll()
      .filter((c) => c.name.includes("sb-") && c.name.includes("auth-token"))
      .forEach((c) => {
        try {
          cookieStore.set(c.name, "", { maxAge: 0, path: "/" });
        } catch {
          // Same Server Component restriction as setAll above.
        }
      });
  }

  return supabase;
});
