import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Single-owner site — see supabase/migrations/00004_restrict_writes_to_owner.sql
// for the matching RLS policies. This is the real gate for /dashboard: without
// it, protected pages only redirect client-side after already rendering (see
// app/dashboard/layout.tsx), which lets a Server Component subpage's initial
// SSR fetch run before an unauthenticated visitor is ever kicked out.
const OWNER_EMAIL = "muhammad.wyzer@gmail.com";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.email !== OWNER_EMAIL) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Only run middleware on protected routes.
     * This avoids the ~50-150ms Supabase getUser() call on public pages
     * (homepage, blog, etc.) which was causing unnecessary latency.
     */
    "/dashboard/:path*",
    "/api/agent/:path*",
    "/api/settings/:path*",
  ],
};
