import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://pzhuszyyykususkmzpud.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_rOOgbfNSW4VbmmJPmMDK6Q_qj0lY6rQ';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase env vars missing! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
