import { Badge } from "@/components/ui/badge";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCalendarDate } from "@/features/projects/project-date-format";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/domain/constants";
import type { Expense, Project } from "@/lib/domain/types";

type ExpenseListProps = {
  expenses: Expense[];
  projects: Project[];
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 2,
  style: "currency",
});

export function ExpenseList({ expenses, projects }: ExpenseListProps) {
  const projectById = new Map(projects.map((project) => [project.id, project]));
  const rows = expenses.map((expense) => ({
    expense,
    projectTitle: projectById.get(expense.projectId)?.title ?? "Projet inconnu",
  }));

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Journal des depenses</PanelTitle>
        <PanelDescription>Sorties atelier rattachees aux dossiers de production.</PanelDescription>
      </PanelHeader>
      <PanelContent className="p-0">
        <TableContainer className="rounded-none border-0 bg-transparent">
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow>
                <TableHead>Projet</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ expense, projectTitle }) => (
                <TableRow className="scroll-mt-28" id={expense.id} key={expense.id}>
                  <TableCell className="max-w-80 whitespace-normal py-3 font-medium leading-5">{projectTitle}</TableCell>
                  <TableCell>
                    <Badge tone={getCategoryTone(expense.category)}>{EXPENSE_CATEGORY_LABELS[expense.category]}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums text-atelier-muted">{formatCalendarDate(expense.date)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{currencyFormatter.format(expense.amount)}</TableCell>
                  <TableCell className="max-w-80 whitespace-normal py-3 text-atelier-muted">{expense.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PanelContent>
    </Panel>
  );
}

function getCategoryTone(category: Expense["category"]) {
  if (category === "matieres" || category === "transport") {
    return "amber";
  }

  if (category === "main_oeuvre") {
    return "green";
  }

  return "neutral";
}
