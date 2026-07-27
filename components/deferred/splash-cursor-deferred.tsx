"use client";

import dynamic from "next/dynamic";

const SplashCursor = dynamic(() => import("@/components/splash-cursor"), {
  ssr: false,
});

export default function SplashCursorDeferred() {
  return <SplashCursor />;
}
