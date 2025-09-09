import { useState, useEffect, useCallback } from 'react'
import { Product } from '../types/product.types'
import { SearchFilters } from '@/types'
import { filterProducts, sortProducts, searchProducts } from '../utils/product.utils'
import { useProductCache } from '@/context/ProductCacheContext'

interface UseProductsOptions {
  initialProducts?: Product[]
  initialFilters?: SearchFilters
}

export function useProducts(options: UseProductsOptions = {}) {
  // Use the global product cache
  const { 
    products: cachedProducts, 
    loading: cacheLoading, 
    error: cacheError,
    refreshCache,
    isCacheValid
  } = useProductCache()
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
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

  // Use cached products or initial products
  const products = cachedProducts.length > 0 ? cachedProducts : (options.initialProducts || [])
  const loading = cacheLoading
  const error = cacheError

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

  // Refresh cache if needed when filters change significantly
  useEffect(() => {
    // Only refresh cache if it's invalid and we have significant filters
    const hasSignificantFilters = filters.categories.length > 0 || 
                                 filters.subCategories.length > 0 || 
                                 filters.priceRange[0] > 0 || 
                                 filters.priceRange[1] < 50000
    
    if (!isCacheValid() && hasSignificantFilters) {
      refreshCache()
    }
  }, [filters.categories, filters.subCategories, filters.priceRange, isCacheValid, refreshCache])

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

  // Force refresh cache
  const loadProducts = useCallback(async (productData?: Product[]) => {
    if (productData) {
      // If product data is provided, we can't directly update the cache
      // This would require extending the cache context
      console.warn('loadProducts with data not supported in cached mode')
    }
    await refreshCache()
  }, [refreshCache])

  // These methods are kept for compatibility but don't modify the global cache
  const addProduct = useCallback((product: Product) => {
    console.warn('addProduct not supported in cached mode - use cache refresh instead')
  }, [])

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    console.warn('updateProduct not supported in cached mode - use cache refresh instead')
  }, [])

  const removeProduct = useCallback((id: number) => {
    console.warn('removeProduct not supported in cached mode - use cache refresh instead')
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
    setSearchQuery,
    updateFilters,
    clearFilters,
    loadProducts, // Now refreshes cache
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
