import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG, validateSupabaseConfig } from './supabase-config'

// Security: Validate configuration before creating client
validateSupabaseConfig()

// Create Supabase client with security configurations
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    // Security: Auto refresh tokens
    autoRefreshToken: true,
    // Security: Persist session in localStorage (configurable)
    persistSession: true,
    // Security: Detect session in URL
    detectSessionInUrl: true,
    // Security: Flow type for authentication (PKCE for enhanced security)
    flowType: 'pkce'
  },
  // Security: Global headers for additional security
  global: {
    headers: {
      'X-Client-Info': 'etheya-fashion-site',
      'X-Client-Version': '1.0.0'
    }
  },
  // Security: Real-time configuration with rate limiting
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  // Security: Database configuration
  db: {
    schema: 'public'
  }
})

// Export types for better TypeScript support
export type SupabaseClient = typeof supabase

// Security: Export client instance only
export default supabase
