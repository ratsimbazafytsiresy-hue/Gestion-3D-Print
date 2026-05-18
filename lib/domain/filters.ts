import type { Material, Project, ProjectStatus } from "./types";

export type ProjectFilters = {
  query?: string;
  status?: ProjectStatus | "all";
  material?: Material | "all";
};

export function filterProjects(projects: Project[], filters: ProjectFilters) {
  const query = filters.query?.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesQuery =
      !query || project.title.toLowerCase().includes(query) || project.description.toLowerCase().includes(query);
    const matchesStatus = !filters.status || filters.status === "all" || project.status === filters.status;
    const matchesMaterial = !filters.material || filters.material === "all" || project.material === filters.material;

    return matchesQuery && matchesStatus && matchesMaterial;
  });
}

export function sortProjectsByDeliveryDate(projects: Project[]) {
  return [...projects].sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));
}
