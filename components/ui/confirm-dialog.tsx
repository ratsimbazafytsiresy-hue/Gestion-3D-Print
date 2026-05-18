"use client";

import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmDialogTone = "danger" | "amber";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmDialogTone;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const toneClasses: Record<ConfirmDialogTone, string> = {
  danger: "border-red-200 bg-red-50 text-atelier-danger",
  amber: "border-amber-200 bg-amber-50 text-atelier-amber",
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  tone = "danger",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-6" role="presentation">
      <div
        aria-labelledby="confirm-dialog-title"
        aria-modal="true"
        className="w-full max-w-md rounded-lg border border-atelier-line bg-atelier-surface p-5 shadow-soft"
        role="alertdialog"
      >
        <div className="flex gap-3">
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md border", toneClasses[tone])}>
            <AlertTriangle aria-hidden="true" size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-atelier-ink" id="confirm-dialog-title">
              {title}
            </h2>
            {description ? <div className="mt-2 text-sm leading-6 text-atelier-muted">{description}</div> : null}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button disabled={isPending} onClick={onCancel} variant="secondary">
            {cancelLabel}
          </Button>
          <Button disabled={isPending} onClick={onConfirm} variant={tone === "danger" ? "primary" : "secondary"}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
