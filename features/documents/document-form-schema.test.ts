import { describe, expect, it } from "vitest";

import { documentFormSchema } from "./document-form-schema";

describe("documentFormSchema", () => {
  it("accepts a quote with one valid line", () => {
    const result = documentFormSchema.safeParse({
      type: "quote",
      number: "DEV-2026-002",
      clientId: "client-atelier-nova",
      projectId: "project-boitier-electronique",
      issueDate: "2026-05-18",
      dueDate: "",
      lines: [
        {
          description: "Impression PETG",
          quantity: 1,
          unitPrice: 120,
          vatRate: 0.2,
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a document without lines", () => {
    const result = documentFormSchema.safeParse({
      type: "invoice",
      number: "FAC-2026-002",
      clientId: "client-atelier-nova",
      projectId: "project-boitier-electronique",
      issueDate: "2026-05-18",
      lines: [],
    });

    expect(result.success).toBe(false);
  });
});
