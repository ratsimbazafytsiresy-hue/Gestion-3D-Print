import { Badge, type BadgeProps } from "@/components/ui/badge";
import { PROJECT_STATUS_LABELS } from "@/lib/domain/constants";
import type { ProjectStatus } from "@/lib/domain/types";

type ProjectStatusBadgeProps = {
  status: ProjectStatus;
};

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  return <Badge tone={getProjectStatusTone(status)}>{PROJECT_STATUS_LABELS[status]}</Badge>;
}

export function getProjectStatusTone(status: ProjectStatus): BadgeProps["tone"] {
  if (status === "en_production" || status === "en_controle") {
    return "amber";
  }

  if (status === "livre" || status === "termine") {
    return "green";
  }

  if (status === "annule") {
    return "danger";
  }

  return "neutral";
}
