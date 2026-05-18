import { GanttPlanning } from "@/features/planning/gantt-planning";
import { getProjectsData } from "@/lib/data/repository";

const PLANNING_TODAY_ISO = "2026-05-18";

export default function PlanningPage() {
  return <GanttPlanning {...getProjectsData()} currentDate={PLANNING_TODAY_ISO} />;
}
