import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";
import ChatWidget from "@/components/chat/chat-widget";
import SplashCursor from "@/components/splash-cursor";

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
        <SplashCursor />
        <ChatWidget />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
