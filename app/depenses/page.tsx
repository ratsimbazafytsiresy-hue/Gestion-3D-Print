import { Badge } from "@/components/ui/badge";
import { ExpenseEntryForm } from "@/features/expenses/expense-entry-form";
import { ExpenseList } from "@/features/expenses/expense-list";
import { ExpenseSummary } from "@/features/expenses/expense-summary";
import { getExpensesData } from "@/lib/data/repository";

export default function ExpensesPage() {
  const data = getExpensesData();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-atelier-line pb-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Finance Atelier</p>
          <h1 className="mt-2 text-2xl font-semibold text-atelier-ink">Depenses</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-atelier-muted">
            Lecture des couts atelier par projet, categorie et date de sortie.
          </p>
        </div>
        <Badge tone="amber" className="w-fit">
          {data.expenses.length} lignes
        </Badge>
      </header>

      <ExpenseSummary expenses={data.expenses} />
      <ExpenseList expenses={data.expenses} projects={data.projects} />
      <ExpenseEntryForm projects={data.projects} />
    </div>
  );
}
