import { describe, expect, it } from "vitest";

import { filterProjects, sortProjectsByDeliveryDate } from "./filters";
import { projects } from "./fixtures";

describe("project filters", () => {
  it("filters projects by production status", () => {
    expect(filterProjects(projects, { status: "en_production" }).map((project) => project.id)).toEqual([
      "project-boitier-electronique",
    ]);
  });

  it("filters projects by PETG material", () => {
    expect(filterProjects(projects, { material: "PETG" }).map((project) => project.id)).toEqual([
      "project-boitier-electronique",
      "project-support-capteur",
    ]);
  });

  it("filters projects by query", () => {
    expect(filterProjects(projects, { query: "capteur" }).map((project) => project.id)).toEqual([
      "project-support-capteur",
    ]);
  });

  it("sorts projects by delivery date ascending", () => {
    expect(sortProjectsByDeliveryDate(projects).at(0)?.id).toBe("project-piece-validation-pla");
  });
});
