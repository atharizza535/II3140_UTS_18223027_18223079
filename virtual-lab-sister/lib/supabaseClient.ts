// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce', // Use PKCE flow for better security
  },
})

// Helper to check if Supabase is configured
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined')
}

// Helper for debugging
if (typeof window !== 'undefined') {
  console.log('🔧 Supabase Client Initialized:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    configured: isSupabaseConfigured()
  })
}