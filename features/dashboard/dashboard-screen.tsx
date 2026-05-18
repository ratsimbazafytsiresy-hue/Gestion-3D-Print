import { AlertTriangle, Banknote, BriefcaseBusiness, ReceiptText, TrendingUp, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EXPENSE_CATEGORY_LABELS, PROJECT_STATUS_LABELS, RISK_EXPENSE_RATE, RISK_MARGIN_RATE } from "@/lib/domain/constants";
import type { ExpenseCategory, Project } from "@/lib/domain/types";
import type { DashboardData } from "@/lib/data/repository";

import { getDashboardMetrics, type DashboardProjectFinancials } from "./dashboard-metrics";
import { ExpenseCategoryChart } from "./expense-category-chart";
import { KpiCard } from "./kpi-card";
import { MarginChart } from "./margin-chart";

const DASHBOARD_TODAY_ISO = "2026-05-18";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
  style: "percent",
});

type ProjectRiskRow = Project & {
  clientName: string;
  financials: DashboardProjectFinancials;
  riskLabel: string;
};

export function DashboardScreen({ data }: { data: DashboardData }) {
  const metrics = getDashboardMetrics(data.projects, data.documents, data.expenses, DASHBOARD_TODAY_ISO);
  const totalRevenueBasis = metrics.projectFinancials.reduce((total, financials) => total + financials.revenueBasis, 0);
  const clientById = new Map(data.clients.map((client) => [client.id, client]));
  const financialsByProjectId = new Map(metrics.projectFinancials.map((financials) => [financials.projectId, financials]));
  const marginChartData = data.projects.map((project) => {
    const financials = financialsByProjectId.get(project.id);

    return {
      name: compactProjectName(project.title),
      revenue: financials?.revenueBasis ?? 0,
      expenses: financials?.expensesTotal ?? 0,
      margin: financials?.margin ?? 0,
    };
  });
  const expenseChartData = getExpenseCategoryTotals(data.expenses);
  const riskRows = data.projects
    .map<ProjectRiskRow>((project) => {
      const financials = financialsByProjectId.get(project.id);

      if (!financials) {
        throw new Error(`Missing financials for project ${project.id}`);
      }

      return {
        ...project,
        clientName: clientById.get(project.clientId)?.name ?? "Client inconnu",
        financials,
        riskLabel: getRiskLabel(financials),
      };
    })
    .sort((left, right) => Number(right.financials.isLate || right.financials.atRisk) - Number(left.financials.isLate || left.financials.atRisk));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-atelier-line pb-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold text-atelier-ink">Rentabilite atelier</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-atelier-muted">
            Vue consolidee des devis, factures, depenses et marges projet au 18/05/2026.
          </p>
        </div>
        <Badge tone="amber" className="w-fit">
          Finance Atelier
        </Badge>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard
          detail="Portefeuille actif"
          icon={<BriefcaseBusiness aria-hidden className="h-4 w-4" />}
          label="Projets"
          value={metrics.projectsCount.toString()}
        />
        <KpiCard
          detail={`${currencyFormatter.format(metrics.totalQuoted)} en devis`}
          icon={<Banknote aria-hidden className="h-4 w-4" />}
          label="Montant facture"
          tone="green"
          value={currencyFormatter.format(metrics.totalInvoiced)}
        />
        <KpiCard
          detail="Sorties atelier"
          icon={<ReceiptText aria-hidden className="h-4 w-4" />}
          label="Depenses"
          tone="amber"
          value={currencyFormatter.format(metrics.totalExpenses)}
        />
        <KpiCard
          detail={`${percentFormatter.format(totalRevenueBasis > 0 ? metrics.totalMargin / totalRevenueBasis : 0)} sur base CA`}
          icon={<TrendingUp aria-hidden className="h-4 w-4" />}
          label="Marge totale"
          tone="green"
          value={currencyFormatter.format(metrics.totalMargin)}
        />
        <KpiCard
          detail="Livraison depassee"
          icon={<AlertTriangle aria-hidden className="h-4 w-4" />}
          label="En retard"
          tone={metrics.lateProjects > 0 ? "danger" : "neutral"}
          value={metrics.lateProjects.toString()}
        />
        <KpiCard
          detail="Marge ou couts a surveiller"
          icon={<WalletCards aria-hidden className="h-4 w-4" />}
          label="A risque"
          tone={metrics.atRiskProjects > 0 ? "danger" : "neutral"}
          value={metrics.atRiskProjects.toString()}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <Panel className="min-w-0">
          <PanelHeader>
            <PanelTitle>Marge par projet</PanelTitle>
            <PanelDescription>Base CA, depenses et marge estimee par dossier.</PanelDescription>
          </PanelHeader>
          <PanelContent>
            <MarginChart data={marginChartData} />
          </PanelContent>
        </Panel>

        <Panel className="min-w-0">
          <PanelHeader>
            <PanelTitle>Depenses par categorie</PanelTitle>
            <PanelDescription>Lecture rapide des postes de cout sur les fixtures atelier.</PanelDescription>
          </PanelHeader>
          <PanelContent>
            <ExpenseCategoryChart data={expenseChartData} />
          </PanelContent>
        </Panel>
      </section>

      <Panel>
        <PanelHeader>
          <PanelTitle>Suivi risque projet</PanelTitle>
          <PanelDescription>Statuts, echeances et rentabilite pour prioriser le pilotage quotidien.</PanelDescription>
        </PanelHeader>
        <PanelContent className="p-0">
          <TableContainer className="rounded-none border-0 bg-transparent">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Risque</TableHead>
                  <TableHead>Livraison</TableHead>
                  <TableHead className="text-right">CA base</TableHead>
                  <TableHead className="text-right">Marge</TableHead>
                  <TableHead className="text-right">Taux</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskRows.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="max-w-72 whitespace-normal font-medium leading-5">{project.title}</TableCell>
                    <TableCell className="text-atelier-muted">{project.clientName}</TableCell>
                    <TableCell>
                      <Badge tone={getStatusTone(project.status)}>{PROJECT_STATUS_LABELS[project.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {project.financials.isLate ? <Badge tone="danger">Retard</Badge> : null}
                        {project.financials.atRisk ? <Badge tone="danger">{project.riskLabel}</Badge> : null}
                        {!project.financials.isLate && !project.financials.atRisk ? <Badge tone="green">Sous controle</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-atelier-muted">{project.deliveryDate}</TableCell>
                    <TableCell className="text-right tabular-nums">{currencyFormatter.format(project.financials.revenueBasis)}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-atelier-green">
                      {currencyFormatter.format(project.financials.margin)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {percentFormatter.format(project.financials.marginRate)}
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

function compactProjectName(title: string) {
  return title
    .replace("Prototype ", "")
    .replace("Piece de ", "")
    .replace(" electronique", "")
    .replace(" PETG", "");
}

function getExpenseCategoryTotals(expenses: DashboardData["expenses"]) {
  const totals = new Map<ExpenseCategory, number>();

  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  }

  return Array.from(totals.entries())
    .map(([category, total]) => ({
      category: EXPENSE_CATEGORY_LABELS[category],
      total,
    }))
    .sort((left, right) => right.total - left.total);
}

function getRiskLabel(financials: DashboardProjectFinancials) {
  if (financials.revenueBasis <= 0) {
    return "CA manquant";
  }

  if (financials.marginRate < RISK_MARGIN_RATE) {
    return "Marge basse";
  }

  if (financials.expensesTotal / financials.revenueBasis > RISK_EXPENSE_RATE) {
    return "Couts eleves";
  }

  return "Sous controle";
}

function getStatusTone(status: Project["status"]) {
  if (status === "en_production" || status === "en_controle") {
    return "amber";
  }

  if (status === "livre" || status === "termine") {
    return "green";
  }

  if (status === "annule") {
    return "danger";
  }

  return "neutral";
}
