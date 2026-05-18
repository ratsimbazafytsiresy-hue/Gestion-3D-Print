import { ProjectList } from "@/features/projects/project-list";
import { getProjectsData } from "@/lib/data/repository";

export default function ProjectsPage() {
  return <ProjectList {...getProjectsData()} />;
}
