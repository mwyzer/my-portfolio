import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    await supabase.auth.getUser();
  } catch {
    // Refresh token is invalid or expired — clear auth cookies and continue
    const authCookieNames = request.cookies
      .getAll()
      .filter((c) => c.name.includes("sb-") && c.name.includes("auth-token"))
      .map((c) => c.name);

    authCookieNames.forEach((name) => {
      supabaseResponse.cookies.set(name, "", {
        maxAge: 0,
        path: "/",
      });
    });
  }

  return supabaseResponse;
}
