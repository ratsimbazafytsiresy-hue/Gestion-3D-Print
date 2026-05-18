import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SettingsScreen } from "@/features/settings/settings-screen";

describe("SettingsScreen", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("shows app identity, environment, roles, V1 materials, and future modules", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    render(<SettingsScreen />);

    expect(screen.getByRole("heading", { name: "Parametres" })).toBeInTheDocument();
    expect(screen.getByText("Gestion Crafted")).toBeInTheDocument();
    expect(screen.getAllByText("Demo fixtures").length).toBeGreaterThan(0);

    for (const role of ["Admin", "membre"]) {
      expect(screen.getByText(role)).toBeInTheDocument();
    }

    for (const material of ["FDM", "PLA", "PETG", "ABS", "TPU", "ASA"]) {
      expect(screen.getByText(material)).toBeInTheDocument();
    }

    for (const moduleName of ["stock matiere", "maintenance machines", "portail client", "PDF export", "compta"]) {
      expect(screen.getByText(moduleName)).toBeInTheDocument();
    }
  });
});
