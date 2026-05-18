import { clients, documents, expenses, projects, stages, tasks } from "@/lib/domain/fixtures";
import type { BusinessDocument, Client, Expense, Project, ProjectStage, ProjectTask } from "@/lib/domain/types";

export type DashboardData = {
  clients: Client[];
  documents: BusinessDocument[];
  expenses: Expense[];
  projects: Project[];
  stages: ProjectStage[];
  tasks: ProjectTask[];
};

export type ProjectDetailData = {
  project: Project | null;
  client: Client | null;
  stages: ProjectStage[];
  tasks: ProjectTask[];
  documents: BusinessDocument[];
  expenses: Expense[];
};

export function getDashboardData(): DashboardData {
  return { clients, documents, expenses, projects, stages, tasks };
}

export function getProjectsData() {
  return { clients, documents, expenses, projects, stages, tasks };
}

export function getProjectById(projectId: string): ProjectDetailData {
  const project = projects.find((item) => item.id === projectId) ?? null;
  const client = project ? clients.find((item) => item.id === project.clientId) ?? null : null;

  return {
    project,
    client,
    stages: stages.filter((stage) => stage.projectId === projectId),
    tasks: tasks.filter((task) => task.projectId === projectId),
    documents: documents.filter((document) => document.projectId === projectId),
    expenses: expenses.filter((expense) => expense.projectId === projectId),
  };
}

export function getClientsData() {
  return { clients, projects, documents };
}

export function getDocumentsData() {
  return { clients, projects, documents };
}

export function getExpensesData() {
  return { clients, projects, expenses };
}
