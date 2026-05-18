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
