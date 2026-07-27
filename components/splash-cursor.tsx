"use client";

import { useEffect, useMemo, useRef } from "react";

interface SplashCursorProps {
  /** Color of the splash dots */
  color?: string;
  /** Size of each splash dot in px */
  dotSize?: number;
  /** Number of trailing dots */
  trailCount?: number;
  /** Opacity of the splash (0-1) */
  splashOpacity?: number;
  /** How fast the trail fades */
  fadeSpeed?: number;
  /** Blend mode for the canvas */
  blendMode?: string;
  /** Extra className for the canvas wrapper */
  className?: string;
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

/** Resolve a CSS custom property to its computed value. Called once, not per frame. */
function resolveCssVar(varExpr: string): string {
  if (typeof document === "undefined") return varExpr;
  const match = varExpr.match(/var\(([^,)]+)/);
  if (!match) return varExpr;
  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(match[1].trim())
    .trim();
  return resolved || varExpr;
}

/** Hex or rgb(a) string → rgba with given alpha. Pure computation, no DOM access. */
function colorWithAlpha(color: string, alpha: number): string {
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  if (color.startsWith("rgb")) {
    return color.replace(/rgb(a?)\(([^)]+)\)/, (_, a, vals) =>
      a ? `rgba(${vals})` : `rgba(${vals},${alpha})`
    );
  }
  return color;
}

export default function SplashCursor({
  color = "var(--color-accent, #6366f1)",
  dotSize = 4,
  trailCount = 12,
  splashOpacity = 0.6,
  fadeSpeed = 0.02,
  blendMode = "screen",
  className = "",
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);

  // Resolve CSS variable once — avoids getComputedStyle() in the animation loop
  const resolvedColor = useMemo(() => {
    if (color.startsWith("var(")) return resolveCssVar(color);
    return color;
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Spawn dots on mouse move
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;
        dotsRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 0.4 + Math.random() * 0.6,
        });
      }

      // Cap trails
      if (dotsRef.current.length > 300) {
        dotsRef.current = dotsRef.current.slice(-200);
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;

      const dots = dotsRef.current;

      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.life -= fadeSpeed + d.maxLife * 0.005;
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.98;
        d.vy *= 0.98;

        if (d.life <= 0) {
          dots.splice(i, 1);
          continue;
        }

        const alpha = d.life * splashOpacity;
        const size = dotSize * d.life;

        ctx.beginPath();
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fillStyle = colorWithAlpha(resolvedColor, alpha);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [resolvedColor, dotSize, splashOpacity, fadeSpeed, blendMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-50 ${className}`}
      aria-hidden="true"
    />
  );
}
