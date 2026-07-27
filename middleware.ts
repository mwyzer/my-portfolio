import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
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
