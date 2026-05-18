import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { projects } from "@/lib/domain/fixtures";

import { ExpenseEntryForm } from "./expense-entry-form";

describe("ExpenseEntryForm", () => {
  it("does not save an empty amount as a zero expense", async () => {
    const user = userEvent.setup();

    render(<ExpenseEntryForm projects={projects} />);

    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(screen.getByText("Montant invalide")).toBeInTheDocument();
    expect(screen.queryByText("Depense enregistree localement")).not.toBeInTheDocument();
  });
});
