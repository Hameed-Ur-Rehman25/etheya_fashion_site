import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Hardcoded Supabase credentials
const supabaseUrl = 'https://ttdmlatdeedeeookbhyw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZG1sYXRkZWVkZWVvb2tiaHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjkyODUsImV4cCI6MjA3MjAwNTI4NX0.Ar0kV44Q-QHiux7l_DhI63lvFWqDxcNFd9V1f16q--w'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZG1sYXRkZWVkZWVvb2tiaHl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQyOTI4NSwiZXhwIjoyMDcyMDA1Mjg1fQ.MMJliPkCUu0Dn0-T_P4juXQPOS3wFXM2qoG2YPbvjTc'

// For client-side operations
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

// For admin operations (server-side only)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          title: string
          price: string
          image: string
          description: string
          sizes: string[]
          images: string[]
          category: string
          in_stock: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          price: string
          image: string
          description: string
          sizes: string[]
          images: string[]
          category: string
          in_stock?: boolean
          featured?: boolean
        }
        Update: {
          title?: string
          price?: string
          image?: string
          description?: string
          sizes?: string[]
          images?: string[]
          category?: string
          in_stock?: boolean
          featured?: boolean
        }
      }
      categories: {
        Row: {
          id: number
          title: string
          image: string
          description: string
          slug: string
          product_count: number
          featured: boolean
          parent_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          image: string
          description: string
          slug: string
          product_count?: number
          featured?: boolean
          parent_id?: number | null
        }
        Update: {
          title?: string
          image?: string
          description?: string
          slug?: string
          product_count?: number
          featured?: boolean
          parent_id?: number | null
        }
      }
      hero_images: {
        Row: {
          id: number
          src: string
          alt: string
          title: string
          subtitle: string
          button_text: string
          content_position: 'left' | 'right'
          active: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          src: string
          alt: string
          title: string
          subtitle: string
          button_text: string
          content_position: 'left' | 'right'
          active?: boolean
          order_index?: number
        }
        Update: {
          src?: string
          alt?: string
          title?: string
          subtitle?: string
          button_text?: string
          content_position?: 'left' | 'right'
          active?: boolean
          order_index?: number
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
        }
        Update: {
          email?: string
        }
      }
    }
  }
}
