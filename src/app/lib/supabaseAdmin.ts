import { createClient } from '@supabase/supabase-js'

// 👇 SAFE INITIALIZATION
// We add '|| "placeholder"' so Docker doesn't scream when the key is missing.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service_role_placeholder'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})