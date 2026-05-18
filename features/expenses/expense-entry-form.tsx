"use client";

import { Save } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/domain/constants";
import type { ExpenseCategory, Project } from "@/lib/domain/types";

import { expenseFormSchema, type ExpenseFormValues } from "./expense-form-schema";

type ExpenseEntryFormProps = {
  projects: Project[];
};

type ExpenseFormState = {
  projectId: string;
  category: ExpenseCategory;
  date: string;
  amount: string;
  note: string;
};

const expenseCategories = ["matieres", "sous_traitance", "transport", "main_oeuvre", "autres"] satisfies ExpenseCategory[];

const INITIAL_EXPENSE_DATE = "2026-05-18";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 2,
  style: "currency",
});

export function ExpenseEntryForm({ projects }: ExpenseEntryFormProps) {
  const firstProjectId = projects[0]?.id ?? "";
  const [form, setForm] = useState<ExpenseFormState>({
    amount: "",
    category: "matieres",
    date: INITIAL_EXPENSE_DATE,
    note: "",
    projectId: firstProjectId,
  });
  const [amountError, setAmountError] = useState<string | null>(null);
  const [savedExpense, setSavedExpense] = useState<ExpenseFormValues | null>(null);

  const updateForm = (values: Partial<ExpenseFormState>) => {
    setForm((current) => ({ ...current, ...values }));
    setAmountError(null);
    setSavedExpense(null);
  };

  const saveExpense = () => {
    const result = expenseFormSchema.safeParse({
      amount: parseAmountInput(form.amount),
      category: form.category,
      date: form.date,
      note: form.note.trim() || undefined,
      projectId: form.projectId,
    });

    if (!result.success) {
      setAmountError("Montant invalide");
      setSavedExpense(null);
      return;
    }

    setSavedExpense(result.data);
    setAmountError(null);
  };

  return (
    <Panel>
      <PanelHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <PanelTitle>Saisie rapide</PanelTitle>
          <PanelDescription>Enregistrement local des depenses par projet et categorie.</PanelDescription>
        </div>
        {savedExpense ? (
          <Badge aria-live="polite" tone="green" className="w-fit">
            Depense enregistree localement
          </Badge>
        ) : null}
      </PanelHeader>
      <PanelContent className="space-y-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.2fr)_minmax(180px,0.9fr)_minmax(150px,0.7fr)_minmax(140px,0.6fr)]">
          <Field htmlFor="expense-project" label="Projet">
            <Select id="expense-project" onChange={(event) => updateForm({ projectId: event.target.value })} value={form.projectId}>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor="expense-category" label="Categorie">
            <Select
              id="expense-category"
              onChange={(event) => updateForm({ category: event.target.value as ExpenseCategory })}
              value={form.category}
            >
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {EXPENSE_CATEGORY_LABELS[category]}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor="expense-date" label="Date">
            <Input id="expense-date" onChange={(event) => updateForm({ date: event.target.value })} type="date" value={form.date} />
          </Field>
          <Field error={amountError} htmlFor="expense-amount" label="Montant">
            <Input
              className="text-right tabular-nums"
              id="expense-amount"
              min="0.01"
              onChange={(event) => updateForm({ amount: event.target.value })}
              step="0.01"
              type="number"
              value={form.amount}
            />
          </Field>
        </div>

        <Field htmlFor="expense-note" label="Note">
          <Textarea
            id="expense-note"
            onChange={(event) => updateForm({ note: event.target.value })}
            placeholder="Matiere, transport, temps passe..."
            value={form.note}
          />
        </Field>

        <div className="flex flex-col gap-3 border-t border-atelier-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-atelier-muted">
            {savedExpense ? `${EXPENSE_CATEGORY_LABELS[savedExpense.category]} - ${currencyFormatter.format(savedExpense.amount)}` : "Pret a saisir"}
          </p>
          <Button onClick={saveExpense}>
            <Save aria-hidden size={16} />
            Enregistrer
          </Button>
        </div>
      </PanelContent>
    </Panel>
  );
}

function parseAmountInput(value: string) {
  const normalizedValue = value.trim().replace(",", ".");

  if (normalizedValue.length === 0) {
    return Number.NaN;
  }

  const parsed = Number(normalizedValue);

  return Number.isFinite(parsed) ? parsed : Number.NaN;
}
