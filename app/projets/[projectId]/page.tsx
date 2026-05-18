import { ProjectDetail } from "@/features/projects/project-detail";
import { getProjectById } from "@/lib/data/repository";

type ProjectDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;

  return <ProjectDetail data={getProjectById(projectId)} />;
}
