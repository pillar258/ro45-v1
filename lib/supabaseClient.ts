import { createClient as createBrowserClient } from '@/utils/supabase/client'

export function getSupabaseClient() {
  return createBrowserClient()
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
