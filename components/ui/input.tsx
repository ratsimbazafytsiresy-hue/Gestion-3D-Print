import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Field({ label, htmlFor, hint, error, children, className }: FieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {label ? <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel> : null}
      {children}
      {error ? (
        <p className="text-xs leading-5 text-atelier-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs leading-5 text-atelier-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function FieldLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-xs font-medium uppercase tracking-wide text-atelier-muted", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border border-atelier-line bg-white px-3 text-sm text-atelier-ink shadow-sm outline-none transition-colors",
        "placeholder:text-stone-400 focus:border-atelier-amber focus:ring-2 focus:ring-atelier-amber/20 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-atelier-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-md border border-atelier-line bg-white px-3 text-sm text-atelier-ink shadow-sm outline-none transition-colors",
        "focus:border-atelier-amber focus:ring-2 focus:ring-atelier-amber/20 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-atelier-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md border border-atelier-line bg-white px-3 py-2 text-sm text-atelier-ink shadow-sm outline-none transition-colors",
        "placeholder:text-stone-400 focus:border-atelier-amber focus:ring-2 focus:ring-atelier-amber/20 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-atelier-muted",
        className,
      )}
      {...props}
    />
  );
}
