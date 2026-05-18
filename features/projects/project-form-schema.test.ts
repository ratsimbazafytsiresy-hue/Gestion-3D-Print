import { describe, expect, it } from "vitest";

import { projectFormSchema } from "./project-form-schema";

describe("projectFormSchema", () => {
  it("accepts a valid FDM project", () => {
    const result = projectFormSchema.safeParse({
      clientId: "client-atelier-nova",
      title: "Prototype boitier electronique",
      startDate: "2026-05-18",
      deliveryDate: "2026-05-24",
      estimatedAmount: 1280,
      material: "PETG",
      estimatedPrintTimeMinutes: 960,
      materialWeightGrams: 420,
    });

    expect(result.success).toBe(true);
  });

  it("rejects deliveryDate before startDate", () => {
    const result = projectFormSchema.safeParse({
      clientId: "client-atelier-nova",
      title: "Prototype boitier electronique",
      startDate: "2026-05-24",
      deliveryDate: "2026-05-18",
      estimatedAmount: 1280,
      material: "PETG",
      estimatedPrintTimeMinutes: 960,
      materialWeightGrams: 420,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.at(0)?.message).toBe("La date de livraison doit etre posterieure ou egale a la date de debut.");
  });
});
