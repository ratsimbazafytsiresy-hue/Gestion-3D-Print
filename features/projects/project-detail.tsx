import Link from "next/link";
import { CalendarDays, ClipboardCheck, FileText, Printer, ReceiptText, Scale, Timer } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProjectFinancials } from "@/lib/domain/calculations";
import {
  EXPENSE_CATEGORY_LABELS,
  PROJECT_PRIORITY_LABELS,
  STAGE_STATUS_LABELS,
  TASK_STATUS_LABELS,
} from "@/lib/domain/constants";
import type { ProjectDetailData } from "@/lib/data/repository";
import type { BusinessDocument, ProjectPriority, StageStatus, TaskStatus } from "@/lib/domain/types";

import { formatCalendarDate } from "./project-date-format";
import { ProjectStatusBadge } from "./project-status-badge";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
  style: "percent",
});

export function ProjectDetail({ data }: { data: ProjectDetailData }) {
  const { client, documents, expenses, project, stages, tasks } = data;

  if (!project) {
    return <EmptyState className="py-8" title="Projet introuvable" />;
  }

  const financials = getProjectFinancials(project, documents, expenses);
  const sortedStages = [...stages].sort((left, right) => left.position - right.position);
  const sortedTasks = [...tasks].sort((left, right) => (left.dueDate ?? "").localeCompare(right.dueDate ?? ""));
  const sortedDocuments = [...documents].sort((left, right) => left.issueDate.localeCompare(right.issueDate));
  const sortedExpenses = [...expenses].sort((left, right) => left.date.localeCompare(right.date));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-atelier-line pb-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Cockpit projet</p>
          <h1 className="mt-2 text-2xl font-semibold text-atelier-ink">{project.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge>{client?.name ?? "Client inconnu"}</Badge>
            <ProjectStatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            <Badge tone="amber">
              <CalendarDays aria-hidden className="mr-1.5 h-3.5 w-3.5" />
              {formatCalendarDate(project.deliveryDate)}
            </Badge>
          </div>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-atelier-muted">{project.description}</p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.7fr)]">
        <Panel>
          <PanelHeader>
            <PanelTitle>Impression 3D</PanelTitle>
            <PanelDescription>Parametres FDM et fichier modele du dossier.</PanelDescription>
          </PanelHeader>
          <PanelContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile icon={<Printer aria-hidden className="h-4 w-4" />} label="Technologie" value={project.technology} />
              <InfoTile icon={<Scale aria-hidden className="h-4 w-4" />} label="Matiere" value={project.material} />
              <InfoTile
                icon={<Timer aria-hidden className="h-4 w-4" />}
                label="Temps print"
                value={formatPrintTime(project.estimatedPrintTimeMinutes)}
              />
              <InfoTile
                icon={<Scale aria-hidden className="h-4 w-4" />}
                label="Poids matiere"
                value={`${project.materialWeightGrams} g`}
              />
            </div>
            <div className="mt-4 rounded-md border border-atelier-line bg-white px-3 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Fichier modele</p>
              <p className="mt-1 break-all text-sm font-medium text-atelier-ink">{project.modelFileName || "Non renseigne"}</p>
            </div>
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Resume financier</PanelTitle>
            <PanelDescription>Base HT, depenses liees et marge projet.</PanelDescription>
          </PanelHeader>
          <PanelContent>
            <div className="grid gap-3">
              <MoneyRow label="Base HT" value={currencyFormatter.format(financials.revenueBasis)} />
              <MoneyRow label="Depenses" value={currencyFormatter.format(financials.expensesTotal)} />
              <MoneyRow label="Marge" strong value={currencyFormatter.format(financials.margin)} />
              <MoneyRow label="Taux marge" value={percentFormatter.format(financials.marginRate)} />
            </div>
          </PanelContent>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(300px,0.55fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader>
            <PanelTitle>Etapes fixes</PanelTitle>
            <PanelDescription>Progression standard du flux atelier.</PanelDescription>
          </PanelHeader>
          <PanelContent>
            <ol className="space-y-3">
              {sortedStages.map((stage) => (
                <li className="flex items-center justify-between gap-3 rounded-md border border-atelier-line bg-white px-3 py-2" key={stage.id}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-atelier-ink">
                      {stage.position}. {stage.name}
                    </p>
                  </div>
                  <StageStatusBadge status={stage.status} />
                </li>
              ))}
            </ol>
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Checklist tasks</PanelTitle>
            <PanelDescription>Actions rattachees au projet et a ses etapes.</PanelDescription>
          </PanelHeader>
          <PanelContent className={sortedTasks.length > 0 ? "p-0" : undefined}>
            {sortedTasks.length > 0 ? (
              <TableContainer className="rounded-none border-0 bg-transparent">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tache</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Echeance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="whitespace-normal font-medium leading-5">{task.title}</TableCell>
                        <TableCell>
                          <TaskStatusBadge status={task.status} />
                        </TableCell>
                        <TableCell className="tabular-nums text-atelier-muted">
                          {task.dueDate ? formatCalendarDate(task.dueDate) : "Non renseignee"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <EmptyState icon={<ClipboardCheck aria-hidden size={18} />} title="Aucune tache" />
            )}
          </PanelContent>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <PanelHeader>
            <PanelTitle>Documents lies</PanelTitle>
            <PanelDescription>Devis et factures rattaches au dossier.</PanelDescription>
          </PanelHeader>
          <PanelContent className={sortedDocuments.length > 0 ? "p-0" : undefined}>
            {sortedDocuments.length > 0 ? (
              <LinkedDocumentsTable documents={sortedDocuments} />
            ) : (
              <EmptyState icon={<FileText aria-hidden size={18} />} title="Aucun document" />
            )}
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Depenses liees</PanelTitle>
            <PanelDescription>Couts engages pour la marge du projet.</PanelDescription>
          </PanelHeader>
          <PanelContent className={sortedExpenses.length > 0 ? "p-0" : undefined}>
            {sortedExpenses.length > 0 ? (
              <TableContainer className="rounded-none border-0 bg-transparent">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Depense</TableHead>
                      <TableHead>Categorie</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="whitespace-normal">
                          <Link className="font-medium leading-5 hover:text-atelier-amber" href={`/depenses#${expense.id}`}>
                            {expense.note}
                          </Link>
                          <p className="mt-1 text-xs text-atelier-muted">{formatCalendarDate(expense.date)}</p>
                        </TableCell>
                        <TableCell>
                          <Badge>{EXPENSE_CATEGORY_LABELS[expense.category]}</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{currencyFormatter.format(expense.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <EmptyState icon={<ReceiptText aria-hidden size={18} />} title="Aucune depense" />
            )}
          </PanelContent>
        </Panel>
      </section>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-atelier-line bg-white px-3 py-3">
      <div className="flex items-center gap-2 text-atelier-muted">
        {icon}
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-atelier-ink">{value}</p>
    </div>
  );
}

function MoneyRow({ label, strong = false, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-atelier-line pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-atelier-muted">{label}</span>
      <span className={strong ? "text-base font-semibold tabular-nums text-atelier-green" : "text-sm font-medium tabular-nums text-atelier-ink"}>
        {value}
      </span>
    </div>
  );
}

function LinkedDocumentsTable({ documents }: { documents: BusinessDocument[] }) {
  return (
    <TableContainer className="rounded-none border-0 bg-transparent">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Total TTC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <Link className="font-medium hover:text-atelier-amber" href={`/devis-factures#${document.id}`}>
                  {document.number}
                </Link>
                <p className="mt-1 text-xs text-atelier-muted">{document.type === "quote" ? "Devis" : "Facture"}</p>
              </TableCell>
              <TableCell>
                <Badge>{document.status}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">{currencyFormatter.format(document.totalIncludingVat)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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

function StageStatusBadge({ status }: { status: StageStatus }) {
  if (status === "termine") {
    return <Badge tone="green">{STAGE_STATUS_LABELS[status]}</Badge>;
  }

  if (status === "en_cours") {
    return <Badge tone="amber">{STAGE_STATUS_LABELS[status]}</Badge>;
  }

  if (status === "bloque") {
    return <Badge tone="danger">{STAGE_STATUS_LABELS[status]}</Badge>;
  }

  return <Badge>{STAGE_STATUS_LABELS[status]}</Badge>;
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  if (status === "termine") {
    return <Badge tone="green">{TASK_STATUS_LABELS[status]}</Badge>;
  }

  if (status === "en_cours") {
    return <Badge tone="amber">{TASK_STATUS_LABELS[status]}</Badge>;
  }

  return <Badge>{TASK_STATUS_LABELS[status]}</Badge>;
}

function formatPrintTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}
