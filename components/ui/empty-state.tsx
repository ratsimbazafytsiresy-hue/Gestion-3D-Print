import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("grid place-items-center rounded-lg border border-dashed border-atelier-line px-6 py-10 text-center", className)}>
      <div className="flex max-w-sm flex-col items-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-atelier-line bg-atelier-surface text-atelier-muted">
          {icon ?? <Inbox aria-hidden="true" size={18} />}
        </div>
        <h2 className="text-sm font-semibold text-atelier-ink">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-atelier-muted">{description}</p> : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}
