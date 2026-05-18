"use client";

import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/input";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProjectFinancials } from "@/lib/domain/calculations";
import { MATERIALS, PROJECT_PRIORITY_LABELS, PROJECT_STATUS_LABELS } from "@/lib/domain/constants";
import { filterProjects, sortProjectsByDeliveryDate } from "@/lib/domain/filters";
import type { BusinessDocument, Client, Expense, Material, Project, ProjectPriority, ProjectStatus } from "@/lib/domain/types";

import { formatCalendarDate } from "./project-date-format";
import { ProjectStatusBadge } from "./project-status-badge";

type ProjectListProps = {
  clients: Client[];
  documents: BusinessDocument[];
  expenses: Expense[];
  projects: Project[];
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function ProjectList({ clients, documents, expenses, projects }: ProjectListProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [material, setMaterial] = useState<Material | "all">("all");
  const clientById = useMemo(() => new Map(clients.map((client) => [client.id, client])), [clients]);
  const rows = useMemo(() => {
    return sortProjectsByDeliveryDate(filterProjects(projects, { material, query, status })).map((project) => ({
      clientName: clientById.get(project.clientId)?.name ?? "Client inconnu",
      financials: getProjectFinancials(project, documents, expenses),
      project,
    }));
  }, [clientById, documents, expenses, material, projects, query, status]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-atelier-line pb-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Projets</p>
          <h1 className="mt-2 text-2xl font-semibold text-atelier-ink">Pilotage projets</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-atelier-muted">
            Liste operationnelle des dossiers FDM, avec echeances, matieres et marge estimee.
          </p>
        </div>
        <Badge tone="amber" className="w-fit">
          {rows.length} / {projects.length} visibles
        </Badge>
      </header>

      <Panel>
        <PanelHeader className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <PanelTitle>Portefeuille projets</PanelTitle>
            <PanelDescription>Filtrer par recherche, statut ou matiere avant d&apos;ouvrir le cockpit projet.</PanelDescription>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[680px]">
            <Field htmlFor="project-search" label="Recherche">
              <div className="relative">
                <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-atelier-muted" />
                <Input
                  className="pl-9"
                  id="project-search"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Projet ou description"
                  value={query}
                />
              </div>
            </Field>
            <Field htmlFor="project-status" label="Statut">
              <Select id="project-status" onChange={(event) => setStatus(event.target.value as ProjectStatus | "all")} value={status}>
                <option value="all">Tous</option>
                {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field htmlFor="project-material" label="Matiere">
              <Select id="project-material" onChange={(event) => setMaterial(event.target.value as Material | "all")} value={material}>
                <option value="all">Toutes</option>
                {MATERIALS.map((materialOption) => (
                  <option key={materialOption} value={materialOption}>
                    {materialOption}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </PanelHeader>
        <PanelContent className="p-0">
          <TableContainer className="rounded-none border-0 bg-transparent">
            <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Projet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Priorite</TableHead>
                  <TableHead>Matiere</TableHead>
                  <TableHead>Livraison</TableHead>
                  <TableHead className="text-right">Montant estime</TableHead>
                  <TableHead className="text-right">Marge estimee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ clientName, financials, project }) => (
                  <TableRow key={project.id} className="group">
                    <TableCell className="max-w-80 whitespace-normal py-3">
                      <Link className="flex items-start gap-2 font-medium leading-5 hover:text-atelier-amber" href={`/projets/${project.id}`}>
                        <span>{project.title}</span>
                        <ArrowUpRight
                          aria-hidden
                          className="mt-0.5 h-4 w-4 shrink-0 text-atelier-muted transition-colors group-hover:text-atelier-amber"
                        />
                      </Link>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-atelier-muted">{project.description}</p>
                    </TableCell>
                    <TableCell className="text-atelier-muted">{clientName}</TableCell>
                    <TableCell>
                      <ProjectStatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={project.priority} />
                    </TableCell>
                    <TableCell>
                      <Badge>{project.material}</Badge>
                    </TableCell>
                    <TableCell className="tabular-nums text-atelier-muted">{formatCalendarDate(project.deliveryDate)}</TableCell>
                    <TableCell className="text-right tabular-nums">{currencyFormatter.format(project.estimatedAmount)}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-atelier-green">
                      {currencyFormatter.format(financials.margin)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </PanelContent>
      </Panel>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  if (priority === "urgente") {
    return <Badge tone="danger">{PROJECT_PRIORITY_LABELS[priority]}</Badge>;
  }

  if (priority === "haute") {
    return <Badge tone="amber">{PROJECT_PRIORITY_LABELS[priority]}</Badge>;
  }

  return <Badge>{PROJECT_PRIORITY_LABELS[priority]}</Badge>;
}
