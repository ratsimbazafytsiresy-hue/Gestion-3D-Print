import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const seedSql = readFileSync("supabase/seed.sql", "utf8");

describe("Supabase seed", () => {
  it("covers the V1 operational tables, not only clients and projects", () => {
    for (const tableName of [
      "project_stages",
      "project_tasks",
      "documents",
      "document_lines",
      "expenses",
    ]) {
      expect(seedSql).toContain(`insert into public.${tableName}`);
    }
  });
});
