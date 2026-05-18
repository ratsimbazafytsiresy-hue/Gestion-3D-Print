import { RISK_EXPENSE_RATE, RISK_MARGIN_RATE } from "./constants";
import type { BusinessDocument, Expense, Project } from "./types";

export type LineInput = { quantity: number; unitPrice: number; vatRate: number };

export type ProjectFinancials = {
  revenueBasis: number;
  expensesTotal: number;
  margin: number;
  marginRate: number;
};

type DocumentTotals = {
  totalExcludingVat: number;
  totalVat: number;
  totalIncludingVat: number;
};

const roundCurrency = (value: number): number => Math.round(value * 100) / 100;

export const calculateDocumentLine = ({ quantity, unitPrice, vatRate }: LineInput): DocumentTotals => {
  const totalExcludingVat = roundCurrency(quantity * unitPrice);
  const totalVat = roundCurrency(totalExcludingVat * vatRate);
  const totalIncludingVat = roundCurrency(totalExcludingVat + totalVat);

  return {
    totalExcludingVat,
    totalVat,
    totalIncludingVat,
  };
};

export const calculateDocumentTotals = (lines: LineInput[]): DocumentTotals => {
  return lines.reduce<DocumentTotals>(
    (totals, line) => {
      const lineTotals = calculateDocumentLine(line);

      return {
        totalExcludingVat: roundCurrency(totals.totalExcludingVat + lineTotals.totalExcludingVat),
        totalVat: roundCurrency(totals.totalVat + lineTotals.totalVat),
        totalIncludingVat: roundCurrency(totals.totalIncludingVat + lineTotals.totalIncludingVat),
      };
    },
    {
      totalExcludingVat: 0,
      totalVat: 0,
      totalIncludingVat: 0,
    },
  );
};

export const getProjectFinancials = (
  project: Project,
  documents: BusinessDocument[],
  expenses: Expense[],
): ProjectFinancials => {
  const projectDocuments = documents.filter((document) => document.projectId === project.id);
  const invoice = projectDocuments.find((document) => document.type === "invoice" && document.status !== "annulee");
  const acceptedQuote = projectDocuments.find((document) => document.type === "quote" && document.status === "accepte");
  const revenueBasis = invoice?.totalIncludingVat ?? acceptedQuote?.totalIncludingVat ?? project.estimatedAmount;
  const expensesTotal = roundCurrency(
    expenses
      .filter((expense) => expense.projectId === project.id)
      .reduce((total, expense) => total + expense.amount, 0),
  );
  const margin = roundCurrency(revenueBasis - expensesTotal);
  const marginRate = revenueBasis > 0 ? margin / revenueBasis : 0;

  return {
    revenueBasis,
    expensesTotal,
    margin,
    marginRate,
  };
};

export const isProjectLate = (project: Project, todayIso: string): boolean => {
  if (project.status === "livre" || project.status === "termine" || project.status === "annule") {
    return false;
  }

  return project.deliveryDate < todayIso;
};

export const isProjectAtRisk = (financials: ProjectFinancials): boolean => {
  return (
    financials.revenueBasis <= 0 ||
    financials.marginRate < RISK_MARGIN_RATE ||
    financials.expensesTotal / financials.revenueBasis > RISK_EXPENSE_RATE
  );
};
