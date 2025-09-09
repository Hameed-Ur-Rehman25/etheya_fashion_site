import { supabase } from './supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

// Security: Authentication service with proper error handling
export class AuthService {
  // Security: Get current user session
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Error getting current user:', error.message)
        return null
      }
      
      return user
    } catch (error) {
      console.error('Unexpected error getting current user:', error)
      return null
    }
  }

  // Security: Get current session
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting current session:', error.message)
        return null
      }
      
      return session
    } catch (error) {
      console.error('Unexpected error getting current session:', error)
      return null
    }
  }

  // Security: Sign up with email and password
  static async signUp(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Security: Email confirmation required
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/confirm` : undefined
        }
      })
      
      return { user: data.user, error }
    } catch (error) {
      console.error('Unexpected error during sign up:', error)
      return { user: null, error: error as AuthError }
    }
  }

  // Security: Sign in with email and password
  static async signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      return { user: data.user, error }
    } catch (error) {
      console.error('Unexpected error during sign in:', error)
      return { user: null, error: error as AuthError }
    }
  }

  // Security: Sign out
  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Unexpected error during sign out:', error)
      return { error: error as AuthError }
    }
  }

  // Security: Reset password
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : undefined
      })
      
      return { error }
    } catch (error) {
      console.error('Unexpected error during password reset:', error)
      return { error: error as AuthError }
    }
  }

  // Security: Update user profile
  static async updateProfile(updates: { [key: string]: any }): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.updateUser(updates)
      
      return { user: data.user, error }
    } catch (error) {
      console.error('Unexpected error updating profile:', error)
      return { user: null, error: error as AuthError }
    }
  }

  // Security: Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Security: Export only the service class
export default AuthService
