# Integration Testing Guide

## Philosophy

Integration tests verify that multiple units work together correctly. For this project, the key integrations are:

- **API Routes** — Next.js Route Handlers with Supabase
- **Auth Flow** — Login, callback, session, sign-out
- **Supabase Queries** — Server-side data fetching with RLS
- **Middleware** — Route protection and session refresh

---

## API Route Testing

### Test Setup

```ts
// tests/integration/api/setup.ts
import { createServerClient } from "@supabase/ssr";
import { createMocks } from "node-mocks-http";
import type { NextRequest } from "next/server";

/**
 * Creates a mock NextRequest for API route testing.
 */
export function mockApiRequest({
  method = "GET",
  url = "http://localhost:3000/api/test",
  body,
  headers = {},
}: {
  method?: string;
  url?: string;
  body?: unknown;
  headers?: Record<string, string>;
} = {}) {
  const { req, res } = createMocks({ method, url, headers });

  const nextReq = new NextRequest(url, {
    method,
    headers: new Headers(headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  return nextReq;
}
```

### Agent Chat API

```ts
// tests/integration/api/agent-chat.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/agent/chat/route";
import { mockApiRequest } from "./setup";

// Mock Supabase
vi.mock("@/lib/supabase-server", () => ({
  createServerSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        data: [{ id: "1", name: "Test User", bio: "A developer" }],
        error: null,
      })),
    })),
  })),
}));

describe("POST /api/agent/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when messages array is empty", async () => {
    const req = mockApiRequest({
      method: "POST",
      body: { messages: [] },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when messages field is missing", async () => {
    const req = mockApiRequest({
      method: "POST",
      body: {},
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns a streaming response for valid input", async () => {
    const req = mockApiRequest({
      method: "POST",
      body: {
        messages: [
          { role: "user", content: "Tell me about this developer" },
        ],
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/text\/plain|text\/event-stream/);
  });
});
```

### Auth API

```ts
// tests/integration/api/auth.test.ts
import { describe, it, expect, vi } from "vitest";

// Auth route testing focuses on error modes
describe("/api/auth", () => {
  it("rejects requests missing auth headers", async () => {
    // Implementation depends on route handler structure
  });

  it("returns proper CORS headers", async () => {
    // Test OPTIONS preflight
  });
});
```

---

## Supabase Integration Testing

### Pattern: Test with a Real Supabase Project

Use a **separate Supabase project** (or `local` Supabase CLI) for integration tests:

```bash
# Start local Supabase
npx supabase start

# Run integration tests against local
SUPABASE_URL=http://localhost:54321 npx vitest run tests/integration/
```

### Test Example

```ts
// tests/integration/supabase/portfolio.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for seeding
);

beforeAll(async () => {
  // Seed test data
  await supabase.from("portfolio_about").upsert({
    id: "00000000-0000-0000-0000-000000000001",
    name: "Integration Test User",
    title: "Test Developer",
    bio: "Testing bio",
  });
});

afterAll(async () => {
  // Clean up test data
  await supabase.from("portfolio_about").delete().eq("id", "00000000-0000-0000-0000-000000000001");
});

describe("portfolio_about table", () => {
  it("returns public data without auth", async () => {
    const { data, error } = await supabase
      .from("portfolio_about")
      .select("name, title")
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.name).toBeTruthy();
  });

  it("rejects writes from anon key", async () => {
    const anonClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await anonClient
      .from("portfolio_about")
      .update({ name: "Hacked" })
      .eq("id", "00000000-0000-0000-0000-000000000001");

    // RLS should block this
    expect(error).not.toBeNull();
  });
});
```

---

## Auth Flow Integration Tests

```tsx
// tests/integration/auth/login-flow.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/auth/login/page";

// Mock Supabase client
const mockSignIn = vi.fn();
vi.mock("@/lib/supabase", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignIn,
      signInWithOtp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  }),
}));

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it("calls signInWithPassword on valid submit", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows error message on failed login", async () => {
    mockSignIn.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: "Invalid credentials" },
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

---

## Middleware Integration Testing

```ts
// tests/integration/middleware.test.ts
import { describe, it, expect, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

// Import the middleware matcher config to verify
describe("Middleware", () => {
  it("matcher covers dashboard routes", () => {
    const matcher = ["/dashboard/:path*", "/api/agent/:path*", "/api/settings/:path*"];

    const dashboardUrls = [
      "/dashboard",
      "/dashboard/blog",
      "/dashboard/portfolio",
      "/dashboard/settings",
      "/api/agent/chat",
      "/api/settings",
    ];

    for (const url of dashboardUrls) {
      const matches = matcher.some((pattern) => {
        const regex = new RegExp(`^${pattern.replace(/:path\*/g, ".*")}$`);
        return regex.test(url);
      });
      expect(matches).toBe(true);
    }
  });

  it("matcher does NOT cover public routes", () => {
    const matcher = ["/dashboard/:path*", "/api/agent/:path*", "/api/settings/:path*"];

    const publicUrls = [
      "/",
      "/blog",
      "/blog/my-post",
      "/auth/login",
      "/api/auth",
    ];

    for (const url of publicUrls) {
      const matches = matcher.some((pattern) => {
        const regex = new RegExp(`^${pattern.replace(/:path\*/g, ".*")}$`);
        return regex.test(url);
      });
      expect(matches).toBe(false);
    }
  });
});
```

---

## Running Integration Tests

```bash
# With local Supabase (recommended)
npx supabase start
SUPABASE_URL=http://localhost:54321 npx vitest run tests/integration/

# Without Supabase (mocked — faster, less realistic)
npx vitest run tests/integration/

# Run only API integration tests
npx vitest run tests/integration/api/
```

---

## CI Configuration

```yaml
# .github/workflows/integration-test.yml
name: Integration Tests
on: [pull_request]
jobs:
  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx supabase start
      - run: npx vitest run tests/integration/
        env:
          SUPABASE_URL: http://localhost:54321
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.TEST_ANON_KEY }}
      - run: npx supabase stop
```
