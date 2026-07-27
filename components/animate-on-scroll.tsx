"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimateOnScrollProps {
  children: ReactNode;
  /** CSS selector for child elements to stagger (default: direct children) */
  staggerSelector?: string;
  /** Stagger delay between children in seconds */
  stagger?: number;
  /** Y offset to fade up from (px) */
  y?: number;
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
}

export default function AnimateOnScroll({
  children,
  staggerSelector,
  stagger = 0.08,
  y = 30,
  duration = 0.7,
  delay = 0,
  ease = "power3.out",
  triggerStart = "top 85%",
  className = "",
  as: Tag = "div",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = staggerSelector
      ? el.querySelectorAll(staggerSelector)
      : el.children;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
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

    return () => ctx.revert();
  }, [staggerSelector, stagger, y, duration, delay, ease, triggerStart]);

  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
