import { getProjectFinancials, isProjectAtRisk, isProjectLate, type ProjectFinancials } from "@/lib/domain/calculations";
import type { BusinessDocument, Expense, Project } from "@/lib/domain/types";

export type DashboardProjectFinancials = ProjectFinancials & {
  projectId: string;
  atRisk: boolean;
  isLate: boolean;
};

export type DashboardMetrics = {
  projectsCount: number;
  totalQuoted: number;
  totalInvoiced: number;
  totalExpenses: number;
  totalMargin: number;
  lateProjects: number;
  atRiskProjects: number;
  projectFinancials: DashboardProjectFinancials[];
};

const roundCurrency = (value: number): number => Math.round(Number(`${value}e2`)) / 100;

export function getDashboardMetrics(
  projects: Project[],
  documents: BusinessDocument[],
  expenses: Expense[],
  todayIso: string,
): DashboardMetrics {
  const projectFinancials = projects.map<DashboardProjectFinancials>((project) => {
    const financials = getProjectFinancials(project, documents, expenses);
    const atRisk = isProjectAtRisk(financials);
    const isLate = isProjectLate(project, todayIso);

    return {
      projectId: project.id,
      ...financials,
      atRisk,
      isLate,
    };
  });

  return {
    projectsCount: projects.length,
    totalQuoted: roundCurrency(
      documents
        .filter((document) => document.type === "quote")
        .reduce((total, document) => total + document.totalIncludingVat, 0),
    ),
    totalInvoiced: roundCurrency(
      documents
        .filter((document) => document.type === "invoice" && document.status !== "annulee")
        .reduce((total, document) => total + document.totalIncludingVat, 0),
    ),
    totalExpenses: roundCurrency(expenses.reduce((total, expense) => total + expense.amount, 0)),
    totalMargin: roundCurrency(projectFinancials.reduce((total, financials) => total + financials.margin, 0)),
    lateProjects: projectFinancials.filter((financials) => financials.isLate).length,
    atRiskProjects: projectFinancials.filter((financials) => financials.atRisk).length,
    projectFinancials,
  };
}
