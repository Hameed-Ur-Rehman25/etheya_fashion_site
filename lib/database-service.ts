import { supabase } from './supabase'
import type { PostgrestError } from '@supabase/supabase-js'

// Security: Database service with proper error handling and validation
export class DatabaseService {
  // Security: Generic error handler
  private static handleError(error: PostgrestError | null, operation: string): PostgrestError | null {
    if (error) {
      console.error(`Database error during ${operation}:`, error.message)
      // Security: Don't expose internal database details to client
      if (error.details) {
        console.error('Error details:', error.details)
      }
      if (error.hint) {
        console.error('Error hint:', error.hint)
      }
    }
    return error
  }

  // Security: Generic query wrapper with error handling
  private static async executeQuery<T>(
    queryBuilder: any, // Supabase query builder
    operation: string
  ): Promise<{ data: T | null; error: PostgrestError | null }> {
    try {
      // Execute the query and get the result
      const result = await queryBuilder
      result.error = this.handleError(result.error, operation)
      return result
    } catch (error) {
      console.error(`Unexpected error during ${operation}:`, error)
      return { data: null, error: error as PostgrestError }
    }
  }

  // Security: Products table operations
  static async getProducts() {
    return this.executeQuery(
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }),
      'getProducts'
    )
  }

  static async getProductById(id: number) {
    return this.executeQuery(
      supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single(),
      'getProductById'
    )
  }

  static async getProductsByCategory(category: string) {
    return this.executeQuery(
      supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false }),
      'getProductsByCategory'
    )
  }

  static async getFeaturedProducts() {
    return this.executeQuery(
      supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false }),
      'getFeaturedProducts'
    )
  }

  // Security: Categories table operations
  static async getCategories() {
    return this.executeQuery(
      supabase
        .from('categories')
        .select('*')
        .order('title', { ascending: true }),
      'getCategories'
    )
  }

  static async getCategoryBySlug(slug: string) {
    return this.executeQuery(
      supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single(),
      'getCategoryBySlug'
    )
  }

  // Security: Search products with input validation
  static async searchProducts(query: string, limit: number = 20) {
    // Security: Input validation
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return { data: null, error: { message: 'Invalid search query', code: 'INVALID_INPUT' } as PostgrestError }
    }

    if (limit < 1 || limit > 100) {
      limit = 20 // Security: Default to safe limit
    }

    return this.executeQuery(
      supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit)
        .order('created_at', { ascending: false }),
      'searchProducts'
    )
  }

  // Security: Pagination with safe limits
  static async getProductsPaginated(page: number = 1, pageSize: number = 12) {
    // Security: Input validation
    if (page < 1) page = 1
    if (pageSize < 1 || pageSize > 50) pageSize = 12 // Security: Safe default

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    return this.executeQuery(
      supabase
        .from('products')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false }),
      'getProductsPaginated'
    )
  }
}

// Security: Export only the service class
export default DatabaseService
