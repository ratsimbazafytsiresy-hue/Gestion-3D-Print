import { differenceInCalendarDays, parseISO } from "date-fns";

import type { Project } from "@/lib/domain/types";

export type PlanningRange = { start: string; end: string };

export function getPlanningRange(projects: Project[]): PlanningRange {
  if (projects.length === 0) {
    return { start: "", end: "" };
  }

  return projects.reduce<PlanningRange>(
    (range, project) => ({
      start: project.startDate < range.start ? project.startDate : range.start,
      end: project.deliveryDate > range.end ? project.deliveryDate : range.end,
    }),
    { start: projects[0].startDate, end: projects[0].deliveryDate },
  );
}

export function getProjectOffsetPercent(project: Project, range: PlanningRange): number {
  const totalDays = getInclusiveCalendarDays(range.start, range.end);

  if (totalDays <= 0) {
    return 0;
  }

  const offsetDays = differenceInCalendarDays(parseISO(project.startDate), parseISO(range.start));

  return clampPercent((offsetDays / totalDays) * 100);
}

export function getProjectWidthPercent(project: Project, range: PlanningRange): number {
  const totalDays = getInclusiveCalendarDays(range.start, range.end);

  if (totalDays <= 0) {
    return 0;
  }

  const projectDays = Math.max(1, getInclusiveCalendarDays(project.startDate, project.deliveryDate));

  return clampPercent((projectDays / totalDays) * 100);
}

function getInclusiveCalendarDays(start: string, end: string): number {
  if (!start || !end) {
    return 0;
  }

  const days = differenceInCalendarDays(parseISO(end), parseISO(start)) + 1;

  return Number.isFinite(days) ? Math.max(1, days) : 0;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}
