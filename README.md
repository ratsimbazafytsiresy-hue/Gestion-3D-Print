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
