import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { updateSession } from "./middleware";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

describe("updateSession", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("does not protect routes while Supabase is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    const response = await updateSession(new NextRequest("http://localhost/projets"));

    expect(response.headers.get("location")).toBeNull();
    expect(createServerClient).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated users from internal routes when Supabase is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-anon-key");
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as unknown as ReturnType<typeof createServerClient>);

    const response = await updateSession(new NextRequest("http://localhost/projets?status=en_production"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/login?redirectedFrom=%2Fprojets%3Fstatus%3Den_production",
    );
  });

  it("keeps the login route public when Supabase is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-anon-key");
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as unknown as ReturnType<typeof createServerClient>);

    const response = await updateSession(new NextRequest("http://localhost/login"));

    expect(response.headers.get("location")).toBeNull();
  });
});
