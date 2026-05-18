import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function DialogHarness({
  onCancel = vi.fn(),
  isPending = false,
}: {
  onCancel?: () => void;
  isPending?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Open dialog
      </button>
      <a href="/outside">Outside link</a>
      <ConfirmDialog
        description="Cette action archive le projet."
        isPending={isPending}
        onCancel={() => {
          onCancel();
          setOpen(false);
        }}
        onConfirm={vi.fn()}
        open={open}
        title="Archiver le projet"
      />
    </>
  );
}

describe("ConfirmDialog", () => {
  it("manages modal focus and keyboard dismissal accessibly", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<DialogHarness onCancel={onCancel} />);

    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);

    const dialog = screen.getByRole("alertdialog", { name: "Archiver le projet" });
    const cancelButton = screen.getByRole("button", { name: "Annuler" });
    const confirmButton = screen.getByRole("button", { name: "Confirmer" });

    expect(dialog).toHaveAccessibleDescription("Cette action archive le projet.");
    await waitFor(() => expect(cancelButton).toHaveFocus());

    await user.tab({ shift: true });
    expect(confirmButton).toHaveFocus();

    await user.tab();
    expect(cancelButton).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("dismisses from the backdrop but not from the dialog panel", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<DialogHarness onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await user.click(screen.getByRole("heading", { name: "Archiver le projet" }));
    expect(onCancel).not.toHaveBeenCalled();

    await user.click(screen.getByTestId("confirm-dialog-backdrop"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
