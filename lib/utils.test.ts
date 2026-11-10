import { describe, it, expect } from "vitest";
import { cn, formatDate, slugify } from "@/lib/utils";

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
