const SUPABASE_URL_KEY = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_ANON_KEY = "NEXT_PUBLIC_SUPABASE_ANON_KEY";

export type SupabaseEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseEnv(): SupabaseEnv {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const missingKeys = [
      !supabaseUrl ? SUPABASE_URL_KEY : null,
      !supabaseAnonKey ? SUPABASE_ANON_KEY : null,
    ].filter(Boolean);

    throw new Error(`Missing Supabase environment variable(s): ${missingKeys.join(", ")}.`);
  }

  return { supabaseUrl, supabaseAnonKey };
}
