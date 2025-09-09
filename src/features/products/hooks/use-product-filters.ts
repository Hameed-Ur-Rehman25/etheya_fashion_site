import { useState, useCallback } from 'react'
import { SearchFilters } from '../types/product.types'

interface UseProductFiltersOptions {
  initialFilters?: Partial<SearchFilters>
  onFiltersChange?: (filters: SearchFilters) => void
}

export function useProductFilters(options: UseProductFiltersOptions = {}) {
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    subCategories: [],
    sizes: [],
    priceRange: [0, 50000],
    sortBy: 'newest',
    ...options.initialFilters
  })

  const updateCategory = useCallback((category: string, checked: boolean) => {
    setFilters(prev => {
      const newCategories = checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
      
      const newFilters = { ...prev, categories: newCategories }
      options.onFiltersChange?.(newFilters)
      return newFilters
    })
  }, [options])

  const updateSubCategory = useCallback((subCategory: string, checked: boolean) => {
    setFilters(prev => {
      const newSubCategories = checked
        ? [...prev.subCategories, subCategory]
        : prev.subCategories.filter(sc => sc !== subCategory)
      
      const newFilters = { ...prev, subCategories: newSubCategories }
      options.onFiltersChange?.(newFilters)
      return newFilters
    })
  }, [options])

  const updateSize = useCallback((size: string, checked: boolean) => {
    setFilters(prev => {
      const newSizes = checked
        ? [...prev.sizes, size]
        : prev.sizes.filter(s => s !== size)
      
      const newFilters = { ...prev, sizes: newSizes }
      options.onFiltersChange?.(newFilters)
      return newFilters
    })
  }, [options])

  const updatePriceRange = useCallback((priceRange: [number, number]) => {
    setFilters(prev => {
      const newFilters = { ...prev, priceRange }
      options.onFiltersChange?.(newFilters)
      return newFilters
    })
  }, [options])

  const updateSortBy = useCallback((sortBy: SearchFilters['sortBy']) => {
    setFilters(prev => {
      const newFilters = { ...prev, sortBy }
      options.onFiltersChange?.(newFilters)
      return newFilters
    })
  }, [options])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, ...newFilters }
      options.onFiltersChange?.(updatedFilters)
      return updatedFilters
    })
  }, [options])

  const clearAllFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      categories: [],
      subCategories: [],
      sizes: [],
      priceRange: [0, 50000],
      sortBy: 'newest'
    }
    setFilters(clearedFilters)
    options.onFiltersChange?.(clearedFilters)
  }, [options])

  const hasActiveFilters = useCallback(() => {
    return (
      filters.categories.length > 0 ||
      filters.subCategories.length > 0 ||
      filters.sizes.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 50000
    )
  }, [filters])

  const getActiveFiltersCount = useCallback(() => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.subCategories.length > 0) count++
    if (filters.sizes.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) count++
    return count
  }, [filters])

  return {
    filters,
    updateCategory,
    updateSubCategory,
    updateSize,
    updatePriceRange,
    updateSortBy,
    updateFilters,
    clearAllFilters,
    hasActiveFilters: hasActiveFilters(),
    activeFiltersCount: getActiveFiltersCount()
  }
}
