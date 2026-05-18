import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { clients, projects } from "@/lib/domain/fixtures";

import { DocumentEditor } from "./document-editor";

describe("DocumentEditor", () => {
  it("does not save a document when the line data is invalid", async () => {
    const user = userEvent.setup();

    render(<DocumentEditor clients={clients} projects={projects} />);

    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(screen.getByText("Completez au moins une ligne valide.")).toBeInTheDocument();
    expect(screen.queryByText("Enregistre localement")).not.toBeInTheDocument();
  });
});
