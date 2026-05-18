import { DEFAULT_STAGE_NAMES } from "./constants";
import type { BusinessDocument, Client, Expense, Project, ProjectStage, ProjectTask } from "./types";

export const clients: Client[] = [
  {
    id: "client-atelier-nova",
    name: "Atelier Nova",
    contactName: "Mila Bernard",
    phone: "+33 6 12 34 56 10",
    email: "mila@atelier-nova.fr",
    address: "18 rue des Prototypes, Lyon",
    notes: "Client regulier pour prototypes de boitiers electroniques.",
  },
  {
    id: "client-studio-kern",
    name: "Studio Kern",
    contactName: "Hugo Caron",
    phone: "+33 6 27 44 19 82",
    email: "hugo@studiokern.fr",
    address: "4 avenue des Makers, Nantes",
    notes: "Pieces de validation avant injection plastique.",
  },
  {
    id: "client-lab-axis",
    name: "Lab Axis",
    contactName: "Sarah Millet",
    phone: "+33 7 58 90 11 43",
    email: "sarah@labaxis.fr",
    address: "22 quai Technique, Bordeaux",
    notes: "Demandes urgentes, souvent en PETG.",
  },
  {
    id: "client-meca-flow",
    name: "Meca Flow",
    contactName: "Nadir Elbaz",
    phone: "+33 6 86 11 22 73",
    email: "nadir@mecaflow.fr",
    address: "9 impasse des Fablabs, Toulouse",
    notes: "Pieces fonctionnelles en TPU et ASA.",
  },
];

export const projects: Project[] = [
  {
    id: "project-boitier-electronique",
    clientId: "client-atelier-nova",
    title: "Prototype boitier electronique",
    description: "Boitier FDM avec clips internes et aerations laterales.",
    status: "en_production",
    priority: "haute",
    startDate: "2026-05-13",
    deliveryDate: "2026-05-22",
    estimatedAmount: 1280,
    technology: "FDM",
    material: "PETG",
    estimatedPrintTimeMinutes: 960,
    materialWeightGrams: 420,
    modelFileName: "boitier-v7.3mf",
    modelFilePath: "/models/boitier-v7.3mf",
  },
  {
    id: "project-support-capteur",
    clientId: "client-lab-axis",
    title: "Support capteur PETG",
    description: "Support technique avec inserts et tolerance serree.",
    status: "devis_envoye",
    priority: "normale",
    startDate: "2026-05-18",
    deliveryDate: "2026-05-28",
    estimatedAmount: 780,
    technology: "FDM",
    material: "PETG",
    estimatedPrintTimeMinutes: 540,
    materialWeightGrams: 260,
    modelFileName: "support-capteur.step",
    modelFilePath: "/models/support-capteur.step",
  },
  {
    id: "project-piece-validation-pla",
    clientId: "client-studio-kern",
    title: "Piece de validation PLA",
    description: "Prototype de forme pour validation ergonomique.",
    status: "en_controle",
    priority: "basse",
    startDate: "2026-05-08",
    deliveryDate: "2026-05-17",
    estimatedAmount: 430,
    technology: "FDM",
    material: "PLA",
    estimatedPrintTimeMinutes: 300,
    materialWeightGrams: 180,
    modelFileName: "validation-ergonomie.stl",
    modelFilePath: "/models/validation-ergonomie.stl",
  },
  {
    id: "project-adaptateur-tpu",
    clientId: "client-meca-flow",
    title: "Adaptateur TPU",
    description: "Piece souple pour assemblage mecanique basse serie.",
    status: "valide",
    priority: "urgente",
    startDate: "2026-05-20",
    deliveryDate: "2026-05-24",
    estimatedAmount: 940,
    technology: "FDM",
    material: "TPU",
    estimatedPrintTimeMinutes: 720,
    materialWeightGrams: 310,
    modelFileName: "adaptateur-tpu-v2.3mf",
    modelFilePath: "/models/adaptateur-tpu-v2.3mf",
  },
];

const getDefaultStageStatus = (index: number): ProjectStage["status"] => {
  if (index < 2) {
    return "termine";
  }

  if (index === 3) {
    return "en_cours";
  }

  return "a_faire";
};

export const stages: ProjectStage[] = projects.flatMap((project) =>
  DEFAULT_STAGE_NAMES.map((name, index) => ({
    id: `${project.id}-stage-${index + 1}`,
    projectId: project.id,
    name,
    position: index + 1,
    status: getDefaultStageStatus(index),
    startDate: null,
    endDate: null,
  })),
);

export const tasks: ProjectTask[] = [
  {
    id: "task-boitier-slicer",
    projectId: "project-boitier-electronique",
    stageId: "project-boitier-electronique-stage-4",
    title: "Verifier orientation et supports dans le slicer",
    status: "termine",
    dueDate: "2026-05-14",
    assignedTo: "member-demo",
  },
  {
    id: "task-boitier-controle",
    projectId: "project-boitier-electronique",
    stageId: "project-boitier-electronique-stage-5",
    title: "Controler clips internes et dimensions",
    status: "a_faire",
    dueDate: "2026-05-21",
    assignedTo: "member-demo",
  },
  {
    id: "task-support-devis",
    projectId: "project-support-capteur",
    stageId: "project-support-capteur-stage-2",
    title: "Relancer validation devis",
    status: "en_cours",
    dueDate: "2026-05-20",
    assignedTo: "admin-demo",
  },
];

export const documents: BusinessDocument[] = [
  {
    id: "doc-dev-2026-001",
    type: "quote",
    number: "DEV-2026-001",
    status: "accepte",
    clientId: "client-atelier-nova",
    projectId: "project-boitier-electronique",
    issueDate: "2026-05-12",
    dueDate: null,
    totalExcludingVat: 1066.67,
    totalVat: 213.33,
    totalIncludingVat: 1280,
    lines: [
      {
        id: "line-dev-2026-001-1",
        documentId: "doc-dev-2026-001",
        description: "Preparation fichier et impression PETG",
        quantity: 1,
        unitPrice: 1066.67,
        vatRate: 0.2,
        lineTotalExcludingVat: 1066.67,
        lineTotalVat: 213.33,
        lineTotalIncludingVat: 1280,
      },
    ],
  },
  {
    id: "doc-fac-2026-001",
    type: "invoice",
    number: "FAC-2026-001",
    status: "envoyee",
    clientId: "client-atelier-nova",
    projectId: "project-boitier-electronique",
    issueDate: "2026-05-15",
    dueDate: "2026-06-15",
    totalExcludingVat: 1066.67,
    totalVat: 213.33,
    totalIncludingVat: 1280,
    lines: [
      {
        id: "line-fac-2026-001-1",
        documentId: "doc-fac-2026-001",
        description: "Prototype boitier electronique",
        quantity: 1,
        unitPrice: 1066.67,
        vatRate: 0.2,
        lineTotalExcludingVat: 1066.67,
        lineTotalVat: 213.33,
        lineTotalIncludingVat: 1280,
      },
    ],
  },
];

export const expenses: Expense[] = [
  {
    id: "expense-boitier-matiere",
    projectId: "project-boitier-electronique",
    category: "matieres",
    date: "2026-05-13",
    amount: 84,
    note: "PETG noir 420g + purge",
  },
  {
    id: "expense-boitier-main",
    projectId: "project-boitier-electronique",
    category: "main_oeuvre",
    date: "2026-05-14",
    amount: 260,
    note: "Preparation, slicer, controle",
  },
  {
    id: "expense-support-transport",
    projectId: "project-support-capteur",
    category: "transport",
    date: "2026-05-18",
    amount: 18,
    note: "Expedition prevue",
  },
  {
    id: "expense-validation-matiere",
    projectId: "project-piece-validation-pla",
    category: "matieres",
    date: "2026-05-09",
    amount: 22,
    note: "PLA blanc 180g",
  },
];
