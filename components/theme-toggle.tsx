"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isLight = document.documentElement.classList.contains("light");
    setLight(isLight);
    // Sync cookie in case it was set by localStorage but cookie expired
    document.cookie = `theme=${isLight ? "light" : "dark"}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
    document.cookie = `theme=${next ? "light" : "dark"}; path=/; max-age=31536000; SameSite=Lax`;
  };

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
    >
      {light ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}
