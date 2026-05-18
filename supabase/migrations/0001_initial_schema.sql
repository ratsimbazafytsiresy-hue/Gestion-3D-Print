create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'member');
create type public.project_status as enum (
  'nouveau',
  'devis_envoye',
  'valide',
  'en_production',
  'en_controle',
  'livre',
  'termine',
  'annule'
);
create type public.project_priority as enum ('basse', 'normale', 'haute', 'urgente');
create type public.stage_status as enum ('a_faire', 'en_cours', 'termine', 'bloque');
create type public.task_status as enum ('a_faire', 'en_cours', 'termine');
create type public.material_type as enum ('PLA', 'PETG', 'ABS', 'TPU', 'ASA');
create type public.document_type as enum ('quote', 'invoice');
create type public.quote_status as enum ('brouillon', 'envoye', 'accepte', 'refuse');
create type public.invoice_status as enum ('brouillon', 'envoyee', 'payee', 'en_retard', 'annulee');
create type public.expense_category as enum ('matieres', 'sous_traitance', 'transport', 'main_oeuvre', 'autres');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade unique,
  full_name text not null,
  email text not null,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null,
  description text not null,
  status public.project_status not null default 'nouveau',
  priority public.project_priority not null default 'normale',
  start_date date not null,
  delivery_date date not null,
  estimated_amount numeric(12, 2) not null default 0 check (estimated_amount >= 0),
  technology text not null default 'FDM' check (technology = 'FDM'),
  material public.material_type not null,
  estimated_print_time_minutes integer not null default 0 check (estimated_print_time_minutes >= 0),
  material_weight_grams integer not null default 0 check (material_weight_grams >= 0),
  model_file_name text not null default '',
  model_file_path text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint delivery_after_start check (delivery_date >= start_date)
);

create table public.project_stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  position integer not null check (position > 0),
  status public.stage_status not null default 'a_faire',
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, position)
);

create table public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  stage_id uuid references public.project_stages (id) on delete set null,
  title text not null,
  status public.task_status not null default 'a_faire',
  due_date date,
  assigned_to uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  type public.document_type not null,
  number text not null unique,
  status text not null,
  client_id uuid not null references public.clients (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  issue_date date not null,
  due_date date,
  total_excluding_vat numeric(12, 2) not null default 0 check (total_excluding_vat >= 0),
  total_vat numeric(12, 2) not null default 0 check (total_vat >= 0),
  total_including_vat numeric(12, 2) not null default 0 check (total_including_vat >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_status_matches_type check (
    (type = 'quote' and status in ('brouillon', 'envoye', 'accepte', 'refuse'))
    or (type = 'invoice' and status in ('brouillon', 'envoyee', 'payee', 'en_retard', 'annulee'))
  )
);

create table public.document_lines (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  vat_rate numeric(4, 3) not null default 0.2 check (vat_rate >= 0),
  line_total_excluding_vat numeric(12, 2) not null default 0 check (line_total_excluding_vat >= 0),
  line_total_vat numeric(12, 2) not null default 0 check (line_total_vat >= 0),
  line_total_including_vat numeric(12, 2) not null default 0 check (line_total_including_vat >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  category public.expense_category not null,
  date date not null,
  amount numeric(12, 2) not null check (amount > 0),
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_client_id on public.projects (client_id);
create index projects_delivery_date on public.projects (delivery_date);
create index project_stages_project_id on public.project_stages (project_id);
create index project_tasks_project_id on public.project_tasks (project_id);
create index documents_project_id on public.documents (project_id);
create index documents_client_id on public.documents (client_id);
create index expenses_project_id on public.expenses (project_id);

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_stages enable row level security;
alter table public.project_tasks enable row level security;
alter table public.documents enable row level security;
alter table public.document_lines enable row level security;
alter table public.expenses enable row level security;

create policy "authenticated read own profiles"
  on public.profiles for select
  to authenticated
  using (user_id = auth.uid());

create policy "authenticated update own profiles"
  on public.profiles for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "authenticated manage clients"
  on public.clients for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated manage projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated manage project stages"
  on public.project_stages for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated manage project tasks"
  on public.project_tasks for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated manage documents"
  on public.documents for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated manage document lines"
  on public.document_lines for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated manage expenses"
  on public.expenses for all
  to authenticated
  using (true)
  with check (true);
