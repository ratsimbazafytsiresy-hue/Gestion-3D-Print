"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
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

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const getFocusableElements = (container: HTMLElement) => {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => element.tabIndex >= 0);
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
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const inertElements = Array.from(document.body.children)
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== backdropRef.current)
      .map((element) => ({
        ariaHidden: element.getAttribute("aria-hidden"),
        element,
        inert: element.inert,
      }));

    inertElements.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });

    const animationFrame = window.requestAnimationFrame(() => {
      const target = cancelButtonRef.current ?? (dialogRef.current ? getFocusableElements(dialogRef.current)[0] : null);
      target?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);

      inertElements.forEach(({ ariaHidden, element, inert }) => {
        element.inert = inert;

        if (ariaHidden === null) {
          element.removeAttribute("aria-hidden");
        } else {
          element.setAttribute("aria-hidden", ariaHidden);
        }
      });

      if (previousActiveElement && document.contains(previousActiveElement)) {
        previousActiveElement.focus({ preventScroll: true });
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isPending && event.target === event.currentTarget) {
      onCancel();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      if (!isPending) {
        event.preventDefault();
        onCancel();
      }

      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusableElements = getFocusableElements(dialogRef.current);

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogRef.current.focus({ preventScroll: true });
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && (activeElement === firstElement || !dialogRef.current.contains(activeElement))) {
      event.preventDefault();
      lastElement.focus({ preventScroll: true });
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus({ preventScroll: true });
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-6"
      data-testid="confirm-dialog-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      ref={backdropRef}
      role="presentation"
    >
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-md rounded-lg border border-atelier-line bg-atelier-surface p-5 shadow-soft"
        ref={dialogRef}
        role="alertdialog"
        tabIndex={-1}
      >
        <div className="flex gap-3">
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md border", toneClasses[tone])}>
            <AlertTriangle aria-hidden="true" size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-atelier-ink" id={titleId}>
              {title}
            </h2>
            {description ? (
              <div className="mt-2 text-sm leading-6 text-atelier-muted" id={descriptionId}>
                {description}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button disabled={isPending} onClick={onCancel} ref={cancelButtonRef} variant="secondary">
            {cancelLabel}
          </Button>
          <Button disabled={isPending} onClick={onConfirm} variant={tone === "danger" ? "primary" : "secondary"}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
