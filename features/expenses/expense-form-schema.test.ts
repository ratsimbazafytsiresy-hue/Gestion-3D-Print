import { describe, expect, it } from "vitest";

import { expenseFormSchema } from "./expense-form-schema";

describe("expenseFormSchema", () => {
  it("accepts a valid expense", () => {
    const result = expenseFormSchema.safeParse({
      projectId: "project-boitier-electronique",
      category: "matieres",
      date: "2026-05-18",
      amount: 42.5,
      note: "Bobine PETG",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a negative amount", () => {
    const result = expenseFormSchema.safeParse({
      projectId: "project-boitier-electronique",
      category: "transport",
      date: "2026-05-18",
      amount: -1,
      note: "Transport",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a zero amount to match the database constraint", () => {
    const result = expenseFormSchema.safeParse({
      projectId: "project-boitier-electronique",
      category: "matieres",
      date: "2026-05-18",
      amount: 0,
      note: "Montant vide",
    });

    expect(result.success).toBe(false);
  });
});
