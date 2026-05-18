import { ReceiptText } from "lucide-react";

import { Panel, PanelContent } from "@/components/ui/panel";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/domain/constants";
import type { Expense, ExpenseCategory } from "@/lib/domain/types";

type ExpenseSummaryProps = {
  expenses: Expense[];
};

const expenseCategories = ["matieres", "sous_traitance", "transport", "main_oeuvre", "autres"] satisfies ExpenseCategory[];

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const totals = getCategoryTotals(expenses);

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {expenseCategories.map((category) => (
        <Panel className="min-w-0" key={category}>
          <PanelContent className="flex min-h-32 flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-xs font-medium uppercase tracking-wide text-atelier-muted">
                {EXPENSE_CATEGORY_LABELS[category]}
              </p>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-atelier-line bg-white text-atelier-muted">
                <ReceiptText aria-hidden className="h-4 w-4" />
              </span>
            </div>
            <p className="break-words text-2xl font-semibold leading-tight tabular-nums text-atelier-amber">
              {currencyFormatter.format(totals.get(category) ?? 0)}
            </p>
          </PanelContent>
        </Panel>
      ))}
    </section>
  );
}

function getCategoryTotals(expenses: Expense[]) {
  const totals = new Map<ExpenseCategory, number>();

  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  }

  return totals;
}
