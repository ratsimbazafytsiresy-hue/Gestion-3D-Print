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

type DocumentLineTotals = {
  lineTotalExcludingVat: number;
  lineTotalVat: number;
  lineTotalIncludingVat: number;
};

const roundCurrency = (value: number): number => Math.round(Number(`${value}e2`)) / 100;

export const calculateDocumentLine = ({ quantity, unitPrice, vatRate }: LineInput): DocumentLineTotals => {
  const lineTotalExcludingVat = roundCurrency(quantity * unitPrice);
  const lineTotalVat = roundCurrency(lineTotalExcludingVat * vatRate);
  const lineTotalIncludingVat = roundCurrency(lineTotalExcludingVat + lineTotalVat);

  return {
    lineTotalExcludingVat,
    lineTotalVat,
    lineTotalIncludingVat,
  };
};

export const calculateDocumentTotals = (lines: LineInput[]): DocumentTotals => {
  return lines.reduce<DocumentTotals>(
    (totals, line) => {
      const lineTotals = calculateDocumentLine(line);

      return {
        totalExcludingVat: roundCurrency(totals.totalExcludingVat + lineTotals.lineTotalExcludingVat),
        totalVat: roundCurrency(totals.totalVat + lineTotals.lineTotalVat),
        totalIncludingVat: roundCurrency(totals.totalIncludingVat + lineTotals.lineTotalIncludingVat),
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
  const invoices = projectDocuments.filter((document) => document.type === "invoice" && document.status !== "annulee");
  const acceptedQuotes = projectDocuments.filter(
    (document) => document.type === "quote" && document.status === "accepte",
  );
  const revenueBasis = roundCurrency(
    invoices.length > 0
      ? invoices.reduce((total, invoice) => total + invoice.totalExcludingVat, 0)
      : acceptedQuotes.length > 0
        ? acceptedQuotes.reduce((total, quote) => total + quote.totalExcludingVat, 0)
        : project.estimatedAmount,
  );
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
