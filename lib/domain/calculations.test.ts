import { describe, expect, it } from "vitest";

import {
  calculateDocumentLine,
  calculateDocumentTotals,
  getProjectFinancials,
  isProjectAtRisk,
  isProjectLate,
} from "./calculations";
import { documents, expenses, projects } from "./fixtures";
import type { BusinessDocument, InvoiceDocument, QuoteDocument } from "./types";

describe("financial calculations", () => {
  it("calculates document line totals", () => {
    expect(calculateDocumentLine({ quantity: 2, unitPrice: 100, vatRate: 0.2 })).toEqual({
      totalExcludingVat: 200,
      totalVat: 40,
      totalIncludingVat: 240,
    });
  });

  it("calculates document totals from multiple lines", () => {
    expect(
      calculateDocumentTotals([
        { quantity: 1, unitPrice: 100, vatRate: 0.2 },
        { quantity: 2, unitPrice: 50, vatRate: 0.2 },
      ]),
    ).toEqual({
      totalExcludingVat: 200,
      totalVat: 40,
      totalIncludingVat: 240,
    });
  });

  it("uses a non-cancelled invoice before accepted quotes and estimate", () => {
    const project = projects[0];
    const acceptedQuote = documents.find(
      (document): document is QuoteDocument => document.type === "quote" && document.projectId === project.id,
    );
    const invoice = documents.find(
      (document): document is InvoiceDocument => document.type === "invoice" && document.projectId === project.id,
    );

    expect(acceptedQuote).toBeDefined();
    expect(invoice).toBeDefined();

    const projectDocuments: BusinessDocument[] = [
      {
        ...acceptedQuote!,
        totalIncludingVat: 900,
      },
      {
        ...invoice!,
        totalIncludingVat: 1280,
      },
      {
        ...invoice!,
        id: "doc-fac-2026-cancelled",
        number: "FAC-2026-CANCELLED",
        status: "annulee",
        totalIncludingVat: 5000,
      },
    ];

    expect(getProjectFinancials(project, projectDocuments, expenses)).toEqual({
      revenueBasis: 1280,
      expensesTotal: 344,
      margin: 936,
      marginRate: 0.73125,
    });
  });

  it("falls back to the estimated amount when no invoice or accepted quote exists", () => {
    const project = projects.find((item) => item.id === "project-support-capteur");

    expect(project).toBeDefined();
    expect(getProjectFinancials(project!, documents, expenses)).toMatchObject({
      revenueBasis: 780,
      expensesTotal: 18,
    });
  });

  it("detects late active projects", () => {
    const project = projects.find((item) => item.id === "project-piece-validation-pla");

    expect(project).toBeDefined();
    expect(isProjectLate(project!, "2026-05-18")).toBe(true);
  });

  it("does not mark completed projects as late even when the delivery date is past", () => {
    expect(isProjectLate({ ...projects[2], status: "termine" }, "2026-05-18")).toBe(false);
  });

  it("marks projects at risk when margin rate is below 20%", () => {
    expect(isProjectAtRisk({ revenueBasis: 1000, expensesTotal: 850, margin: 150, marginRate: 0.15 })).toBe(true);
  });
});
