import { useState, useEffect, useCallback } from 'react'
import { Product, SearchFilters, ProductFilters } from '../types/product.types'
import { filterProducts, sortProducts, searchProducts } from '../utils/product.utils'

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
      sizes: [],
      priceRange: [0, 50000],
      sortBy: 'newest'
    }
  )
  const [searchQuery, setSearchQuery] = useState('')

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

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      categories: [],
      sizes: [],
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
