import { describe, it, expect, vi, beforeEach } from "vitest";

// Regression coverage for "Invalid Refresh Token: Refresh Token Not Found"
// crashing HomePage. Root cause: any `.from()` query internally resolves the
// current session via `auth.getSession()`, and when the stored refresh token
// is dead, that call throws instead of resolving with an error — uncaught,
// it kills the very first query of the request. `createServerSupabaseClient`
// guards against this by eagerly triggering (and swallowing) that failure
// once via `getUser()`, then clearing the stale cookies so the browser stops
// resending a token that will never work.

const getUserMock = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: getUserMock },
  })),
}));

const cookieStoreMock = {
  getAll: vi.fn(),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStoreMock),
}));

const REFRESH_TOKEN_ERROR = new Error("Invalid Refresh Token: Refresh Token Not Found");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createServerSupabaseClient", () => {
  it("returns a client and leaves cookies untouched when getUser resolves", async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: null });
    cookieStoreMock.getAll.mockReturnValue([{ name: "sb-abc-auth-token", value: "valid" }]);

    const { createServerSupabaseClient } = await import("@/lib/supabase-server");
    const client = await createServerSupabaseClient();

    expect(client).toBeDefined();
    expect(cookieStoreMock.set).not.toHaveBeenCalled();
  });

  it("does not throw when getUser rejects with an invalid refresh token error", async () => {
    getUserMock.mockRejectedValue(REFRESH_TOKEN_ERROR);
    cookieStoreMock.getAll.mockReturnValue([]);

    const { createServerSupabaseClient } = await import("@/lib/supabase-server");

    await expect(createServerSupabaseClient()).resolves.toBeDefined();
  });

  it("clears only the sb-*-auth-token cookies when getUser throws", async () => {
    getUserMock.mockRejectedValue(REFRESH_TOKEN_ERROR);
    cookieStoreMock.getAll.mockReturnValue([
      { name: "sb-abc-auth-token", value: "stale" },
      { name: "sb-abc-auth-token.1", value: "stale-chunk" },
      { name: "theme", value: "dark" },
      { name: "sb-abc-code-verifier", value: "unrelated" },
    ]);

    const { createServerSupabaseClient } = await import("@/lib/supabase-server");
    await createServerSupabaseClient();

    expect(cookieStoreMock.set).toHaveBeenCalledWith("sb-abc-auth-token", "", { maxAge: 0, path: "/" });
    expect(cookieStoreMock.set).toHaveBeenCalledWith("sb-abc-auth-token.1", "", { maxAge: 0, path: "/" });
    expect(cookieStoreMock.set).toHaveBeenCalledTimes(2);
    expect(cookieStoreMock.set).not.toHaveBeenCalledWith("theme", expect.anything(), expect.anything());
    expect(cookieStoreMock.set).not.toHaveBeenCalledWith("sb-abc-code-verifier", expect.anything(), expect.anything());
  });

  it("swallows errors thrown while clearing cookies from a Server Component render", async () => {
    getUserMock.mockRejectedValue(REFRESH_TOKEN_ERROR);
    cookieStoreMock.getAll.mockReturnValue([{ name: "sb-abc-auth-token", value: "stale" }]);
    cookieStoreMock.set.mockImplementation(() => {
      throw new Error("Cookies can only be modified in a Server Action or Route Handler");
    });

    const { createServerSupabaseClient } = await import("@/lib/supabase-server");

    await expect(createServerSupabaseClient()).resolves.toBeDefined();
  });

  it("does not attempt to clear cookies when getUser resolves with an error object instead of throwing", async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: { message: "expired" } });
    cookieStoreMock.getAll.mockReturnValue([{ name: "sb-abc-auth-token", value: "expired" }]);

    const { createServerSupabaseClient } = await import("@/lib/supabase-server");
    await createServerSupabaseClient();

    expect(cookieStoreMock.set).not.toHaveBeenCalled();
  });
});
