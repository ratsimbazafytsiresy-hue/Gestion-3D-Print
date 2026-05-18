import { describe, expect, it } from "vitest";

import { clientFormSchema } from "./client-form-schema";

describe("clientFormSchema", () => {
  it("accepts a valid client", () => {
    const result = clientFormSchema.safeParse({
      name: "Atelier Nova",
      contactName: "Mila Bernard",
      email: "mila@atelier-nova.fr",
      phone: "+33 6 12 34 56 10",
      address: "18 rue des Prototypes, Lyon",
      notes: "Client regulier pour prototypes de boitiers electroniques.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = clientFormSchema.safeParse({
      name: "Atelier Nova",
      email: "mila-at-atelier-nova.fr",
    });

    expect(result.success).toBe(false);
  });
});
