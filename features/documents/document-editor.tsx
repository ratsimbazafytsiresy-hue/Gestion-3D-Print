"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_VAT_RATE } from "@/lib/domain/constants";
import { calculateDocumentTotals } from "@/lib/domain/calculations";
import type { Client, DocumentType, Project } from "@/lib/domain/types";

import type { DocumentFormValues, DocumentLineFormValues } from "./document-form-schema";

type DocumentEditorProps = {
  clients: Client[];
  projects: Project[];
};

type EditorLine = DocumentLineFormValues & {
  id: string;
};

type EditorFormState = Omit<DocumentFormValues, "lines"> & {
  lines: EditorLine[];
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 2,
  style: "currency",
});

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
  style: "percent",
});

let lineSequence = 0;

const createLine = (): EditorLine => {
  lineSequence += 1;

  return {
    description: "",
    id: `line-${lineSequence}`,
    quantity: 1,
    unitPrice: 0,
    vatRate: DEFAULT_VAT_RATE,
  };
};

const parseNumericInput = (value: string) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export function DocumentEditor({ clients, projects }: DocumentEditorProps) {
  const firstClientId = clients[0]?.id ?? "";
  const firstProjectId = projects.find((project) => project.clientId === firstClientId)?.id ?? projects[0]?.id ?? "";
  const [savedDocument, setSavedDocument] = useState<EditorFormState | null>(null);
  const [form, setForm] = useState<EditorFormState>({
    clientId: firstClientId,
    dueDate: "",
    issueDate: "2026-05-18",
    lines: [createLine()],
    number: "DEV-2026-002",
    projectId: firstProjectId,
    type: "quote",
  });

  const availableProjects = useMemo(() => {
    const clientProjects = projects.filter((project) => project.clientId === form.clientId);

    return clientProjects.length > 0 ? clientProjects : projects;
  }, [form.clientId, projects]);
  const totals = useMemo(() => calculateDocumentTotals(form.lines), [form.lines]);

  const updateLine = (lineId: string, values: Partial<DocumentLineFormValues>) => {
    setForm((current) => ({
      ...current,
      lines: current.lines.map((line) => (line.id === lineId ? { ...line, ...values } : line)),
    }));
    setSavedDocument(null);
  };

  const addLine = () => {
    setForm((current) => ({ ...current, lines: [...current.lines, createLine()] }));
    setSavedDocument(null);
  };

  const removeLine = (lineId: string) => {
    setForm((current) => {
      if (current.lines.length === 1) {
        return current;
      }

      return { ...current, lines: current.lines.filter((line) => line.id !== lineId) };
    });
    setSavedDocument(null);
  };

  const updateClient = (clientId: string) => {
    const nextProjectId = projects.find((project) => project.clientId === clientId)?.id ?? projects[0]?.id ?? "";

    setForm((current) => ({ ...current, clientId, projectId: nextProjectId }));
    setSavedDocument(null);
  };

  const updateType = (type: DocumentType) => {
    setForm((current) => ({
      ...current,
      number: current.number.startsWith(type === "quote" ? "DEV" : "FAC") ? current.number : type === "quote" ? "DEV-2026-002" : "FAC-2026-002",
      type,
    }));
    setSavedDocument(null);
  };

  const saveDocument = () => {
    setSavedDocument(form);
  };

  return (
    <Panel>
      <PanelHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <PanelTitle>Edition manuelle</PanelTitle>
          <PanelDescription>Prototype local pour composer un devis ou une facture sans ecriture Supabase.</PanelDescription>
        </div>
        {savedDocument ? (
          <Badge tone="green" className="w-fit">
            Enregistre localement
          </Badge>
        ) : null}
      </PanelHeader>
      <PanelContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-5">
          <Field htmlFor="document-type" label="Type">
            <Select id="document-type" onChange={(event) => updateType(event.target.value as DocumentType)} value={form.type}>
              <option value="quote">Devis</option>
              <option value="invoice">Facture</option>
            </Select>
          </Field>
          <Field htmlFor="document-number" label="Numero">
            <Input
              id="document-number"
              onChange={(event) => {
                setForm((current) => ({ ...current, number: event.target.value }));
                setSavedDocument(null);
              }}
              value={form.number}
            />
          </Field>
          <Field htmlFor="document-client" label="Client">
            <Select id="document-client" onChange={(event) => updateClient(event.target.value)} value={form.clientId}>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor="document-project" label="Projet">
            <Select
              id="document-project"
              onChange={(event) => {
                setForm((current) => ({ ...current, projectId: event.target.value }));
                setSavedDocument(null);
              }}
              value={form.projectId}
            >
              {availableProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor="document-issue-date" label="Date emission">
            <Input
              id="document-issue-date"
              onChange={(event) => {
                setForm((current) => ({ ...current, issueDate: event.target.value }));
                setSavedDocument(null);
              }}
              type="date"
              value={form.issueDate}
            />
          </Field>
        </div>

        <TableContainer>
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="w-28 text-right">Quantite</TableHead>
                <TableHead className="w-36 text-right">Prix HT</TableHead>
                <TableHead className="w-32 text-right">TVA</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.lines.map((line, index) => (
                <TableRow key={line.id}>
                  <TableCell>
                    <Input
                      aria-label={`Description ligne ${index + 1}`}
                      onChange={(event) => updateLine(line.id, { description: event.target.value })}
                      placeholder="Designation"
                      value={line.description}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      aria-label={`Quantite ligne ${index + 1}`}
                      className="text-right tabular-nums"
                      min="0"
                      onChange={(event) => updateLine(line.id, { quantity: parseNumericInput(event.target.value) })}
                      step="0.01"
                      type="number"
                      value={line.quantity}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      aria-label={`Prix unitaire ligne ${index + 1}`}
                      className="text-right tabular-nums"
                      min="0"
                      onChange={(event) => updateLine(line.id, { unitPrice: parseNumericInput(event.target.value) })}
                      step="0.01"
                      type="number"
                      value={line.unitPrice}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      aria-label={`TVA ligne ${index + 1}`}
                      className="text-right tabular-nums"
                      min="0"
                      onChange={(event) => updateLine(line.id, { vatRate: parseNumericInput(event.target.value) })}
                      step="0.01"
                      type="number"
                      value={line.vatRate}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      aria-label={`Supprimer ligne ${index + 1}`}
                      disabled={form.lines.length === 1}
                      iconOnly
                      onClick={() => removeLine(line.id)}
                      title="Supprimer la ligne"
                      variant="ghost"
                    >
                      <Trash2 aria-hidden size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex flex-col gap-4 border-t border-atelier-line pt-4 lg:flex-row lg:items-end lg:justify-between">
          <Button onClick={addLine} variant="secondary">
            <Plus aria-hidden size={16} />
            Ajouter une ligne
          </Button>
          <div className="grid gap-2 text-sm lg:min-w-[320px]">
            <TotalRow label="Total HT" value={currencyFormatter.format(totals.totalExcludingVat)} />
            <TotalRow label="TVA" value={currencyFormatter.format(totals.totalVat)} />
            <TotalRow label="Total TTC" strong value={currencyFormatter.format(totals.totalIncludingVat)} />
            <p className="text-right text-xs text-atelier-muted">TVA par defaut: {percentFormatter.format(DEFAULT_VAT_RATE)}</p>
          </div>
          <Button onClick={saveDocument}>
            <Save aria-hidden size={16} />
            Enregistrer
          </Button>
        </div>
      </PanelContent>
    </Panel>
  );
}

function TotalRow({ label, strong = false, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div className={strong ? "flex items-center justify-between text-base font-semibold" : "flex items-center justify-between text-atelier-muted"}>
      <span>{label}</span>
      <span className="tabular-nums text-atelier-ink">{value}</span>
    </div>
  );
}
