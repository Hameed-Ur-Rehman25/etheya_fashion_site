'use client'

import { useState, useMemo } from 'react'
import { Filter, LayoutGrid, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { SimpleProductGrid } from '@/components/simple-product-grid'
import { Footer } from '@/components/footer'
import { SectionContainer } from '@/components/section-container'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
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
import { PRODUCTS, CATEGORIES, SIZES, COLORS, SORT_OPTIONS, PRICE_RANGES } from '@/lib/constants'
import { Product, SearchFilters } from '@/types'
import { filterProducts, sortProducts } from '@/lib/product-utils'

export default function ProductsPage() {
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set())
  const [viewMode] = useState<'simple'>('simple')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    sizes: [],
    priceRange: [PRICE_RANGES.MIN, PRICE_RANGES.MAX],
    sortBy: 'newest'
  })

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = filterProducts(PRODUCTS, filters)
    return sortProducts(filtered, filters.sortBy)
  }, [filters])

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }))
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      sizes: checked
        ? [...prev.sizes, size]
        : prev.sizes.filter(s => s !== size)
    }))
  }

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }))
  }

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      priceRange: [PRICE_RANGES.MIN, PRICE_RANGES.MAX],
      sortBy: 'newest'
    })
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

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium mb-4">Categories</h3>
        <div className="space-y-3">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.title)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category.title, checked as boolean)
                }
              />
              <label 
                htmlFor={`category-${category.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.title}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-medium mb-4">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={filters.sizes.includes(size)}
                onCheckedChange={(checked) => 
                  handleSizeChange(size, checked as boolean)
                }
              />
              <label 
                htmlFor={`size-${size}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium mb-4">
          Price Range: Rs. {filters.priceRange[0].toLocaleString()} - Rs. {filters.priceRange[1].toLocaleString()}
        </h3>
        <Slider
          value={filters.priceRange}
          onValueChange={handlePriceRangeChange}
          max={PRICE_RANGES.MAX}
          min={PRICE_RANGES.MIN}
          step={PRICE_RANGES.STEP}
          className="w-full"
        />
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-lg font-medium mb-4">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <div
              key={color}
              className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-900 transition-colors"
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={clearAllFilters}
      >
        Clear All Filters
      </Button>
    </div>
  )

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
                <FilterContent />
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
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Filter products by category, size, price, and more
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
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
