import { describe, expect, it } from "vitest";

import { documents, expenses, projects } from "@/lib/domain/fixtures";

import { getDashboardMetrics } from "./dashboard-metrics";

describe("getDashboardMetrics", () => {
  it("aggregates profitability metrics from projects, documents, and expenses", () => {
    const metrics = getDashboardMetrics(projects, documents, expenses, "2026-05-18");

    expect(metrics.projectsCount).toBe(4);
    expect(metrics.totalQuoted).toBe(1280);
    expect(metrics.totalInvoiced).toBe(1280);
    expect(metrics.totalExpenses).toBe(384);
    expect(metrics.totalMargin).toBe(2832.67);
    expect(metrics.lateProjects).toBe(1);
    expect(metrics.atRiskProjects).toBe(0);
    expect(metrics.projectFinancials).toHaveLength(4);
    expect(metrics.projectFinancials[0]).toMatchObject({
      projectId: "project-boitier-electronique",
      margin: 722.67,
      revenueBasis: 1066.67,
    });
  });
});
