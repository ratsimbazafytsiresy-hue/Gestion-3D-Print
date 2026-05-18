"use client";

import { FileText, ReceiptText } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Field, Select } from "@/components/ui/input";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BusinessDocument, Client, DocumentType, InvoiceStatus, Project, QuoteStatus } from "@/lib/domain/types";
import { formatCalendarDate } from "@/features/projects/project-date-format";

type DocumentListProps = {
  clients: Client[];
  documents: BusinessDocument[];
  projects: Project[];
};

type DocumentStatus = QuoteStatus | InvoiceStatus;

const documentTypeLabels: Record<DocumentType, string> = {
  invoice: "Facture",
  quote: "Devis",
};

const statusLabels: Record<DocumentStatus, string> = {
  accepte: "Accepte",
  annulee: "Annulee",
  brouillon: "Brouillon",
  en_retard: "En retard",
  envoye: "Envoye",
  envoyee: "Envoyee",
  payee: "Payee",
  refuse: "Refuse",
};

const statusOptions: DocumentStatus[] = ["brouillon", "envoye", "accepte", "refuse", "envoyee", "payee", "en_retard", "annulee"];

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 2,
  style: "currency",
});

export function DocumentList({ clients, documents, projects }: DocumentListProps) {
  const [type, setType] = useState<DocumentType | "all">("all");
  const [status, setStatus] = useState<DocumentStatus | "all">("all");
  const clientById = useMemo(() => new Map(clients.map((client) => [client.id, client])), [clients]);
  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  const rows = useMemo(() => {
    return documents
      .filter((document) => type === "all" || document.type === type)
      .filter((document) => status === "all" || document.status === status)
      .map((document) => ({
        clientName: clientById.get(document.clientId)?.name ?? "Client inconnu",
        document,
        projectTitle: projectById.get(document.projectId)?.title ?? "Projet inconnu",
      }));
  }, [clientById, documents, projectById, status, type]);

  return (
    <Panel>
      <PanelHeader className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <PanelTitle>Documents commerciaux</PanelTitle>
          <PanelDescription>Suivi centralise des devis et factures par client et projet.</PanelDescription>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
          <Field htmlFor="document-type-filter" label="Type">
            <Select id="document-type-filter" onChange={(event) => setType(event.target.value as DocumentType | "all")} value={type}>
              <option value="all">Tous</option>
              <option value="quote">Devis</option>
              <option value="invoice">Factures</option>
            </Select>
          </Field>
          <Field htmlFor="document-status-filter" label="Statut">
            <Select
              id="document-status-filter"
              onChange={(event) => setStatus(event.target.value as DocumentStatus | "all")}
              value={status}
            >
              <option value="all">Tous</option>
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusLabels[statusOption]}
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
                <TableHead>Type</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue date</TableHead>
                <TableHead className="text-right">Total including VAT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ clientName, document, projectTitle }) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <DocumentTypeBadge type={document.type} />
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">{document.number}</TableCell>
                  <TableCell className="text-atelier-muted">{clientName}</TableCell>
                  <TableCell className="max-w-72 whitespace-normal py-3 text-atelier-muted">{projectTitle}</TableCell>
                  <TableCell>
                    <DocumentStatusBadge status={document.status} />
                  </TableCell>
                  <TableCell className="tabular-nums text-atelier-muted">{formatCalendarDate(document.issueDate)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {currencyFormatter.format(document.totalIncludingVat)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PanelContent>
    </Panel>
  );
}

function DocumentTypeBadge({ type }: { type: DocumentType }) {
  const Icon = type === "invoice" ? ReceiptText : FileText;

  return (
    <Badge tone={type === "invoice" ? "green" : "amber"}>
      <Icon aria-hidden className="mr-1.5 h-3.5 w-3.5" />
      {documentTypeLabels[type]}
    </Badge>
  );
}

function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const toneByStatus: Record<DocumentStatus, BadgeProps["tone"]> = {
    accepte: "green",
    annulee: "danger",
    brouillon: "neutral",
    en_retard: "danger",
    envoye: "amber",
    envoyee: "amber",
    payee: "green",
    refuse: "danger",
  };

  return <Badge tone={toneByStatus[status]}>{statusLabels[status]}</Badge>;
}
