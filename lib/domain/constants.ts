import type { ExpenseCategory, Material, ProjectPriority, ProjectStatus, StageStatus, TaskStatus } from "./types";

export const MATERIALS: Material[] = ["PLA", "PETG", "ABS", "TPU", "ASA"];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  nouveau: "Nouveau",
  devis_envoye: "Devis envoye",
  valide: "Valide",
  en_production: "En production",
  en_controle: "En controle",
  livre: "Livre",
  termine: "Termine",
  annule: "Annule",
};

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  basse: "Basse",
  normale: "Normale",
  haute: "Haute",
  urgente: "Urgente",
};

export const DEFAULT_STAGE_NAMES = ["Demande", "Devis", "Validation", "Production", "Controle", "Livraison", "Termine"] as const;

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  a_faire: "A faire",
  en_cours: "En cours",
  termine: "Termine",
  bloque: "Bloque",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  a_faire: "A faire",
  en_cours: "En cours",
  termine: "Termine",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  matieres: "Matieres",
  sous_traitance: "Sous-traitance",
  transport: "Transport",
  main_oeuvre: "Main-d'oeuvre",
  autres: "Autres",
};

export const DEFAULT_VAT_RATE = 0.2;
export const RISK_MARGIN_RATE = 0.2;
export const RISK_EXPENSE_RATE = 0.8;
