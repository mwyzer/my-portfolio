import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SplashCursorDeferred from "@/components/deferred/splash-cursor-deferred";
import ChatWidgetDeferred from "@/components/deferred/chat-widget-deferred";
import AnalyticsDeferred from "@/components/deferred/analytics-deferred";

export const metadata: Metadata = {
  title: {
    default: "My Portfolio",
    template: "%s | My Portfolio",
  },
  description: "Personal portfolio and blog",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const themeClass = themeCookie === "light" ? "light" : "";

  return (
    <html lang="en" className={themeClass} suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase — API + Storage images.
            SUPABASE_URL is inlined at build time by Next.js (NEXT_PUBLIC_*).
            Hardcoded as a secondary fallback so these ALWAYS render. */}
        <link rel="preconnect" href="https://zocyqljjolsamywllnml.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://zocyqljjolsamywllnml.supabase.co" />
        {/* FOUC prevention: sync theme from localStorage on first paint.
            The className is already set server-side via cookie (`themeClass`),
            but localStorage may have a different preference for new visitors
            without a cookie. This runs before React hydrates so no flash. */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(){
              try {
                var ls = localStorage.getItem('theme');
                if (ls === 'light' && !document.cookie.includes('theme=light')) {
                  document.documentElement.classList.add('light');
                }
              } catch(e){}
            })();
          `,
        }} />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
        <SplashCursorDeferred />
        <ChatWidgetDeferred />
        <Toaster />
        <AnalyticsDeferred />
      </body>
    </html>
  );
}
