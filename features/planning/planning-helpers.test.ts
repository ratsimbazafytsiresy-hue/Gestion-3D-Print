import { describe, expect, test } from "vitest";

import { projects } from "@/lib/domain/fixtures";

import { getPlanningRange, getProjectOffsetPercent, getProjectWidthPercent } from "./planning-helpers";

describe("planning helpers", () => {
  test("gets the planning range from project start and delivery dates", () => {
    expect(getPlanningRange(projects)).toEqual({ start: "2026-05-08", end: "2026-05-28" });
  });

  test("gets positive offset and width percentages for a project inside the range", () => {
    const range = getPlanningRange(projects);

    expect(getProjectOffsetPercent(projects[0], range)).toBeGreaterThan(0);
    expect(getProjectWidthPercent(projects[0], range)).toBeGreaterThan(0);
  });

  test("uses at least one calendar day for same-day projects", () => {
    const [project] = projects;
    const sameDayProject = { ...project, startDate: "2026-05-18", deliveryDate: "2026-05-18" };
    const range = { start: "2026-05-18", end: "2026-05-18" };

    expect(getProjectOffsetPercent(sameDayProject, range)).toBe(0);
    expect(getProjectWidthPercent(sameDayProject, range)).toBe(100);
  });
});
