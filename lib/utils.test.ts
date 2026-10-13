import { describe, it, expect } from "vitest";
import { cn, formatDate, slugify, cycleXPattern } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("filters falsy values", () => {
    expect(cn("base", false && "hidden", undefined, "extra")).toBe("base extra");
  });

  it("handles Tailwind conflicts via tailwind-merge", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("merges conditional classes", () => {
    const isActive = true;
    expect(cn("base", isActive && "active")).toBe("base active");
  });
});

describe("formatDate", () => {
  it("formats ISO date string to readable format", () => {
    const result = formatDate("2026-01-15T10:30:00Z");
    expect(result).toContain("2026");
    expect(result).toContain("January");
    expect(result).toContain("15");
  });

  it("handles date-only strings", () => {
    const result = formatDate("2026-07-01");
    expect(result).toContain("July");
    expect(result).toContain("2026");
  });

  it("throws RangeError for bad input", () => {
    expect(() => formatDate("not-a-date")).toThrow(RangeError);
  });
});

describe("slugify", () => {
  it("converts text to URL-safe slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple dashes and spaces", () => {
    expect(slugify("foo   bar--baz")).toBe("foo-bar-baz");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugify("--hello--")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("cycleXPattern", () => {
  it("returns the value at the given index for a pattern longer than the index", () => {
    expect(cycleXPattern([-40, 0, 40], 0)).toBe(-40);
    expect(cycleXPattern([-40, 0, 40], 1)).toBe(0);
    expect(cycleXPattern([-40, 0, 40], 2)).toBe(40);
  });

  it("wraps around once the index exceeds the pattern length", () => {
    expect(cycleXPattern([-40, 0, 40], 3)).toBe(-40);
    expect(cycleXPattern([-40, 0, 40], 4)).toBe(0);
    expect(cycleXPattern([-40, 0, 40], 5)).toBe(40);
  });

  it("always returns the single entry for a one-element pattern", () => {
    expect(cycleXPattern([25], 0)).toBe(25);
    expect(cycleXPattern([25], 7)).toBe(25);
  });

  it("returns 0 for an empty pattern instead of throwing", () => {
    expect(cycleXPattern([], 0)).toBe(0);
    expect(cycleXPattern([], 3)).toBe(0);
  });

  it("supports a 2-entry pattern for a left/right-only grid", () => {
    expect(cycleXPattern([-40, 40], 0)).toBe(-40);
    expect(cycleXPattern([-40, 40], 1)).toBe(40);
    expect(cycleXPattern([-40, 40], 2)).toBe(-40);
  });
});
