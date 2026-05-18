import type { ReactNode } from "react";

import { Panel, PanelContent } from "@/components/ui/panel";
import { cn } from "@/lib/utils";

type KpiTone = "neutral" | "amber" | "green" | "danger";

type KpiCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: KpiTone;
};

const toneClasses: Record<KpiTone, string> = {
  neutral: "text-atelier-ink",
  amber: "text-atelier-amber",
  green: "text-atelier-green",
  danger: "text-atelier-danger",
};

export function KpiCard({ label, value, detail, icon, tone = "neutral" }: KpiCardProps) {
  return (
    <Panel className="min-w-0">
      <PanelContent className="flex min-h-32 flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-xs font-medium uppercase tracking-wide text-atelier-muted">{label}</p>
          {icon ? (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-atelier-line bg-white text-atelier-muted">
              {icon}
            </span>
          ) : null}
        </div>
        <div className="min-w-0">
          <p className={cn("break-words text-2xl font-semibold leading-tight tabular-nums", toneClasses[tone])}>{value}</p>
          {detail ? <p className="mt-2 text-sm leading-5 text-atelier-muted">{detail}</p> : null}
        </div>
      </PanelContent>
    </Panel>
  );
}
