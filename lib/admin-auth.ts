import { supabase, supabaseAdmin } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AdminUser {
  id: string
  email: string
  created_at: string
  updated_at: string
}

// Check if user is admin
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single()

    return !error && !!data
  } catch {
    return false
  }
}

// Admin login
export async function adminLogin(email: string, password: string) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Login failed')
    }

    // Check if user is admin
    const isUserAdmin = await isAdmin(authData.user.id)
    if (!isUserAdmin) {
      await supabase.auth.signOut()
      throw new Error('Access denied. Admin privileges required.')
    }

    return { user: authData.user, session: authData.session }
  } catch (error) {
    throw error
  }
}

// Admin logout
export async function adminLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

// Get current admin user
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const isUserAdmin = await isAdmin(user.id)
    if (!isUserAdmin) return null

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !data) return null

    return data
  } catch {
    return null
  }
}

// Create admin user
export async function createAdminUser(email: string, password: string): Promise<AdminUser> {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Failed to create user')
    }

    // Add to admin_users table
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .insert([{ id: authData.user.id, email }])
      .select()
      .single()

    if (adminError || !adminData) {
      // Cleanup auth user if admin creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw new Error(adminError?.message || 'Failed to create admin user')
    }

    return adminData
  } catch (error) {
    throw error
  }
}

// Delete admin user
export async function deleteAdminUser(userId: string): Promise<void> {
  try {
    // Remove from admin_users table
    const { error: adminError } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('id', userId)

    if (adminError) {
      throw new Error(adminError.message)
    }

    // Delete auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authError) {
      throw new Error(authError.message)
    }
  } catch (error) {
    throw error
  }
}

// List all admin users
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    throw error
  }
}
