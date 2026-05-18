import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { isProjectLate } from "@/lib/domain/calculations";
import type { Client, Project } from "@/lib/domain/types";
import { cn } from "@/lib/utils";
import { formatCalendarDate } from "@/features/projects/project-date-format";
import { ProjectStatusBadge } from "@/features/projects/project-status-badge";

import { getPlanningRange, getProjectOffsetPercent, getProjectWidthPercent } from "./planning-helpers";

type GanttPlanningProps = {
  clients: Client[];
  currentDate: string;
  projects: Project[];
};

export function GanttPlanning({ clients, currentDate, projects }: GanttPlanningProps) {
  const clientById = new Map(clients.map((client) => [client.id, client]));
  const range = getPlanningRange(projects);
  const rows = [...projects]
    .sort((left, right) => left.startDate.localeCompare(right.startDate) || left.deliveryDate.localeCompare(right.deliveryDate))
    .map((project) => ({
      clientName: clientById.get(project.clientId)?.name ?? "Client inconnu",
      isLate: isProjectLate(project, currentDate),
      offset: getProjectOffsetPercent(project, range),
      project,
      width: getProjectWidthPercent(project, range),
    }));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-atelier-line pb-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Planning</p>
          <h1 className="mt-2 text-2xl font-semibold text-atelier-ink">Gantt simplifie</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-atelier-muted">
            Lecture atelier des dates de demarrage, livraisons et retards projet au {formatCalendarDate(currentDate)}.
          </p>
        </div>
        <Badge tone="amber" className="w-fit">
          {projects.length} projets
        </Badge>
      </header>

      <Panel>
        <PanelHeader className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <PanelTitle>Plan de charge projets</PanelTitle>
            <PanelDescription>Fenetre du {formatRangeDate(range.start)} au {formatRangeDate(range.end)}.</PanelDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Demarrage</Badge>
            <Badge tone="green">Livraison</Badge>
            <Badge tone="danger">Retard</Badge>
          </div>
        </PanelHeader>
        <PanelContent className="p-0">
          {rows.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-[980px]">
                <div className="grid grid-cols-[300px_minmax(680px,1fr)] border-b border-atelier-line bg-atelier-canvas/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-atelier-muted">
                  <span>Projet</span>
                  <div className="flex items-center justify-between">
                    <span>{formatRangeDate(range.start)}</span>
                    <span>{formatRangeDate(range.end)}</span>
                  </div>
                </div>
                <div className="divide-y divide-atelier-line">
                  {rows.map(({ clientName, isLate, offset, project, width }) => (
                    <div className="grid min-h-24 grid-cols-[300px_minmax(680px,1fr)] px-5 py-4" key={project.id}>
                      <div className="min-w-0 pr-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="max-w-full truncate text-sm font-semibold text-atelier-ink">{project.title}</p>
                          {isLate ? (
                            <Badge tone="danger" className="gap-1">
                              <AlertTriangle aria-hidden className="h-3 w-3" />
                              Retard
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 truncate text-sm text-atelier-muted">{clientName}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <ProjectStatusBadge status={project.status} />
                          <Badge>{project.material}</Badge>
                        </div>
                      </div>
                      <div className="flex min-w-0 items-center">
                        <div className="relative h-12 w-full rounded-md border border-atelier-line bg-white">
                          <div className="absolute inset-y-0 left-1/2 w-px bg-atelier-line/80" />
                          <div
                            aria-label={`${project.title}, du ${formatCalendarDate(project.startDate)} au ${formatCalendarDate(project.deliveryDate)}`}
                            className={cn(
                              "absolute top-1/2 h-7 -translate-y-1/2 rounded-md border shadow-sm",
                              isLate
                                ? "border-red-200 bg-red-50 text-atelier-danger"
                                : "border-emerald-200 bg-emerald-50 text-atelier-green",
                            )}
                            style={{ left: `${offset}%`, width: `${width}%` }}
                          >
                            <div className="flex h-full min-w-0 items-center justify-between gap-2 px-2 text-xs font-medium">
                              <span className="truncate">{formatCalendarDate(project.startDate)}</span>
                              <span className="shrink-0 tabular-nums">{formatCalendarDate(project.deliveryDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-5 py-8 text-sm text-atelier-muted">Aucun projet a planifier.</div>
          )}
        </PanelContent>
      </Panel>
    </div>
  );
}

function formatRangeDate(value: string) {
  return value ? formatCalendarDate(value) : "-";
}
