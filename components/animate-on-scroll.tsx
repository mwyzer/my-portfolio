"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";

// GSAP + ScrollTrigger are deferred to first idle callback. They're ~400 KiB
// combined and only needed for scroll animations in below-fold sections —
// wasteful on the critical path, so the import itself (not just its usage)
// waits until the browser has spare cycles after hydration.
function scheduleIdle(cb: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(cb, { timeout: 2000 });
  } else {
    setTimeout(cb, 200);
  }
}

let gsapPromise: Promise<typeof import("gsap")> | null = null;
function getGsap() {
  if (!gsapPromise) {
    gsapPromise = new Promise((resolve) => {
      scheduleIdle(() => {
        import("gsap").then(async (m) => {
          const { ScrollTrigger } = await import("gsap/ScrollTrigger");
          m.default.registerPlugin(ScrollTrigger);
          resolve(m);
        });
      });
    });
  }
  return gsapPromise;
}

// Above-the-fold content (e.g. the hero) is already in the viewport on load,
// so it can't rely on ScrollTrigger (which needs a scroll to fire) and can't
// afford the idle-callback wait either — that risks a visible "pop in fully
// styled, then reset and animate" flash. This loader skips both: no idle
// wait, no ScrollTrigger chunk, just gsap's core fetched as soon as the
// component mounts.
let gsapImmediatePromise: Promise<typeof import("gsap")> | null = null;
function getGsapImmediate() {
  if (!gsapImmediatePromise) {
    gsapImmediatePromise = import("gsap");
  }
  return gsapImmediatePromise;
}

interface AnimateOnScrollProps {
  children: ReactNode;
  /** CSS selector for child elements to stagger (default: direct children) */
  staggerSelector?: string;
  /** Stagger delay between children in seconds */
  stagger?: number;
  /** Y offset to fade up from (px) */
  y?: number;
  /** X offset to fly in from (px), applied to every target the same way. */
  x?: number;
  /**
   * Per-target X offset (px), cycling by index — e.g. `[-40, 0, 40]` makes
   * the first target fly in from the left, the last from the right, and
   * anything in between just fades up. Takes priority over `x` when set.
   * A plain array (not a function) so it stays serializable across the
   * Server → Client Component boundary — this component is always
   * rendered from a Server Component with plain props, never a closure.
   */
  xPattern?: number[];
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Ease function */
  ease?: string;
  /** When the top of the element hits this % of viewport height, trigger */
  triggerStart?: string;
  /** Extra className for the wrapper */
  className?: string;
  /** HTML tag for the wrapper */
  as?: ElementType;
  /**
   * Play immediately on mount instead of waiting for scroll-into-view.
   * Use this for above-the-fold content (e.g. the hero) where
   * ScrollTrigger would never reliably fire.
   */
  immediate?: boolean;
}

export default function AnimateOnScroll({
  children,
  staggerSelector,
  stagger = 0.08,
  y = 30,
  x = 0,
  xPattern,
  duration = 0.7,
  delay = 0,
  ease = "power3.out",
  triggerStart = "top 85%",
  className = "",
  as: Tag = "div",
  immediate = false,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;

    (immediate ? getGsapImmediate() : getGsap()).then((gsap) => {
      if (cancelled || !el) return;

      const targets = staggerSelector
        ? el.querySelectorAll(staggerSelector)
        : el.children;

      // Built here, client-side, from the serializable `xPattern` array —
      // GSAP's own function-based-value convention (index, target, targets),
      // but never passed in as a function prop from the Server Component.
      const fromX = xPattern
        ? (i: number) => xPattern[i % xPattern.length]
        : x;

      const ctx = gsap.default.context(() => {
        gsap.default.fromTo(
          targets,
          { y, x: fromX, opacity: 0 },
          immediate
            ? { y: 0, x: 0, opacity: 1, duration, delay, stagger, ease }
            : {
                y: 0,
                x: 0,
                opacity: 1,
                duration,
                delay,
                stagger,
                ease,
                scrollTrigger: {
                  trigger: el,
                  start: triggerStart,
                  toggleActions: "play none none none",
                },
              }
        );
      }, el);

      // Can't clean up properly after async, but GSAP's ctx handles it
    });

    return () => {
      cancelled = true;
    };
  }, [staggerSelector, stagger, y, x, xPattern, duration, delay, ease, triggerStart, immediate]);

  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
