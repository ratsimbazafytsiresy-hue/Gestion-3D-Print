import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  iconOnly?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-atelier-ink bg-atelier-ink text-atelier-surface shadow-sm hover:bg-black disabled:border-atelier-muted disabled:bg-atelier-muted",
  secondary:
    "border-atelier-line bg-atelier-surface text-atelier-ink shadow-sm hover:border-atelier-amber hover:bg-white disabled:text-atelier-muted",
  ghost:
    "border-transparent bg-transparent text-atelier-muted hover:bg-atelier-surface hover:text-atelier-ink disabled:text-atelier-muted",
};

export function Button({ className, variant = "primary", iconOnly = false, type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium leading-none transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atelier-amber focus-visible:ring-offset-2 focus-visible:ring-offset-atelier-canvas",
        "disabled:pointer-events-none disabled:opacity-60",
        iconOnly && "w-9 px-0",
        variantClasses[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
