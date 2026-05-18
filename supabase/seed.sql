insert into public.clients (id, name, contact_name, phone, email, address, notes)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Atelier Nova',
    'Mila Bernard',
    '+33 6 12 34 56 10',
    'mila@atelier-nova.fr',
    '18 rue des Prototypes, Lyon',
    'Client regulier pour prototypes de boitiers electroniques.'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Studio Kern',
    'Hugo Caron',
    '+33 6 27 44 19 82',
    'hugo@studiokern.fr',
    '4 avenue des Makers, Nantes',
    'Pieces de validation avant injection plastique.'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Lab Axis',
    'Sarah Millet',
    '+33 7 58 90 11 43',
    'sarah@labaxis.fr',
    '22 quai Technique, Bordeaux',
    'Demandes urgentes, souvent en PETG.'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Meca Flow',
    'Nadir Elbaz',
    '+33 6 86 11 22 73',
    'nadir@mecaflow.fr',
    '9 impasse des Fablabs, Toulouse',
    'Pieces fonctionnelles en TPU et ASA.'
  )
on conflict (id) do update set
  name = excluded.name,
  contact_name = excluded.contact_name,
  phone = excluded.phone,
  email = excluded.email,
  address = excluded.address,
  notes = excluded.notes,
  updated_at = now();

insert into public.projects (
  id,
  client_id,
  title,
  description,
  status,
  priority,
  start_date,
  delivery_date,
  estimated_amount,
  technology,
  material,
  estimated_print_time_minutes,
  material_weight_grams,
  model_file_name,
  model_file_path
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Prototype boitier electronique',
    'Boitier FDM avec clips internes et aerations laterales.',
    'en_production',
    'haute',
    '2026-05-13',
    '2026-05-22',
    1280,
    'FDM',
    'PETG',
    960,
    420,
    'boitier-v7.3mf',
    '/models/boitier-v7.3mf'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '33333333-3333-3333-3333-333333333333',
    'Support capteur PETG',
    'Support technique avec inserts et tolerance serree.',
    'devis_envoye',
    'normale',
    '2026-05-18',
    '2026-05-28',
    780,
    'FDM',
    'PETG',
    540,
    260,
    'support-capteur.step',
    '/models/support-capteur.step'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    'Piece de validation PLA',
    'Prototype de forme pour validation ergonomique.',
    'en_controle',
    'basse',
    '2026-05-08',
    '2026-05-17',
    430,
    'FDM',
    'PLA',
    300,
    180,
    'validation-ergonomie.stl',
    '/models/validation-ergonomie.stl'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '44444444-4444-4444-4444-444444444444',
    'Adaptateur TPU',
    'Piece souple pour assemblage mecanique basse serie.',
    'valide',
    'urgente',
    '2026-05-20',
    '2026-05-24',
    940,
    'FDM',
    'TPU',
    720,
    310,
    'adaptateur-tpu-v2.3mf',
    '/models/adaptateur-tpu-v2.3mf'
  )
on conflict (id) do update set
  client_id = excluded.client_id,
  title = excluded.title,
  description = excluded.description,
  status = excluded.status,
  priority = excluded.priority,
  start_date = excluded.start_date,
  delivery_date = excluded.delivery_date,
  estimated_amount = excluded.estimated_amount,
  technology = excluded.technology,
  material = excluded.material,
  estimated_print_time_minutes = excluded.estimated_print_time_minutes,
  material_weight_grams = excluded.material_weight_grams,
  model_file_name = excluded.model_file_name,
  model_file_path = excluded.model_file_path,
  updated_at = now();

insert into public.project_stages (project_id, name, position, status, start_date, end_date)
select seed.project_id, seed.name, seed.position, seed.status, null, null
from (
  values
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Demande', 1, 'termine'::public.stage_status),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Devis', 2, 'termine'::public.stage_status),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Validation', 3, 'termine'::public.stage_status),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Production', 4, 'en_cours'::public.stage_status),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Controle', 5, 'a_faire'::public.stage_status),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Livraison', 6, 'a_faire'::public.stage_status),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Termine', 7, 'a_faire'::public.stage_status),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Demande', 1, 'termine'::public.stage_status),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Devis', 2, 'en_cours'::public.stage_status),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Validation', 3, 'a_faire'::public.stage_status),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Production', 4, 'a_faire'::public.stage_status),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Controle', 5, 'a_faire'::public.stage_status),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Livraison', 6, 'a_faire'::public.stage_status),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Termine', 7, 'a_faire'::public.stage_status),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Demande', 1, 'termine'::public.stage_status),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Devis', 2, 'termine'::public.stage_status),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Validation', 3, 'termine'::public.stage_status),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Production', 4, 'termine'::public.stage_status),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Controle', 5, 'en_cours'::public.stage_status),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Livraison', 6, 'a_faire'::public.stage_status),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Termine', 7, 'a_faire'::public.stage_status),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Demande', 1, 'termine'::public.stage_status),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Devis', 2, 'termine'::public.stage_status),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Validation', 3, 'termine'::public.stage_status),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Production', 4, 'a_faire'::public.stage_status),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Controle', 5, 'a_faire'::public.stage_status),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Livraison', 6, 'a_faire'::public.stage_status),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Termine', 7, 'a_faire'::public.stage_status)
) as seed(project_id, name, position, status)
on conflict (project_id, position) do update set
  name = excluded.name,
  status = excluded.status,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  updated_at = now();

insert into public.project_tasks (id, project_id, stage_id, title, status, due_date, assigned_to)
values
  (
    '10000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    (select id from public.project_stages where project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and position = 4),
    'Verifier orientation et supports dans le slicer',
    'termine',
    '2026-05-14',
    null
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    (select id from public.project_stages where project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and position = 5),
    'Controler clips internes et dimensions',
    'a_faire',
    '2026-05-21',
    null
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    (select id from public.project_stages where project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' and position = 2),
    'Relancer validation devis',
    'en_cours',
    '2026-05-20',
    null
  )
on conflict (id) do update set
  project_id = excluded.project_id,
  stage_id = excluded.stage_id,
  title = excluded.title,
  status = excluded.status,
  due_date = excluded.due_date,
  assigned_to = excluded.assigned_to,
  updated_at = now();

insert into public.documents (
  id,
  type,
  number,
  status,
  client_id,
  project_id,
  issue_date,
  due_date,
  total_excluding_vat,
  total_vat,
  total_including_vat
)
values
  (
    '20000000-0000-0000-0000-000000000001',
    'quote',
    'DEV-2026-001',
    'accepte',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '2026-05-12',
    null,
    1066.67,
    213.33,
    1280
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'invoice',
    'FAC-2026-001',
    'envoyee',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '2026-05-15',
    '2026-06-15',
    1066.67,
    213.33,
    1280
  )
on conflict (id) do update set
  type = excluded.type,
  number = excluded.number,
  status = excluded.status,
  client_id = excluded.client_id,
  project_id = excluded.project_id,
  issue_date = excluded.issue_date,
  due_date = excluded.due_date,
  total_excluding_vat = excluded.total_excluding_vat,
  total_vat = excluded.total_vat,
  total_including_vat = excluded.total_including_vat,
  updated_at = now();

insert into public.document_lines (
  id,
  document_id,
  description,
  quantity,
  unit_price,
  vat_rate,
  line_total_excluding_vat,
  line_total_vat,
  line_total_including_vat
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Preparation fichier et impression PETG',
    1,
    1066.67,
    0.2,
    1066.67,
    213.33,
    1280
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    'Prototype boitier electronique',
    1,
    1066.67,
    0.2,
    1066.67,
    213.33,
    1280
  )
on conflict (id) do update set
  document_id = excluded.document_id,
  description = excluded.description,
  quantity = excluded.quantity,
  unit_price = excluded.unit_price,
  vat_rate = excluded.vat_rate,
  line_total_excluding_vat = excluded.line_total_excluding_vat,
  line_total_vat = excluded.line_total_vat,
  line_total_including_vat = excluded.line_total_including_vat,
  updated_at = now();

insert into public.expenses (id, project_id, category, date, amount, note)
values
  (
    '40000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'matieres',
    '2026-05-13',
    84,
    'PETG noir 420g + purge'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'main_oeuvre',
    '2026-05-14',
    260,
    'Preparation, slicer, controle'
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'transport',
    '2026-05-18',
    18,
    'Expedition prevue'
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'matieres',
    '2026-05-09',
    22,
    'PLA blanc 180g'
  )
on conflict (id) do update set
  project_id = excluded.project_id,
  category = excluded.category,
  date = excluded.date,
  amount = excluded.amount,
  note = excluded.note,
  updated_at = now();
