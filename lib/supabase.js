import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseSvcRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnon) {
  console.error('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// ── Client-side (browser) — استخدام anon key ─────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ── Server-side — يستخدم service_role للعمليات الإدارية ──────────
// هذا الـ client يتجاوز RLS ويُستخدم فقط في Route Handlers
export function createServerClient() {
  // يفضل service_role، يرجع لـ anon إذا غير موجود
  const key = supabaseSvcRole || supabaseAnon;

  if (!supabaseSvcRole) {
    console.warn('[Supabase] SUPABASE_SERVICE_ROLE_KEY not set — using anon key. Admin writes may fail with RLS.');
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
