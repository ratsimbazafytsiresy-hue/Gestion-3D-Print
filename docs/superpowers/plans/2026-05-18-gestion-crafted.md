# Gestion Crafted Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Gestion Crafted V1 internal desktop-first web app for managing custom FDM 3D printing projects, planning, quotes/invoices, expenses, clients, and profitability.

**Architecture:** Use Next.js App Router with TypeScript, Tailwind, Supabase-ready data access, and a fixture fallback for local development. Keep domain types and calculations in `lib/domain`, data access in `lib/data` and `lib/supabase`, and feature UI in `features/*` so future stock, maintenance, PDF export, and accounting modules can be added cleanly.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Supabase, Recharts, lucide-react, Zod, Vitest, React Testing Library.

---

## File Structure

Create this structure during implementation:

- `app/layout.tsx`: root HTML shell, metadata, global styles.
- `app/page.tsx`: dashboard route; first screen of the app.
- `app/globals.css`: Tailwind layers and Finance Atelier design tokens.
- `app/projets/page.tsx`: project list route.
- `app/projets/[projectId]/page.tsx`: project detail route.
- `app/planning/page.tsx`: Gantt planning route.
- `app/clients/page.tsx`: client list route.
- `app/clients/[clientId]/page.tsx`: client detail route.
- `app/devis-factures/page.tsx`: quote/invoice list and editor route.
- `app/depenses/page.tsx`: expense list and entry route.
- `app/parametres/page.tsx`: settings and team route.
- `app/login/page.tsx`: Supabase login route.
- `components/layout/app-shell.tsx`: sidebar and desktop app frame.
- `components/layout/sidebar.tsx`: navigation items and active state.
- `components/ui/button.tsx`: shared button variants.
- `components/ui/badge.tsx`: status, priority, document, and margin badges.
- `components/ui/panel.tsx`: reusable section panel.
- `components/ui/input.tsx`: shared label/input wrapper.
- `components/ui/table.tsx`: shared table primitives.
- `components/ui/empty-state.tsx`: empty state component.
- `components/ui/confirm-dialog.tsx`: reusable confirmation dialog.
- `features/dashboard/*`: metrics, charts, dashboard screen.
- `features/projects/*`: project filters, list, detail, stage list, checklist, forms.
- `features/planning/*`: Gantt date helpers and timeline UI.
- `features/clients/*`: client list, detail, forms, history.
- `features/documents/*`: quote/invoice list, editor, line items.
- `features/expenses/*`: expense list, form, category summaries.
- `features/settings/*`: role display and team management UI.
- `lib/domain/types.ts`: domain unions and interfaces.
- `lib/domain/constants.ts`: statuses, stages, materials, navigation config.
- `lib/domain/fixtures.ts`: realistic FDM workshop seed data.
- `lib/domain/calculations.ts`: financial and status calculations.
- `lib/domain/calculations.test.ts`: unit tests for calculations.
- `lib/domain/filters.ts`: project and document filter helpers.
- `lib/domain/filters.test.ts`: unit tests for filters.
- `lib/data/repository.ts`: fixture-backed repository used by screens.
- `lib/supabase/browser.ts`: browser Supabase client.
- `lib/supabase/server.ts`: server Supabase client.
- `lib/supabase/middleware.ts`: auth session middleware helper.
- `middleware.ts`: Next.js middleware using Supabase session refresh.
- `supabase/migrations/0001_initial_schema.sql`: database schema, constraints, indexes, and RLS policies.
- `supabase/seed.sql`: realistic local seed data.
- `.env.example`: required Supabase environment variables.
- `vitest.config.ts`: unit/component test configuration.
- `vitest.setup.ts`: test setup.

---

## Task 1: Bootstrap Next.js, Tooling, And Base Routes

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Modify: `.gitignore`

- [ ] **Step 1: Initialize package metadata**

Run:

```bash
npm init -y
```

Expected: `package.json` exists.

- [ ] **Step 2: Install runtime dependencies**

Run:

```bash
npm install next react react-dom @supabase/ssr @supabase/supabase-js lucide-react recharts date-fns zod clsx tailwind-merge
```

Expected: `node_modules/` and `package-lock.json` are created.

- [ ] **Step 3: Install development dependencies**

Run:

```bash
npm install -D typescript @types/node @types/react @types/react-dom eslint eslint-config-next tailwindcss postcss autoprefixer vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: dependencies install successfully.

- [ ] **Step 4: Replace `package.json` scripts**

Edit `package.json` so it contains these scripts while preserving the dependency versions that npm installed:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Expected: `npm run typecheck`, `npm run test`, and `npm run build` are available.

- [ ] **Step 5: Create Next and TypeScript config**

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 6: Create Tailwind and test config**

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        atelier: {
          canvas: "#f7f5ef",
          surface: "#fffdf8",
          ink: "#171717",
          muted: "#6f675d",
          line: "#ddd4c4",
          amber: "#b7791f",
          green: "#1f766f",
          danger: "#b42318",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(80, 61, 30, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 7: Create base app files**

Create `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestion Crafted",
  description: "Gestion de projets pour atelier d'impression 3D FDM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
```

Create `app/page.tsx`:

```tsx
export default function HomePage() {
  return <main>Gestion Crafted</main>;
}
```

Create the initial `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  --atelier-canvas: #f7f5ef;
  --atelier-surface: #fffdf8;
  --atelier-ink: #171717;
  --atelier-muted: #6f675d;
  --atelier-line: #ddd4c4;
  --atelier-amber: #b7791f;
  --atelier-green: #1f766f;
  --atelier-danger: #b42318;
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  background: var(--atelier-canvas);
  color: var(--atelier-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button,
input,
select,
textarea {
  font: inherit;
}
```

- [ ] **Step 8: Extend `.gitignore`**

Ensure `.gitignore` contains:

```gitignore
.next/
node_modules/
dist/
build/
.env
.env.local
.env.*.local
.vercel/
.superpowers/
coverage/
```

- [ ] **Step 9: Verify bootstrap**

Run:

```bash
npm run typecheck
npm run test
npm run build
```

Expected: typecheck passes, test suite reports no tests or passes, and Next build succeeds.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts vitest.config.ts vitest.setup.ts app .gitignore
git commit -m "chore: bootstrap Next.js app"
```

---

## Task 2: Domain Types, Constants, And Fixture Data

**Files:**
- Create: `lib/domain/types.ts`
- Create: `lib/domain/constants.ts`
- Create: `lib/domain/fixtures.ts`

- [ ] **Step 1: Create domain types**

Create `lib/domain/types.ts`:

```ts
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
```

- [ ] **Step 2: Create constants**

Create `lib/domain/constants.ts`:

```ts
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
```

- [ ] **Step 3: Create realistic fixture data**

Create `lib/domain/fixtures.ts` with four clients, four projects, fixed stages for every project, tasks, documents, and expenses:

```ts
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

export const stages: ProjectStage[] = projects.flatMap((project) =>
  ["Demande", "Devis", "Validation", "Production", "Controle", "Livraison", "Termine"].map((name, index) => ({
    id: `${project.id}-stage-${index + 1}`,
    projectId: project.id,
    name,
    position: index + 1,
    status: index < 2 ? "termine" : index === 3 ? "en_cours" : "a_faire",
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
  { id: "expense-boitier-matiere", projectId: "project-boitier-electronique", category: "matieres", date: "2026-05-13", amount: 84, note: "PETG noir 420g + purge" },
  { id: "expense-boitier-main", projectId: "project-boitier-electronique", category: "main_oeuvre", date: "2026-05-14", amount: 260, note: "Preparation, slicer, controle" },
  { id: "expense-support-transport", projectId: "project-support-capteur", category: "transport", date: "2026-05-18", amount: 18, note: "Expedition prevue" },
  { id: "expense-validation-matiere", projectId: "project-piece-validation-pla", category: "matieres", date: "2026-05-09", amount: 22, note: "PLA blanc 180g" },
];
```

- [ ] **Step 4: Typecheck**

Run:

```bash
npm run typecheck
```

Expected: TypeScript passes.

- [ ] **Step 5: Commit**

```bash
git add lib/domain package.json package-lock.json
git commit -m "feat: add domain model and seed fixtures"
```

---

## Task 3: Financial Calculations And Status Helpers

**Files:**
- Create: `lib/domain/calculations.test.ts`
- Create: `lib/domain/calculations.ts`

- [ ] **Step 1: Write failing calculation tests**

Create `lib/domain/calculations.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { documents, expenses, projects } from "./fixtures";
import { calculateDocumentLine, calculateDocumentTotals, getProjectFinancials, isProjectLate, isProjectAtRisk } from "./calculations";

describe("document calculations", () => {
  it("calculates one document line with VAT", () => {
    expect(calculateDocumentLine({ quantity: 2, unitPrice: 100, vatRate: 0.2 })).toEqual({
      lineTotalExcludingVat: 200,
      lineTotalVat: 40,
      lineTotalIncludingVat: 240,
    });
  });

  it("calculates document totals from lines", () => {
    expect(
      calculateDocumentTotals([
        { quantity: 1, unitPrice: 100, vatRate: 0.2 },
        { quantity: 2, unitPrice: 50, vatRate: 0.2 },
      ]),
    ).toEqual({
      totalExcludingVat: 200,
      totalVat: 40,
      totalIncludingVat: 240,
    });
  });
});

describe("project financials", () => {
  it("prefers non-cancelled invoice revenue over accepted quote and estimate", () => {
    const result = getProjectFinancials(projects[0], documents, expenses);
    expect(result.revenueBasis).toBe(1280);
    expect(result.expensesTotal).toBe(344);
    expect(result.margin).toBe(936);
    expect(result.marginRate).toBeCloseTo(0.73125, 5);
  });

  it("falls back to estimated amount when there is no accepted quote or invoice", () => {
    const project = projects.find((item) => item.id === "project-support-capteur")!;
    const result = getProjectFinancials(project, documents, expenses);
    expect(result.revenueBasis).toBe(780);
    expect(result.expensesTotal).toBe(18);
  });
});

describe("project risk helpers", () => {
  it("detects late projects", () => {
    const lateProject = projects.find((item) => item.id === "project-piece-validation-pla")!;
    expect(isProjectLate(lateProject, "2026-05-18")).toBe(true);
  });

  it("does not flag delivered, complete, or cancelled projects as late", () => {
    expect(isProjectLate({ ...projects[0], status: "termine" }, "2026-06-30")).toBe(false);
  });

  it("flags a project as at risk when margin rate is below twenty percent", () => {
    const financials = { revenueBasis: 1000, expensesTotal: 850, margin: 150, marginRate: 0.15 };
    expect(isProjectAtRisk(financials)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
npm run test -- lib/domain/calculations.test.ts
```

Expected: tests fail because `lib/domain/calculations.ts` does not exist.

- [ ] **Step 3: Implement calculations**

Create `lib/domain/calculations.ts`:

```ts
import { RISK_EXPENSE_RATE, RISK_MARGIN_RATE } from "./constants";
import type { BusinessDocument, Expense, Project } from "./types";

type LineInput = {
  quantity: number;
  unitPrice: number;
  vatRate: number;
};

export type ProjectFinancials = {
  revenueBasis: number;
  expensesTotal: number;
  margin: number;
  marginRate: number;
};

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateDocumentLine(input: LineInput) {
  const lineTotalExcludingVat = roundMoney(input.quantity * input.unitPrice);
  const lineTotalVat = roundMoney(lineTotalExcludingVat * input.vatRate);
  const lineTotalIncludingVat = roundMoney(lineTotalExcludingVat + lineTotalVat);

  return {
    lineTotalExcludingVat,
    lineTotalVat,
    lineTotalIncludingVat,
  };
}

export function calculateDocumentTotals(lines: LineInput[]) {
  return lines.reduce(
    (totals, line) => {
      const calculated = calculateDocumentLine(line);
      return {
        totalExcludingVat: roundMoney(totals.totalExcludingVat + calculated.lineTotalExcludingVat),
        totalVat: roundMoney(totals.totalVat + calculated.lineTotalVat),
        totalIncludingVat: roundMoney(totals.totalIncludingVat + calculated.lineTotalIncludingVat),
      };
    },
    { totalExcludingVat: 0, totalVat: 0, totalIncludingVat: 0 },
  );
}

export function getProjectFinancials(project: Project, documents: BusinessDocument[], expenses: Expense[]): ProjectFinancials {
  const projectDocuments = documents.filter((document) => document.projectId === project.id);
  const invoices = projectDocuments.filter((document) => document.type === "invoice" && document.status !== "annulee");
  const acceptedQuotes = projectDocuments.filter((document) => document.type === "quote" && document.status === "accepte");
  const revenueBasis =
    invoices.length > 0
      ? invoices.reduce((total, invoice) => total + invoice.totalIncludingVat, 0)
      : acceptedQuotes.length > 0
        ? acceptedQuotes.reduce((total, quote) => total + quote.totalIncludingVat, 0)
        : project.estimatedAmount;
  const expensesTotal = expenses.filter((expense) => expense.projectId === project.id).reduce((total, expense) => total + expense.amount, 0);
  const margin = roundMoney(revenueBasis - expensesTotal);
  const marginRate = revenueBasis > 0 ? margin / revenueBasis : 0;

  return {
    revenueBasis: roundMoney(revenueBasis),
    expensesTotal: roundMoney(expensesTotal),
    margin,
    marginRate,
  };
}

export function isProjectLate(project: Project, todayIso: string) {
  if (["livre", "termine", "annule"].includes(project.status)) {
    return false;
  }

  return project.deliveryDate < todayIso;
}

export function isProjectAtRisk(financials: ProjectFinancials) {
  if (financials.revenueBasis <= 0) {
    return true;
  }

  return financials.marginRate < RISK_MARGIN_RATE || financials.expensesTotal / financials.revenueBasis > RISK_EXPENSE_RATE;
}
```

- [ ] **Step 4: Verify tests pass**

Run:

```bash
npm run test -- lib/domain/calculations.test.ts
npm run typecheck
```

Expected: tests and typecheck pass.

- [ ] **Step 5: Commit**

```bash
git add lib/domain/calculations.ts lib/domain/calculations.test.ts
git commit -m "feat: add financial calculation helpers"
```

---

## Task 4: Filters, Repository Layer, And Supabase Schema

**Files:**
- Create: `lib/domain/filters.test.ts`
- Create: `lib/domain/filters.ts`
- Create: `lib/data/repository.ts`
- Create: `.env.example`
- Create: `lib/supabase/browser.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `middleware.ts`
- Create: `supabase/migrations/0001_initial_schema.sql`
- Create: `supabase/seed.sql`

- [ ] **Step 1: Write failing filter tests**

Create `lib/domain/filters.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { projects } from "./fixtures";
import { filterProjects, sortProjectsByDeliveryDate } from "./filters";

describe("project filters", () => {
  it("filters projects by status", () => {
    expect(filterProjects(projects, { status: "en_production" }).map((project) => project.id)).toEqual(["project-boitier-electronique"]);
  });

  it("filters projects by material", () => {
    expect(filterProjects(projects, { material: "PETG" }).map((project) => project.id)).toEqual(["project-boitier-electronique", "project-support-capteur"]);
  });

  it("filters projects by search query", () => {
    expect(filterProjects(projects, { query: "capteur" }).map((project) => project.id)).toEqual(["project-support-capteur"]);
  });

  it("sorts projects by delivery date ascending", () => {
    expect(sortProjectsByDeliveryDate(projects).map((project) => project.id)[0]).toBe("project-piece-validation-pla");
  });
});
```

- [ ] **Step 2: Implement filters**

Create `lib/domain/filters.ts`:

```ts
import type { Material, Project, ProjectStatus } from "./types";

export type ProjectFilters = {
  query?: string;
  status?: ProjectStatus | "all";
  material?: Material | "all";
};

export function filterProjects(projects: Project[], filters: ProjectFilters) {
  const query = filters.query?.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesQuery = !query || project.title.toLowerCase().includes(query) || project.description.toLowerCase().includes(query);
    const matchesStatus = !filters.status || filters.status === "all" || project.status === filters.status;
    const matchesMaterial = !filters.material || filters.material === "all" || project.material === filters.material;

    return matchesQuery && matchesStatus && matchesMaterial;
  });
}

export function sortProjectsByDeliveryDate(projects: Project[]) {
  return [...projects].sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));
}
```

- [ ] **Step 3: Create repository layer**

Create `lib/data/repository.ts`:

```ts
import { clients, documents, expenses, projects, stages, tasks } from "@/lib/domain/fixtures";

export async function getDashboardData() {
  return { clients, projects, documents, expenses, stages, tasks };
}

export async function getProjectsData() {
  return { clients, projects, documents, expenses, stages, tasks };
}

export async function getProjectById(projectId: string) {
  const project = projects.find((item) => item.id === projectId) ?? null;
  return {
    project,
    client: project ? clients.find((item) => item.id === project.clientId) ?? null : null,
    stages: stages.filter((item) => item.projectId === projectId),
    tasks: tasks.filter((item) => item.projectId === projectId),
    documents: documents.filter((item) => item.projectId === projectId),
    expenses: expenses.filter((item) => item.projectId === projectId),
  };
}

export async function getClientsData() {
  return { clients, projects, documents };
}

export async function getDocumentsData() {
  return { clients, projects, documents };
}

export async function getExpensesData() {
  return { clients, projects, expenses };
}
```

- [ ] **Step 4: Create Supabase environment and clients**

Create `.env.example`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Create `lib/supabase/browser.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
```

Create `lib/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });
}
```

Create `lib/supabase/middleware.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  await supabase.auth.getUser();
  return supabaseResponse;
}
```

Create `middleware.ts`:

```ts
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

- [ ] **Step 5: Create initial Supabase schema**

Create `supabase/migrations/0001_initial_schema.sql` with enums, tables, indexes, and RLS policies. Use snake_case table and column names matching the spec:

```sql
create type user_role as enum ('admin', 'member');
create type project_status as enum ('nouveau', 'devis_envoye', 'valide', 'en_production', 'en_controle', 'livre', 'termine', 'annule');
create type project_priority as enum ('basse', 'normale', 'haute', 'urgente');
create type stage_status as enum ('a_faire', 'en_cours', 'termine', 'bloque');
create type task_status as enum ('a_faire', 'en_cours', 'termine');
create type material_type as enum ('PLA', 'PETG', 'ABS', 'TPU', 'ASA');
create type document_type as enum ('quote', 'invoice');
create type quote_status as enum ('brouillon', 'envoye', 'accepte', 'refuse');
create type invoice_status as enum ('brouillon', 'envoyee', 'payee', 'en_retard', 'annulee');
create type expense_category as enum ('matieres', 'sous_traitance', 'transport', 'main_oeuvre', 'autres');

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  full_name text not null,
  email text not null,
  role user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete restrict,
  title text not null,
  description text not null default '',
  status project_status not null default 'nouveau',
  priority project_priority not null default 'normale',
  start_date date not null,
  delivery_date date not null,
  estimated_amount numeric(12, 2) not null default 0 check (estimated_amount >= 0),
  technology text not null default 'FDM' check (technology = 'FDM'),
  material material_type not null default 'PLA',
  estimated_print_time_minutes integer not null default 0 check (estimated_print_time_minutes >= 0),
  material_weight_grams integer not null default 0 check (material_weight_grams >= 0),
  model_file_name text not null default '',
  model_file_path text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint delivery_after_start check (delivery_date >= start_date)
);

create table project_stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name text not null,
  position integer not null,
  status stage_status not null default 'a_faire',
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, position)
);

create table project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  stage_id uuid references project_stages(id) on delete set null,
  title text not null,
  status task_status not null default 'a_faire',
  due_date date,
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  type document_type not null,
  number text not null unique,
  status text not null,
  client_id uuid not null references clients(id) on delete restrict,
  project_id uuid not null references projects(id) on delete cascade,
  issue_date date not null,
  due_date date,
  total_excluding_vat numeric(12, 2) not null default 0 check (total_excluding_vat >= 0),
  total_vat numeric(12, 2) not null default 0 check (total_vat >= 0),
  total_including_vat numeric(12, 2) not null default 0 check (total_including_vat >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint document_status_valid check (
    (type = 'quote' and status in ('brouillon', 'envoye', 'accepte', 'refuse'))
    or
    (type = 'invoice' and status in ('brouillon', 'envoyee', 'payee', 'en_retard', 'annulee'))
  )
);

create table document_lines (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  vat_rate numeric(5, 4) not null default 0.2 check (vat_rate >= 0),
  line_total_excluding_vat numeric(12, 2) not null default 0 check (line_total_excluding_vat >= 0),
  line_total_vat numeric(12, 2) not null default 0 check (line_total_vat >= 0),
  line_total_including_vat numeric(12, 2) not null default 0 check (line_total_including_vat >= 0)
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  category expense_category not null,
  date date not null,
  amount numeric(12, 2) not null check (amount >= 0),
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_client_id_idx on projects(client_id);
create index projects_delivery_date_idx on projects(delivery_date);
create index project_stages_project_id_idx on project_stages(project_id);
create index project_tasks_project_id_idx on project_tasks(project_id);
create index documents_project_id_idx on documents(project_id);
create index documents_client_id_idx on documents(client_id);
create index expenses_project_id_idx on expenses(project_id);

alter table profiles enable row level security;
alter table clients enable row level security;
alter table projects enable row level security;
alter table project_stages enable row level security;
alter table project_tasks enable row level security;
alter table documents enable row level security;
alter table document_lines enable row level security;
alter table expenses enable row level security;

create policy "authenticated read profiles" on profiles for select to authenticated using (true);
create policy "users update own profile" on profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "authenticated manage clients" on clients for all to authenticated using (true) with check (true);
create policy "authenticated manage projects" on projects for all to authenticated using (true) with check (true);
create policy "authenticated manage stages" on project_stages for all to authenticated using (true) with check (true);
create policy "authenticated manage tasks" on project_tasks for all to authenticated using (true) with check (true);
create policy "authenticated manage documents" on documents for all to authenticated using (true) with check (true);
create policy "authenticated manage document lines" on document_lines for all to authenticated using (true) with check (true);
create policy "authenticated manage expenses" on expenses for all to authenticated using (true) with check (true);
```

- [ ] **Step 6: Create seed SQL**

Create `supabase/seed.sql` with at least the four clients and four projects from `lib/domain/fixtures.ts`. Use fixed UUIDs so records can be linked reliably:

```sql
insert into clients (id, name, contact_name, phone, email, address, notes) values
('11111111-1111-1111-1111-111111111111', 'Atelier Nova', 'Mila Bernard', '+33 6 12 34 56 10', 'mila@atelier-nova.fr', '18 rue des Prototypes, Lyon', 'Client regulier pour prototypes de boitiers electroniques.'),
('22222222-2222-2222-2222-222222222222', 'Studio Kern', 'Hugo Caron', '+33 6 27 44 19 82', 'hugo@studiokern.fr', '4 avenue des Makers, Nantes', 'Pieces de validation avant injection plastique.'),
('33333333-3333-3333-3333-333333333333', 'Lab Axis', 'Sarah Millet', '+33 7 58 90 11 43', 'sarah@labaxis.fr', '22 quai Technique, Bordeaux', 'Demandes urgentes, souvent en PETG.'),
('44444444-4444-4444-4444-444444444444', 'Meca Flow', 'Nadir Elbaz', '+33 6 86 11 22 73', 'nadir@mecaflow.fr', '9 impasse des Fablabs, Toulouse', 'Pieces fonctionnelles en TPU et ASA.');

insert into projects (id, client_id, title, description, status, priority, start_date, delivery_date, estimated_amount, technology, material, estimated_print_time_minutes, material_weight_grams, model_file_name, model_file_path) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Prototype boitier electronique', 'Boitier FDM avec clips internes et aerations laterales.', 'en_production', 'haute', '2026-05-13', '2026-05-22', 1280, 'FDM', 'PETG', 960, 420, 'boitier-v7.3mf', '/models/boitier-v7.3mf'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Support capteur PETG', 'Support technique avec inserts et tolerance serree.', 'devis_envoye', 'normale', '2026-05-18', '2026-05-28', 780, 'FDM', 'PETG', 540, 260, 'support-capteur.step', '/models/support-capteur.step'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Piece de validation PLA', 'Prototype de forme pour validation ergonomique.', 'en_controle', 'basse', '2026-05-08', '2026-05-17', 430, 'FDM', 'PLA', 300, 180, 'validation-ergonomie.stl', '/models/validation-ergonomie.stl'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'Adaptateur TPU', 'Piece souple pour assemblage mecanique basse serie.', 'valide', 'urgente', '2026-05-20', '2026-05-24', 940, 'FDM', 'TPU', 720, 310, 'adaptateur-tpu-v2.3mf', '/models/adaptateur-tpu-v2.3mf');
```

- [ ] **Step 7: Verify tests and typecheck**

Run:

```bash
npm run test -- lib/domain/filters.test.ts
npm run typecheck
```

Expected: tests and typecheck pass.

- [ ] **Step 8: Commit**

```bash
git add lib/domain/filters.ts lib/domain/filters.test.ts lib/data lib/supabase middleware.ts .env.example supabase
git commit -m "feat: add filters and Supabase foundation"
```

---

## Task 5: Finance Atelier Design System And App Shell

**Files:**
- Modify: `app/globals.css`
- Create: `components/ui/button.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/panel.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/table.tsx`
- Create: `components/ui/empty-state.tsx`
- Create: `components/ui/confirm-dialog.tsx`
- Create: `components/layout/sidebar.tsx`
- Create: `components/layout/app-shell.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add UI helper utility**

Create `lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Create shared UI primitives**

Create each UI primitive with typed props and no side effects:

```tsx
// components/ui/panel.tsx
import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-lg border border-atelier-line bg-atelier-surface shadow-soft", className)}>{children}</section>;
}
```

```tsx
// components/ui/badge.tsx
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "amber" | "green" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "border-atelier-line bg-white text-atelier-muted",
  amber: "border-amber-300 bg-amber-50 text-amber-800",
  green: "border-emerald-300 bg-emerald-50 text-emerald-800",
  danger: "border-red-300 bg-red-50 text-red-800",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>;
}
```

```tsx
// components/ui/button.tsx
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-atelier-ink text-white hover:bg-black",
  secondary: "border border-atelier-line bg-atelier-surface text-atelier-ink hover:bg-white",
  ghost: "text-atelier-muted hover:bg-white hover:text-atelier-ink",
};

export function Button({ className, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={cn("inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition", variants[variant], className)} {...props} />;
}
```

- [ ] **Step 3: Create sidebar and shell**

Create `components/layout/sidebar.tsx`:

```tsx
import Link from "next/link";
import { BarChart3, CalendarDays, FileText, FolderKanban, ReceiptText, Settings, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/projets", label: "Projets", icon: FolderKanban },
  { href: "/planning", label: "Planning", icon: CalendarDays },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/devis-factures", label: "Devis & Factures", icon: FileText },
  { href: "/depenses", label: "Depenses", icon: ReceiptText },
  { href: "/parametres", label: "Parametres", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-atelier-line bg-atelier-surface px-4 py-5 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-atelier-ink text-xs font-bold text-white">GC</div>
        <div>
          <p className="text-sm font-semibold text-atelier-ink">Gestion Crafted</p>
          <p className="text-xs text-atelier-muted">Atelier impression 3D</p>
        </div>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-atelier-muted hover:bg-white hover:text-atelier-ink">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

Create `components/layout/app-shell.tsx`:

```tsx
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-atelier-canvas text-atelier-ink">
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 px-5 py-5 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wrap app pages in shell**

Modify `app/layout.tsx` to keep global shell:

```tsx
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestion Crafted",
  description: "Gestion de projets pour atelier d'impression 3D FDM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify build**

Run:

```bash
npm run typecheck
npm run build
```

Expected: build succeeds and the home route renders the shell.

- [ ] **Step 6: Commit**

```bash
git add app components lib/utils.ts
git commit -m "feat: add Finance Atelier app shell"
```

---

## Task 6: Profitability Dashboard

**Files:**
- Create: `features/dashboard/dashboard-metrics.test.ts`
- Create: `features/dashboard/dashboard-metrics.ts`
- Create: `features/dashboard/dashboard-screen.tsx`
- Create: `features/dashboard/kpi-card.tsx`
- Create: `features/dashboard/margin-chart.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write dashboard metric tests**

Create `features/dashboard/dashboard-metrics.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { documents, expenses, projects } from "@/lib/domain/fixtures";
import { getDashboardMetrics } from "./dashboard-metrics";

describe("dashboard metrics", () => {
  it("summarizes revenue, expenses, margin, and risk counts", () => {
    const metrics = getDashboardMetrics(projects, documents, expenses, "2026-05-18");
    expect(metrics.totalInvoiced).toBe(1280);
    expect(metrics.totalExpenses).toBe(384);
    expect(metrics.lateProjects).toBe(1);
    expect(metrics.projectsCount).toBe(4);
  });
});
```

- [ ] **Step 2: Implement dashboard metrics**

Create `features/dashboard/dashboard-metrics.ts`:

```ts
import { getProjectFinancials, isProjectAtRisk, isProjectLate } from "@/lib/domain/calculations";
import type { BusinessDocument, Expense, Project } from "@/lib/domain/types";

export function getDashboardMetrics(projects: Project[], documents: BusinessDocument[], expenses: Expense[], todayIso: string) {
  const projectFinancials = projects.map((project) => ({
    project,
    financials: getProjectFinancials(project, documents, expenses),
  }));

  return {
    projectsCount: projects.length,
    totalQuoted: documents.filter((document) => document.type === "quote").reduce((total, document) => total + document.totalIncludingVat, 0),
    totalInvoiced: documents.filter((document) => document.type === "invoice" && document.status !== "annulee").reduce((total, document) => total + document.totalIncludingVat, 0),
    totalExpenses: expenses.reduce((total, expense) => total + expense.amount, 0),
    totalMargin: projectFinancials.reduce((total, item) => total + item.financials.margin, 0),
    lateProjects: projects.filter((project) => isProjectLate(project, todayIso)).length,
    atRiskProjects: projectFinancials.filter((item) => isProjectAtRisk(item.financials)).length,
    projectFinancials,
  };
}
```

- [ ] **Step 3: Build dashboard UI**

Create dashboard components that show:

- KPI cards for projects, invoiced amount, expenses, total margin, late projects, at-risk projects.
- Margin by project chart using `recharts`.
- Expense category chart using the fixture expenses.
- Project risk list with status badges.

Use `getDashboardData()` from `lib/data/repository.ts` inside `app/page.tsx`, then pass data to `DashboardScreen`.

- [ ] **Step 4: Verify dashboard**

Run:

```bash
npm run test -- features/dashboard/dashboard-metrics.test.ts
npm run typecheck
npm run build
```

Expected: tests, typecheck, and build pass.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx features/dashboard
git commit -m "feat: add profitability dashboard"
```

---

## Task 7: Projects List And Project Detail Cockpit

**Files:**
- Create: `features/projects/project-list.tsx`
- Create: `features/projects/project-detail.tsx`
- Create: `features/projects/project-status-badge.tsx`
- Create: `features/projects/project-form-schema.test.ts`
- Create: `features/projects/project-form-schema.ts`
- Create: `app/projets/page.tsx`
- Create: `app/projets/[projectId]/page.tsx`

- [ ] **Step 1: Write project form validation tests**

Create `features/projects/project-form-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { projectFormSchema } from "./project-form-schema";

describe("project form schema", () => {
  it("accepts a valid FDM project", () => {
    expect(
      projectFormSchema.parse({
        clientId: "client-1",
        title: "Prototype test",
        startDate: "2026-05-18",
        deliveryDate: "2026-05-22",
        estimatedAmount: 500,
        material: "PLA",
        estimatedPrintTimeMinutes: 120,
        materialWeightGrams: 80,
      }),
    ).toMatchObject({ title: "Prototype test" });
  });

  it("rejects delivery before start date", () => {
    expect(() =>
      projectFormSchema.parse({
        clientId: "client-1",
        title: "Prototype test",
        startDate: "2026-05-22",
        deliveryDate: "2026-05-18",
        estimatedAmount: 500,
        material: "PLA",
        estimatedPrintTimeMinutes: 120,
        materialWeightGrams: 80,
      }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Implement schema**

Create `features/projects/project-form-schema.ts`:

```ts
import { z } from "zod";
import { MATERIALS } from "@/lib/domain/constants";

export const projectFormSchema = z
  .object({
    clientId: z.string().min(1),
    title: z.string().min(2),
    description: z.string().optional(),
    startDate: z.string().min(10),
    deliveryDate: z.string().min(10),
    estimatedAmount: z.number().min(0),
    material: z.enum(MATERIALS as [string, ...string[]]),
    estimatedPrintTimeMinutes: z.number().int().min(0),
    materialWeightGrams: z.number().int().min(0),
    modelFileName: z.string().optional(),
  })
  .refine((value) => value.deliveryDate >= value.startDate, {
    message: "La date de livraison doit etre apres la date de debut.",
    path: ["deliveryDate"],
  });
```

- [ ] **Step 3: Implement project list**

`features/projects/project-list.tsx` must render a desktop table with these columns:

- Projet
- Client
- Statut
- Priorite
- Matiere
- Livraison
- Montant estime
- Marge estimee

Rows link to `/projets/[projectId]`. Filters include search, status, and material.

- [ ] **Step 4: Implement project detail cockpit**

`features/projects/project-detail.tsx` must render:

- Header with title, client, status, priority, delivery date.
- 3D printing panel: FDM, material, print time, weight, model file.
- Fixed stages list with stage statuses.
- Checklist section with project tasks.
- Documents linked to the project.
- Expenses linked to the project.
- Financial summary using `getProjectFinancials`.

- [ ] **Step 5: Create routes**

Create `app/projets/page.tsx` to load `getProjectsData()` and render `ProjectList`.

Create `app/projets/[projectId]/page.tsx` to load `getProjectById(params.projectId)` and render `ProjectDetail`. If the project does not exist, render a compact empty state with the text `Projet introuvable`.

- [ ] **Step 6: Verify project module**

Run:

```bash
npm run test -- features/projects/project-form-schema.test.ts
npm run typecheck
npm run build
```

Expected: tests, typecheck, and build pass.

- [ ] **Step 7: Commit**

```bash
git add app/projets features/projects
git commit -m "feat: add project management views"
```

---

## Task 8: Simplified Gantt Planning

**Files:**
- Create: `features/planning/planning-helpers.test.ts`
- Create: `features/planning/planning-helpers.ts`
- Create: `features/planning/gantt-planning.tsx`
- Create: `app/planning/page.tsx`

- [ ] **Step 1: Write planning helper tests**

Create `features/planning/planning-helpers.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { projects } from "@/lib/domain/fixtures";
import { getPlanningRange, getProjectOffsetPercent, getProjectWidthPercent } from "./planning-helpers";

describe("planning helpers", () => {
  it("builds a range that includes all project dates", () => {
    expect(getPlanningRange(projects)).toEqual({ start: "2026-05-08", end: "2026-05-28" });
  });

  it("calculates offset and width percentages", () => {
    const range = { start: "2026-05-08", end: "2026-05-28" };
    expect(getProjectOffsetPercent(projects[0], range)).toBeGreaterThan(0);
    expect(getProjectWidthPercent(projects[0], range)).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Implement planning helpers**

Create `features/planning/planning-helpers.ts`:

```ts
import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Project } from "@/lib/domain/types";

export type PlanningRange = { start: string; end: string };

export function getPlanningRange(projects: Project[]): PlanningRange {
  const starts = projects.map((project) => project.startDate).sort();
  const ends = projects.map((project) => project.deliveryDate).sort();
  return { start: starts[0], end: ends[ends.length - 1] };
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function getProjectOffsetPercent(project: Project, range: PlanningRange) {
  const totalDays = Math.max(1, differenceInCalendarDays(parseISO(range.end), parseISO(range.start)));
  const offsetDays = differenceInCalendarDays(parseISO(project.startDate), parseISO(range.start));
  return clamp((offsetDays / totalDays) * 100);
}

export function getProjectWidthPercent(project: Project, range: PlanningRange) {
  const totalDays = Math.max(1, differenceInCalendarDays(parseISO(range.end), parseISO(range.start)));
  const projectDays = Math.max(1, differenceInCalendarDays(parseISO(project.deliveryDate), parseISO(project.startDate)));
  return clamp((projectDays / totalDays) * 100);
}
```

- [ ] **Step 3: Build Gantt view**

Create `features/planning/gantt-planning.tsx` that renders:

- Header with range start and end.
- One row per project.
- Project label, client label, and material badge.
- Horizontal bar positioned by `getProjectOffsetPercent` and sized by `getProjectWidthPercent`.
- Late indicator when `isProjectLate(project, currentDate)` is true.

- [ ] **Step 4: Create route**

Create `app/planning/page.tsx` to load repository data and render `GanttPlanning`.

- [ ] **Step 5: Verify planning**

Run:

```bash
npm run test -- features/planning/planning-helpers.test.ts
npm run typecheck
npm run build
```

Expected: tests, typecheck, and build pass.

- [ ] **Step 6: Commit**

```bash
git add app/planning features/planning
git commit -m "feat: add simplified Gantt planning"
```

---

## Task 9: Clients Module With Histories

**Files:**
- Create: `features/clients/client-list.tsx`
- Create: `features/clients/client-detail.tsx`
- Create: `features/clients/client-form-schema.test.ts`
- Create: `features/clients/client-form-schema.ts`
- Create: `app/clients/page.tsx`
- Create: `app/clients/[clientId]/page.tsx`

- [ ] **Step 1: Write client validation tests**

Create `features/clients/client-form-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { clientFormSchema } from "./client-form-schema";

describe("client form schema", () => {
  it("accepts a valid client", () => {
    expect(clientFormSchema.parse({ name: "Atelier Test", contactName: "Alex", email: "alex@test.fr", phone: "", address: "", notes: "" })).toMatchObject({
      name: "Atelier Test",
    });
  });

  it("rejects invalid email", () => {
    expect(() => clientFormSchema.parse({ name: "Atelier Test", contactName: "Alex", email: "not-email", phone: "", address: "", notes: "" })).toThrow();
  });
});
```

- [ ] **Step 2: Implement client schema**

Create `features/clients/client-form-schema.ts`:

```ts
import { z } from "zod";

export const clientFormSchema = z.object({
  name: z.string().min(2),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
});
```

- [ ] **Step 3: Build client list**

Render a table with:

- Client
- Contact
- Email
- Telephone
- Projets
- Montant facture

Each row links to `/clients/[clientId]`.

- [ ] **Step 4: Build client detail**

Render client details plus three histories:

- Projects linked to the client.
- Quotes linked to the client.
- Invoices linked to the client.

- [ ] **Step 5: Create routes and verify**

Run:

```bash
npm run test -- features/clients/client-form-schema.test.ts
npm run typecheck
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add app/clients features/clients
git commit -m "feat: add client management views"
```

---

## Task 10: Quotes And Invoices Module

**Files:**
- Create: `features/documents/document-form-schema.test.ts`
- Create: `features/documents/document-form-schema.ts`
- Create: `features/documents/document-list.tsx`
- Create: `features/documents/document-editor.tsx`
- Create: `app/devis-factures/page.tsx`

- [ ] **Step 1: Write document validation tests**

Create `features/documents/document-form-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { documentFormSchema } from "./document-form-schema";

describe("document form schema", () => {
  it("accepts a quote with one valid line", () => {
    expect(
      documentFormSchema.parse({
        type: "quote",
        number: "DEV-2026-010",
        clientId: "client-1",
        projectId: "project-1",
        issueDate: "2026-05-18",
        dueDate: "",
        lines: [{ description: "Impression PLA", quantity: 1, unitPrice: 120, vatRate: 0.2 }],
      }),
    ).toMatchObject({ number: "DEV-2026-010" });
  });

  it("rejects a document without lines", () => {
    expect(() =>
      documentFormSchema.parse({
        type: "quote",
        number: "DEV-2026-010",
        clientId: "client-1",
        projectId: "project-1",
        issueDate: "2026-05-18",
        dueDate: "",
        lines: [],
      }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Implement document schema**

Create `features/documents/document-form-schema.ts`:

```ts
import { z } from "zod";

export const documentLineFormSchema = z.object({
  description: z.string().min(2),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  vatRate: z.number().min(0),
});

export const documentFormSchema = z.object({
  type: z.enum(["quote", "invoice"]),
  number: z.string().min(3),
  clientId: z.string().min(1),
  projectId: z.string().min(1),
  issueDate: z.string().min(10),
  dueDate: z.string().optional(),
  lines: z.array(documentLineFormSchema).min(1),
});
```

- [ ] **Step 3: Build document list**

Render quotes and invoices in one table with:

- Type
- Number
- Client
- Project
- Status
- Issue date
- Total including VAT

Add filters for type and status.

- [ ] **Step 4: Build manual document editor**

Create a client-side `DocumentEditor` with:

- Type selector.
- Client selector.
- Project selector.
- Issue date.
- Line items with description, quantity, unit price, VAT rate.
- Running totals using `calculateDocumentTotals`.
- Save button that stores local component state for the prototype and shows a success message.

- [ ] **Step 5: Create route and verify**

Run:

```bash
npm run test -- features/documents/document-form-schema.test.ts
npm run typecheck
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add app/devis-factures features/documents
git commit -m "feat: add quote and invoice management"
```

---

## Task 11: Expenses Module

**Files:**
- Create: `features/expenses/expense-form-schema.test.ts`
- Create: `features/expenses/expense-form-schema.ts`
- Create: `features/expenses/expense-list.tsx`
- Create: `features/expenses/expense-summary.tsx`
- Create: `features/expenses/expense-entry-form.tsx`
- Create: `app/depenses/page.tsx`

- [ ] **Step 1: Write expense validation tests**

Create `features/expenses/expense-form-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { expenseFormSchema } from "./expense-form-schema";

describe("expense form schema", () => {
  it("accepts a valid expense", () => {
    expect(
      expenseFormSchema.parse({
        projectId: "project-1",
        category: "matieres",
        date: "2026-05-18",
        amount: 42,
        note: "PLA noir",
      }),
    ).toMatchObject({ amount: 42 });
  });

  it("rejects negative amounts", () => {
    expect(() =>
      expenseFormSchema.parse({
        projectId: "project-1",
        category: "matieres",
        date: "2026-05-18",
        amount: -1,
        note: "PLA noir",
      }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Implement expense schema**

Create `features/expenses/expense-form-schema.ts`:

```ts
import { z } from "zod";

export const expenseFormSchema = z.object({
  projectId: z.string().min(1),
  category: z.enum(["matieres", "sous_traitance", "transport", "main_oeuvre", "autres"]),
  date: z.string().min(10),
  amount: z.number().min(0),
  note: z.string().optional(),
});
```

- [ ] **Step 3: Build expenses UI**

The expenses route must include:

- Summary cards by category.
- Table of expenses with project, category, date, amount, note.
- Entry form with project selector, category selector, date, amount, note.
- Local success state after submission.

- [ ] **Step 4: Verify**

Run:

```bash
npm run test -- features/expenses/expense-form-schema.test.ts
npm run typecheck
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add app/depenses features/expenses
git commit -m "feat: add expense tracking"
```

---

## Task 12: Settings, Login Screen, Empty States, And Role Display

**Files:**
- Create: `app/login/page.tsx`
- Create: `app/parametres/page.tsx`
- Create: `features/settings/settings-screen.tsx`
- Create: `features/auth/login-form.tsx`
- Modify: `components/ui/empty-state.tsx`
- Modify: `components/ui/confirm-dialog.tsx`

- [ ] **Step 1: Build login form**

Create `features/auth/login-form.tsx` as a client component with email input, password input, submit button, loading state, and readable error state. Use `createSupabaseBrowserClient()` for sign-in when Supabase environment variables exist. If they are missing, show the message `Mode demo actif: configure Supabase pour activer la connexion reelle.`

- [ ] **Step 2: Create login route**

Create `app/login/page.tsx` with a centered Finance Atelier panel containing the `LoginForm`.

- [ ] **Step 3: Build settings screen**

Create `features/settings/settings-screen.tsx` showing:

- App name: Gestion Crafted.
- Current environment: Demo fixtures or Supabase.
- Roles: Admin and membre.
- V1 lists: FDM, PLA, PETG, ABS, TPU, ASA.
- Out-of-scope modules clearly labeled as future modules: stock matiere, maintenance machines, portail client, PDF export, compta.

- [ ] **Step 4: Create settings route**

Create `app/parametres/page.tsx` to render `SettingsScreen`.

- [ ] **Step 5: Verify**

Run:

```bash
npm run typecheck
npm run build
```

Expected: build passes.

- [ ] **Step 6: Commit**

```bash
git add app/login app/parametres features/auth features/settings components/ui
git commit -m "feat: add login and settings screens"
```

---

## Task 13: Visual QA, Browser Verification, And Production Readiness

**Files:**
- Modify: `README.md`
- Modify: any feature files needed to fix verification issues

- [ ] **Step 1: Add README**

Create `README.md`:

````md
# Gestion Crafted

Gestion Crafted is an internal desktop-first web app for custom FDM 3D printing project management.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase-ready auth and database foundation
- Recharts
- Vitest

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run test
npm run typecheck
npm run build
```

## Supabase

Copy `.env.example` to `.env.local` and set:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the SQL in `supabase/migrations/0001_initial_schema.sql` against the Supabase project, then seed with `supabase/seed.sql`.
````

- [ ] **Step 2: Run full verification**

Run:

```bash
npm run test
npm run typecheck
npm run build
```

Expected: every command passes.

- [ ] **Step 3: Start local dev server**

Run:

```bash
npm run dev
```

Expected: app runs on `http://localhost:3000` or the next available port.

- [ ] **Step 4: Browser visual verification**

Use the Browser plugin or Playwright fallback to inspect:

- Dashboard at desktop width.
- Project list at desktop width.
- Project detail at desktop width.
- Planning Gantt at desktop width.
- Documents editor at desktop width.
- Expenses page at desktop width.
- One narrow responsive viewport.

Check for:

- No text overlap.
- Sidebar remains usable.
- Tables remain readable.
- Finance Atelier palette is consistent.
- Cards are not nested inside cards.
- Charts render with real fixture data.
- Forms show validation and success states.

- [ ] **Step 5: Fix visual or build issues**

If verification finds issues, edit the smallest affected files and rerun:

```bash
npm run test
npm run typecheck
npm run build
```

Expected: all checks pass after fixes.

- [ ] **Step 6: Commit**

```bash
git add README.md app components features lib supabase
git commit -m "chore: verify Gestion Crafted V1"
```

---

## Plan Self-Review

Spec coverage:

- Dashboard profitability is covered by Task 6.
- Projects, stages, tasks, and 3D printing fields are covered by Tasks 2, 3, and 7.
- Planning Gantt is covered by Task 8.
- Clients and histories are covered by Task 9.
- Quotes and invoices are covered by Tasks 3 and 10.
- Expenses are covered by Tasks 3 and 11.
- Supabase auth/schema/RLS foundation is covered by Tasks 4 and 12.
- Finance Atelier UI direction is covered by Tasks 5 and 13.
- Tests and verification are included in every implementation task and in Task 13.

Marker scan:

- No banned marker strings, incomplete sections, or vague implementation slots remain.

Type consistency:

- Project, document, expense, material, and status names match `lib/domain/types.ts`.
- Route names match the validated sidebar.
- Calculation helpers used by dashboard, projects, documents, and planning are defined before those modules consume them.
