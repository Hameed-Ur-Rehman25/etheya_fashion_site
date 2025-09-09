import { useState, useEffect, useCallback } from 'react'
import { Product } from '../types/product.types'
import { SearchFilters } from '@/types'
import { filterProducts, sortProducts, searchProducts } from '../utils/product.utils'
import { DatabaseService } from '@/lib/database-service'

interface UseProductsOptions {
  initialProducts?: Product[]
  initialFilters?: SearchFilters
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>(options.initialProducts || [])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters>(
    options.initialFilters || {
      categories: [],
      subCategories: [],
      sizes: [],
      availability: [],
      types: [],
      fabrics: [],
      pieces: [],
      priceRange: [0, 50000],
      sortBy: 'newest'
    }
  )
  const [searchQuery, setSearchQuery] = useState('')

  // Load products from Supabase on component mount
  useEffect(() => {
    loadProductsFromSupabase()
  }, [])

  // Apply filters and search whenever products, filters, or search query changes
  useEffect(() => {
    let result = [...products]
    
    // Apply search first
    if (searchQuery.trim()) {
      result = searchProducts(result, searchQuery)
    }
    
    // Apply filters
    result = filterProducts(result, filters)
    
    // Apply sorting
    result = sortProducts(result, filters.sortBy)
    
    setFilteredProducts(result)
  }, [products, filters, searchQuery])

  const loadProductsFromSupabase = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Use the new filtering method if we have active filters
      if (filters.categories.length > 0 || filters.subCategories.length > 0 || 
          filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) {
        
        const { data: supabaseProducts, error: supabaseError } = await DatabaseService.getProductsWithFilters({
          categories: filters.categories.length > 0 ? filters.categories : undefined,
          subCategories: filters.subCategories.length > 0 ? filters.subCategories : undefined,
          priceRange: filters.priceRange[0] > 0 || filters.priceRange[1] < 50000 ? filters.priceRange : undefined
        })
        
        if (supabaseError) {
          throw new Error(supabaseError.message)
        }
        
        if (supabaseProducts) {
          setProducts(supabaseProducts)
        } else {
          setProducts([])
        }
      } else {
        // Load all products if no filters are active
        const { data: supabaseProducts, error: supabaseError } = await DatabaseService.getProducts()
        
        if (supabaseError) {
          throw new Error(supabaseError.message)
        }
        
        if (supabaseProducts) {
          setProducts(supabaseProducts)
        } else {
          setProducts([])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products from database')
      // Fallback to empty array if database fails
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [filters.categories, filters.subCategories, filters.priceRange])

  // Reload products when filters change (for backend filtering)
  useEffect(() => {
    loadProductsFromSupabase()
  }, [loadProductsFromSupabase])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      categories: [],
      subCategories: [],
      sizes: [],
      availability: [],
      types: [],
      fabrics: [],
      pieces: [],
      priceRange: [0, 50000],
      sortBy: 'newest'
    })
    setSearchQuery('')
  }, [])

  const loadProducts = useCallback(async (productData: Product[]) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))
      setProducts(productData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product])
  }, [])

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    )
  }, [])

  const removeProduct = useCallback((id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }, [])

  return {
    // Data
    products,
    filteredProducts,
    loading,
    error,
    filters,
    searchQuery,
    
    // Actions
    setProducts,
    setSearchQuery,
    updateFilters,
    clearFilters,
    loadProducts,
    loadProductsFromSupabase, // New method to reload from Supabase
    addProduct,
    updateProduct,
    removeProduct,
    
    // Computed values
    totalCount: filteredProducts.length,
    hasFilters: filters.categories.length > 0 || 
                filters.sizes.length > 0 || 
                filters.priceRange[0] > 0 || 
                filters.priceRange[1] < 50000 ||
                searchQuery.trim().length > 0
  }
}
