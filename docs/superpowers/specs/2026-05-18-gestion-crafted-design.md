# Gestion Crafted Design Spec

Date: 2026-05-18
Status: Validated by user
Product: Internal project management web app for a custom FDM 3D printing workshop

## 1. Product Goal

Gestion Crafted is an internal, desktop-first web application for managing custom 3D printing projects from client request to project delivery and profitability tracking.

The V1 focuses on the operational flow:

client -> project/order -> quote/invoice -> Gantt planning -> progress tracking -> expenses -> profitability.

The product is not a full ERP in V1. It must be useful quickly, with an architecture that can later support inventory, machine maintenance, accounting, PDF export, and a client portal.

## 2. Validated V1 Scope

Included in V1:

- Profitability dashboard with quoted revenue, invoiced revenue, expenses, estimated margin, profitable projects, and projects at risk.
- Projects/orders with client, dates, status, estimated amount, fixed stages, custom checklist, and 3D printing fields.
- 3D printing fields for FDM projects: technology, material, estimated print time, material weight, model file reference.
- Planning with a simplified Gantt/timeline view by project.
- Clients with contact details, notes, project history, quote history, and invoice history.
- Manual quote and invoice creation with line items, quantities, unit prices, VAT, totals, status, client link, and project link.
- Expenses by project and business category.
- Internal Supabase authentication with two roles: admin and member.
- Desktop-first UI with responsive behavior for smaller screens.

Explicitly out of V1:

- Advanced material stock management.
- Machine maintenance planning.
- Client portal.
- PDF export for quotes and invoices.
- Full accounting module.
- Multi-company SaaS tenancy.
- Advanced production capacity planning.

The architecture must leave room for these later modules without forcing them into the first release.

## 3. Business Context

The target business is a custom FDM 3D printing workshop.

The first version is optimized for:

- Prototypes and one-off parts.
- Custom client work rather than repeated high-volume production.
- FDM only.
- Built-in material list: PLA, PETG, ABS, TPU, ASA.
- Project profitability as the primary dashboard angle.

## 4. Visual Direction

Validated art direction: Finance Atelier.

This direction is minimal, premium, warm, and analytical. It should feel like a serious management tool for a refined workshop, with a strong emphasis on financial readability.

Visual rules:

- Desktop-first application shell with a left sidebar.
- Light editorial background, not a generic pure-white SaaS template.
- Warm neutral surfaces with subtle borders and restrained shadows.
- Soft black or near-black for structure and primary text.
- Amber accents for financial and important indicators.
- Deep green accents for positive states and healthy margins.
- Compact, readable dashboards and tables.
- No marketing hero page. The first screen is the usable dashboard.
- No decorative blobs, oversized cards, or ornamental UI that slows down scanning.

Core UI surfaces:

- Dashboard with KPI cards, charts, project risk list, and margin overview.
- Project table with filters and status indicators.
- Project detail cockpit with client, dates, 3D printing fields, stages, checklist, documents, and expenses.
- Gantt planning view with project bars, dates, statuses, and late indicators.
- Client detail with history.
- Manual quote/invoice editor.
- Expense entry and expense list.

## 5. Navigation

The main navigation is a left sidebar with these entries:

- Dashboard
- Projets
- Planning
- Clients
- Devis & Factures
- Depenses
- Parametres

The sidebar should stay visible on desktop. On smaller screens it can collapse into a drawer or compact navigation.

## 6. Functional Modules

### Dashboard

The dashboard is profitability-first.

It shows:

- Total quoted amount.
- Total invoiced amount.
- Total project expenses.
- Estimated margin.
- Margin by project.
- Expenses by category.
- Projects at risk.
- Projects late or close to delivery.
- Recent quote and invoice activity.

Charts should be simple and readable. V1 can use bar, line, and donut charts if the underlying data exists.

### Projects

Projects are the center of the application.

Each project includes:

- Client.
- Title.
- Description.
- Status.
- Priority.
- Start date.
- Delivery date.
- Estimated amount.
- FDM technology.
- Material: PLA, PETG, ABS, TPU, ASA.
- Estimated print time.
- Material weight.
- Model file reference.
- Fixed stages.
- Custom checklist tasks.
- Linked quotes and invoices.
- Linked expenses.

Validated project priorities:

- Basse
- Normale
- Haute
- Urgente

Validated project statuses:

- Nouveau
- Devis envoye
- Valide
- En production
- En controle
- Livre
- Termine
- Annule

Validated default stages:

- Demande
- Devis
- Validation
- Production
- Controle
- Livraison
- Termine

Validated stage statuses:

- A faire
- En cours
- Termine
- Bloque

Stages are created automatically when a project is created. Tasks remain customizable per project.

Validated task statuses:

- A faire
- En cours
- Termine

### Planning

The planning view is a simplified Gantt/timeline by project.

It must make it easy to see:

- Project start and delivery dates.
- Current status.
- Late projects.
- Upcoming deliveries.
- Project overlap.
- High-risk projects.

V1 does not need capacity planning by machine or team. Those can be added later.

### Clients

Client records include:

- Name.
- Contact person.
- Phone.
- Email.
- Address.
- Notes.
- Project history.
- Quote history.
- Invoice history.

Clients do not have portal access in V1.

### Quotes And Invoices

V1 includes manual creation of quotes and invoices inside the app.

Documents include:

- Type: quote or invoice.
- Number.
- Status.
- Issue date.
- Due date when relevant.
- Client.
- Project.
- Line items.
- VAT.
- Total excluding VAT.
- Total VAT.
- Total including VAT.

VAT default is 20 percent and can be edited per line.

Document statuses:

- Quote: brouillon, envoye, accepte, refuse.
- Invoice: brouillon, envoyee, payee, en retard, annulee.

PDF export is out of V1 but the data model should support it later.

### Expenses

Expenses are linked to projects.

Expense fields:

- Project.
- Category.
- Date.
- Amount.
- Note.

Validated categories:

- Matieres
- Sous-traitance
- Transport
- Main-d'oeuvre
- Autres

Expenses feed project and global profitability calculations.

### Settings And Auth

Supabase Auth is used for internal team login.

Roles:

- Admin: full access, settings, team management.
- Member: operational access to projects, clients, documents, expenses, and planning.

Data is private to the internal team. No client-facing access in V1.

## 7. Data Model

Main entities:

### Profile

- id
- user_id
- full_name
- email
- role: admin or member
- created_at
- updated_at

### Client

- id
- name
- contact_name
- phone
- email
- address
- notes
- created_at
- updated_at

### Project

- id
- client_id
- title
- description
- status
- priority
- start_date
- delivery_date
- estimated_amount
- technology
- material
- estimated_print_time_minutes
- material_weight_grams
- model_file_name
- model_file_path
- created_at
- updated_at

### ProjectStage

- id
- project_id
- name
- position
- status
- start_date
- end_date
- created_at
- updated_at

### Task

- id
- project_id
- stage_id
- title
- status
- due_date
- assigned_to
- created_at
- updated_at

### Document

- id
- type: quote or invoice
- number
- status
- client_id
- project_id
- issue_date
- due_date
- total_excluding_vat
- total_vat
- total_including_vat
- created_at
- updated_at

### DocumentLine

- id
- document_id
- description
- quantity
- unit_price
- vat_rate
- line_total_excluding_vat
- line_total_vat
- line_total_including_vat

### Expense

- id
- project_id
- category
- date
- amount
- note
- created_at
- updated_at

## 8. Business Rules

- A project belongs to one client.
- A project can have multiple quotes and invoices.
- A project can have multiple expenses.
- Fixed stages are created automatically for every new project.
- The project checklist is customizable.
- Estimated margin is calculated from the relevant quoted or invoiced revenue minus project expenses.
- If non-cancelled invoices exist, their total including VAT is preferred for margin calculations.
- If no non-cancelled invoice exists, accepted quote revenue is used.
- If no accepted quote exists, estimated project amount is used as the fallback.
- A project is late when its delivery date is in the past and its status is not livre, termine, or annule.
- A project is at risk when estimated margin rate is below 20 percent or project expenses exceed 80 percent of the revenue basis.
- Amounts must be positive.
- Document lines must have valid quantity, unit price, and VAT rate.
- Delivery date must not be earlier than start date.
- Client is required for every project.

## 9. Technical Architecture

Validated stack:

- Next.js.
- TypeScript.
- Tailwind CSS.
- Supabase for authentication, database, and row-level security.
- Vercel for deployment.
- Recharts or an equivalent chart library for dashboard charts.
- lucide-react for icons when icon style matches the visual system.

Recommended project structure:

- app/: routes and layouts.
- components/: shared app shell, primitives, tables, forms, cards, timeline, charts.
- features/dashboard/: dashboard UI, metrics queries, chart composition.
- features/projects/: project list, project detail, stages, tasks, project forms.
- features/planning/: Gantt/timeline components.
- features/clients/: client list, client detail, client forms.
- features/documents/: quote and invoice editor, document list, calculation helpers.
- features/expenses/: expense list, expense forms, category helpers.
- lib/supabase/: Supabase browser/server clients.
- lib/calculations/: financial calculations and status helpers.
- lib/types/: shared TypeScript domain types.
- supabase/migrations/: schema and RLS policies.
- supabase/seed.sql: useful seed data for development.

The code should keep UI, domain calculations, and data access separated. Financial calculations must be centralized to avoid inconsistent margins across screens.

## 10. Error Handling And Empty States

Required states:

- Empty dashboard when no data exists.
- Empty project list.
- Empty client list.
- Empty document list.
- Empty expense list.
- Empty filtered results.
- Loading states for tables, dashboard, and forms.
- Error states for Supabase failures.
- Validation errors for forms.
- Permission errors for restricted admin actions.

Sensitive actions require confirmation:

- Delete project.
- Delete client.
- Delete document.
- Cancel invoice.
- Delete expense.

## 11. Testing Strategy

Priority tests:

- Document line total calculations.
- VAT calculations.
- Project margin calculation.
- Project late status.
- Project at-risk status.
- Document status transitions.
- Project filters.
- Planning date helpers.
- Form validation for projects, documents, and expenses.
- Admin/member access behavior.

Visual verification:

- Desktop dashboard.
- Desktop project list.
- Desktop project detail.
- Desktop planning Gantt.
- Document editor.
- Basic responsive behavior on narrower screens.

## 12. Implementation Notes

The first implementation should build a usable app screen, not a landing page.

Seed data should use realistic 3D printing examples, such as:

- Prototype boitier electronique.
- Support capteur PETG.
- Piece de validation PLA.
- Adaptateur TPU.

The UI must stay dense enough for desktop work while remaining calm and readable.

Future modules should be anticipated through clean data boundaries, not implemented early.
