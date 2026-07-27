import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase — API + Storage images.
            SUPABASE_URL is inlined at build time by Next.js (NEXT_PUBLIC_*).
            Hardcoded as a secondary fallback so these ALWAYS render. */}
        <link rel="preconnect" href="https://zocyqljjolsamywllnml.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://zocyqljjolsamywllnml.supabase.co" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                }
              } catch(e) {}
            })();
          `,
        }} />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <SplashCursorDeferred />
        <ChatWidgetDeferred />
        <Toaster />
        <AnalyticsDeferred />
      </body>
    </html>
  );
}
