import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/features/auth/login-form";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const replace = vi.fn();
const refresh = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("@/lib/supabase/browser", () => ({
  createSupabaseBrowserClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh, replace }),
  useSearchParams: () => searchParams,
}));

describe("LoginForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    searchParams = new URLSearchParams();
  });

  it("shows a readable demo mode message and does not create a Supabase client when public env vars are missing", async () => {
    const user = userEvent.setup();

    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "atelier@example.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Mode demo actif: configure Supabase pour activer la connexion reelle.",
    );
    expect(createSupabaseBrowserClient).not.toHaveBeenCalled();
  });

  it("uses Supabase sign-in when public env vars exist", async () => {
    const user = userEvent.setup();
    const signInWithPassword = vi.fn().mockResolvedValue({ data: { user: { email: "atelier@example.com" } }, error: null });

    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-anon-key");
    vi.mocked(createSupabaseBrowserClient).mockReturnValue({
      auth: { signInWithPassword },
    } as unknown as ReturnType<typeof createSupabaseBrowserClient>);

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "atelier@example.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(createSupabaseBrowserClient).toHaveBeenCalledTimes(1);
    expect(signInWithPassword).toHaveBeenCalledWith({ email: "atelier@example.com", password: "secret" });
    expect(await screen.findByRole("status")).toHaveTextContent("Connexion reussie pour atelier@example.com.");
  });

  it("returns to the protected route after a successful redirected login", async () => {
    const user = userEvent.setup();
    const signInWithPassword = vi.fn().mockResolvedValue({ data: { user: { email: "atelier@example.com" } }, error: null });

    searchParams = new URLSearchParams({ redirectedFrom: "/projets?status=en_production" });
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-anon-key");
    vi.mocked(createSupabaseBrowserClient).mockReturnValue({
      auth: { signInWithPassword },
    } as unknown as ReturnType<typeof createSupabaseBrowserClient>);

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "atelier@example.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(replace).toHaveBeenCalledWith("/projets?status=en_production");
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
