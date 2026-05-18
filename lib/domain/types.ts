export type UserRole = "admin" | "member";
export type ProjectStatus = "nouveau" | "devis_envoye" | "valide" | "en_production" | "en_controle" | "livre" | "termine" | "annule";
export type ProjectPriority = "basse" | "normale" | "haute" | "urgente";
export type StageStatus = "a_faire" | "en_cours" | "termine" | "bloque";
export type TaskStatus = "a_faire" | "en_cours" | "termine";
export type Material = "PLA" | "PETG" | "ABS" | "TPU" | "ASA";
export type DocumentType = "quote" | "invoice";
export type QuoteStatus = "brouillon" | "envoye" | "accepte" | "refuse";
export type InvoiceStatus = "brouillon" | "envoyee" | "payee" | "en_retard" | "annulee";
export type ExpenseCategory = "matieres" | "sous_traitance" | "transport" | "main_oeuvre" | "autres";

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface Client {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  deliveryDate: string;
  estimatedAmount: number;
  technology: "FDM";
  material: Material;
  estimatedPrintTimeMinutes: number;
  materialWeightGrams: number;
  modelFileName: string;
  modelFilePath: string;
}

export interface ProjectStage {
  id: string;
  projectId: string;
  name: string;
  position: number;
  status: StageStatus;
  startDate: string | null;
  endDate: string | null;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  stageId: string | null;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
  assignedTo: string | null;
}

export interface DocumentLine {
  id: string;
  documentId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  lineTotalExcludingVat: number;
  lineTotalVat: number;
  lineTotalIncludingVat: number;
}

export interface BusinessDocument {
  id: string;
  type: DocumentType;
  number: string;
  status: QuoteStatus | InvoiceStatus;
  clientId: string;
  projectId: string;
  issueDate: string;
  dueDate: string | null;
  totalExcludingVat: number;
  totalVat: number;
  totalIncludingVat: number;
  lines: DocumentLine[];
}

export interface Expense {
  id: string;
  projectId: string;
  category: ExpenseCategory;
  date: string;
  amount: number;
  note: string;
}
