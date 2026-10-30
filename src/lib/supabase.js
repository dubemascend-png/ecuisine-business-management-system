import { createClient } from '@supabase/supabase-js';

// Publishable keys are designed for browser use. Database access is protected by RLS.
const SUPABASE_URL = 'https://wxkszyhclynpzxcnsdyf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_v4iQSg65u80AWtkmr4lVNQ_0rU9oAnZ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});