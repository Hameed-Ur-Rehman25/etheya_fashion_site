
export const SUPABASE_CONFIG = {
  url: 'https://ttdmlatdeedeeookbhyw.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZG1sYXRkZWVkZWVvb2tiaHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjkyODUsImV4cCI6MjA3MjAwNTI4NX0.Ar0kV44Q-QHiux7l_DhI63lvFWqDxcNFd9V1f16q--w'
} as const

// Security: Validate configuration
export function validateSupabaseConfig() {
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    throw new Error('Invalid Supabase configuration')
  }
  
  // Security: Validate URL format
  try {
    new URL(SUPABASE_CONFIG.url)
  } catch {
    throw new Error('Invalid Supabase URL format')
  }
  
  // Security: Validate key format (basic JWT structure check)
  if (!SUPABASE_CONFIG.anonKey.includes('.')) {
    throw new Error('Invalid Supabase key format')
  }
}

// Security: Export only what's necessary
export type SupabaseConfig = typeof SUPABASE_CONFIG
