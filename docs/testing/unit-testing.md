# Unit Testing Guide

## Philosophy

Unit tests verify the smallest testable pieces of code in isolation. For this project:

- **Components**: Test rendering, user interactions, and props
- **Hooks**: Test state changes, side effects, and return values
- **Utilities**: Test pure functions, formatters, and helpers
- **No external dependencies**: Mock Supabase, fetch, and browser APIs

---

## Setup

### Vitest Configuration

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

### Test Setup File

```ts
// tests/setup.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

---

## Component Testing Patterns

### 1. Basic Render Test

```tsx
// components/ui/button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Submit</Button>);
    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/destructive/);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Can't click</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### 2. Async Component (with Suspense)

```tsx
// components/hero-cta.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { describe, it, expect } from "vitest";
import HeroCTA from "./hero-cta";

describe("HeroCTA", () => {
  it("renders profile name after loading", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <HeroCTA
          profile={{ name: "John Doe", title: "Developer", bio: "I build things." }}
          social={{ github: "https://github.com/john" }}
          techStack={[{ category: "Frontend", items: ["React", "Next.js"] }]}
        />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("renders tech stack categories", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <HeroCTA
          profile={{ name: "John", title: "Dev", bio: "..." }}
          social={{}}
          techStack={[
            { category: "Frontend", items: ["React"] },
            { category: "Backend", items: ["Node.js"] },
          ]}
        />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText("Frontend")).toBeInTheDocument();
      expect(screen.getByText("Backend")).toBeInTheDocument();
    });
  });
});
```

### 3. Client Component with State

```tsx
// components/theme-toggle.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import ThemeToggle from "./theme-toggle";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.classList.remove("light");
  });

  it("renders toggle button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles theme on click", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    // After toggle, localStorage should be updated
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
```

### 4. Canvas/WebGL Component (skip DOM queries)

```tsx
// components/splash-cursor.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SplashCursor from "./splash-cursor";

// Canvas API is not available in happy-dom; mock it
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  })) as any;
});

describe("SplashCursor", () => {
  it("renders a canvas element", () => {
    const { container } = render(<SplashCursor />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<SplashCursor className="custom" />);
    const canvas = container.querySelector("canvas");
    expect(canvas?.className).toMatch(/custom/);
  });

  it("does not crash on resize", () => {
    const { unmount } = render(<SplashCursor />);
    window.dispatchEvent(new Event("resize"));
    unmount(); // cleanup should not throw
  });
});
```

---

## Hook Testing Patterns

```tsx
// lib/use-toast.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useToast } from "@/components/ui/use-toast";

describe("useToast", () => {
  it("returns toast function", () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.toast).toBe("function");
  });

  it("adds a toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Success", description: "Saved!" });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe("Success");
  });
});
```

---

## Utility Testing Patterns

```ts
// lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { cn, formatDate } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("filters falsy values", () => {
    expect(cn("base", false && "hidden", undefined, "extra")).toBe("base extra");
  });

  it("handles Tailwind conflicts (tailwind-merge)", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });
});

describe("formatDate", () => {
  it("formats ISO date to readable string", () => {
    const result = formatDate("2026-01-15T10:30:00Z");
    expect(result).toMatch(/2026/);
  });

  it("returns fallback for invalid date", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("not-a-date")).toBe("");
  });
});
```

---

## Supabase Mock Patterns (with MSW)

```ts
// tests/mocks/supabase.ts
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const supabaseHandlers = [
  http.get("https://*.supabase.co/rest/v1/portfolio_about", () => {
    return HttpResponse.json([
      {
        id: "mock-id",
        name: "Test User",
        title: "Software Engineer",
        bio: "A test bio",
        avatar_url: "https://example.com/avatar.jpg",
        skills: ["React", "TypeScript"],
        social_links: {},
      },
    ]);
  }),

  http.get("https://*.supabase.co/rest/v1/portfolio_projects", () => {
    return HttpResponse.json([
      {
        id: "proj-1",
        title: "Test Project",
        description: "A project",
        featured: true,
      },
    ]);
  }),
];

export const server = setupServer(...supabaseHandlers);
```

---

## Running Tests

```bash
# All unit tests
npx vitest run

# Watch mode (rerun on file change)
npx vitest

# Specific file
npx vitest run components/ui/button.test.tsx

# With coverage
npx vitest run --coverage

# Coverage thresholds in vitest.config.ts
```

**Coverage config:**

```ts
// vitest.config.ts (add to test config)
coverage: {
  provider: "v8",
  thresholds: {
    lines: 70,
    branches: 65,
    functions: 75,
    statements: 70,
  },
  exclude: [
    "node_modules/",
    "tests/",
    "**/*.test.*",
    "**/*.spec.*",
    "next-env.d.ts",
    "scripts/",
  ],
},
```

---

## Best Practices

1. **Query by role/text, not by test ID** — prefer `getByRole`, `getByLabelText`, `getByText`
2. **Test behavior, not implementation** — don't test state values directly; test what the user sees
3. **One assertion per test** (or closely related assertions) — keeps failures precise
4. **Avoid `data-testid`** unless no accessible query exists
5. **Mock at the network layer** with MSW rather than mocking modules
6. **Use `userEvent` over `fireEvent`** — simulates real user interactions
7. **Clean up in `afterEach`** — `cleanup()` unmounts rendered components
8. **Don't test third-party code** — test your integration with it, not the library itself
