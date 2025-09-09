// Supabase Services Index
// This file provides a centralized export for all Supabase-related services

// Core Supabase client
export { default as supabase, type SupabaseClient } from './supabase'

// Configuration
export { SUPABASE_CONFIG, validateSupabaseConfig, type SupabaseConfig } from './supabase-config'

// Services
export { default as AuthService } from './auth-service'
export { default as DatabaseService } from './database-service'
export { default as StorageService } from './storage-service'

// Re-export Supabase types for convenience
// Note: These types are available when @supabase/supabase-js is properly installed
export type {
  User,
  Session,
  AuthError,
  PostgrestError
} from '@supabase/supabase-js'

// Alternative: If you encounter type issues, you can comment out the above export
// and use the types directly from the services where needed
