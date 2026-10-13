import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface InlineBadge {
  label: string;
  /** Render with the accent border/text treatment (used for capabilities) */
  accent: boolean;
}

/**
 * Combines a project's capabilities + technologies into a single capped
 * badge row, prioritizing capabilities (the differentiators) over raw
 * tech-stack names, with a "+N more" remainder — used to keep project
 * cards from stacking multiple separate badge rows.
 */
export function buildInlineBadges(
  capabilities: string[] = [],
  technologies: string[] = [],
  max = 5
): { shown: InlineBadge[]; remaining: number } {
  const combined: InlineBadge[] = [
    ...capabilities.map((label) => ({ label, accent: true })),
    ...technologies.map((label) => ({ label, accent: false })),
  ];
  const shown = combined.slice(0, max);
  return { shown, remaining: Math.max(0, combined.length - shown.length) };
}

/**
 * Resolves a per-index X offset (px) from a cycling pattern — e.g. pattern
 * `[-40, 0, 40]` gives index 0 => -40, 1 => 0, 2 => 40, 3 => -40 again.
 * Backs AnimateOnScroll's `xPattern` prop, which exists specifically so a
 * Server Component can request per-card left/right fly-in with a plain
 * serializable array instead of a function prop (functions can't cross the
 * Server -> Client Component boundary — see animate-on-scroll.tsx).
 */
export function cycleXPattern(pattern: number[], index: number): number {
  if (pattern.length === 0) return 0;
  return pattern[index % pattern.length];
}
