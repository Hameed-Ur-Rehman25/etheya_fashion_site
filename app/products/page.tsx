'use client'

import { useState, useMemo } from 'react'
import { Filter, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { SimpleProductGrid } from '@/components/simple-product-grid'
import { Footer } from '@/components/footer'
import { SectionContainer } from '@/components/section-container'
import { ProductFilterSidebar } from '@/components/product-filter-sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { PRODUCTS } from '@/src/data/products.data'
import { SORT_OPTIONS, PRICE_RANGES } from '@/lib/constants'
import { Product, SearchFilters } from '@/types'
import { filterProducts, sortProducts } from '@/lib/product-utils'

export default function ProductsPage() {
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set())
  const [viewMode] = useState<'simple'>('simple')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    sizes: [],
    availability: [],
    types: [],
    fabrics: [],
    pieces: [],
    priceRange: [PRICE_RANGES.MIN, PRICE_RANGES.MAX],
    sortBy: 'newest'
  })

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = filterProducts(PRODUCTS, filters)
    return sortProducts(filtered, filters.sortBy)
  }, [filters])

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      availability: [],
      types: [],
      fabrics: [],
      pieces: [],
      priceRange: [PRICE_RANGES.MIN, PRICE_RANGES.MAX],
      sortBy: 'newest'
    })
  }

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }))
  }

  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product)
  }

  const handleToggleWishlist = (product: Product) => {
    setWishlistedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(product.id)) {
        newSet.delete(product.id)
      } else {
        newSet.add(product.id)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16">
        <SectionContainer>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
            <p className="text-gray-600">
              Showing {filteredAndSortedProducts.length} of {PRODUCTS.length} products
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <ProductFilterSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={clearAllFilters}
                />
              </div>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <SheetHeader className="p-6 pb-0">
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Filter products by category, size, price, and more
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <ProductFilterSidebar
                          filters={filters}
                          onFiltersChange={handleFiltersChange}
                          onClearFilters={clearAllFilters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* View Mode Toggle */}
                  <div className="flex border rounded-lg p-1">
                    <Button
                      variant="default"
                      size="sm"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Sort Dropdown */}
                <Select value={filters.sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Grid */}
              <SimpleProductGrid
                products={filteredAndSortedProducts}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistedIds={wishlistedIds}
                emptyStateMessage="No products match your current filters"
                columns={4}
              />
            </div>
          </div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  )
}
