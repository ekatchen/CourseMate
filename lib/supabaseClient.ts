import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Service role client — only used in server-side code (admin actions, server components).
// Never import this in client components.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  isSupabaseConfigured && serviceRoleKey
    ? createClient(supabaseUrl!, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;
