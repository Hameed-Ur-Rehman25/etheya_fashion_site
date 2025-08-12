'use client'

import { useState } from 'react'
import { Filter, LayoutGrid } from 'lucide-react'
import { Navbar } from '@/shared/components/layout/navbar'
import { ProductGrid } from '@/features/products'
import { useProducts, useProductFilters } from '@/features/products'
import { useCart } from '@/features/cart'
import { useWishlist } from '@/features/wishlist'
import { CartDrawer } from '@/features/cart'
import { SearchModal } from '@/components/search-modal'
import { Footer } from '@/components/footer'
import { SectionContainer } from '@/components/section-container'
import { Button } from '@/shared/components/ui/button'
import { Slider } from '@/shared/components/ui/slider'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet'
import { PRODUCTS, CATEGORIES } from '@/data/products.data'
import { SIZES, SORT_OPTIONS, PRICE_RANGES } from '@/shared/constants/app.constants'

export default function ProductsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Initialize products and filters
  const products = useProducts({ 
    initialProducts: PRODUCTS,
    initialFilters: {
      categories: [],
      sizes: [],
      priceRange: [PRICE_RANGES.MIN, PRICE_RANGES.MAX],
      sortBy: 'newest'
    }
  })

  const filters = useProductFilters({
    onFiltersChange: (newFilters) => {
      products.updateFilters(newFilters)
    }
  })

  const cart = useCart()
  const wishlist = useWishlist()

  const handleAddToCart = (product: any, size?: string) => {
    cart.addItem(product, size)
  }

  const handleToggleWishlist = (product: any) => {
    wishlist.toggleItem(product)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
        <div className="space-y-3">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.filters.categories.includes(category.title)}
                onCheckedChange={(checked) => 
                  filters.updateCategory(category.title, checked as boolean)
                }
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.title} ({category.productCount})
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={filters.filters.sizes.includes(size)}
                onCheckedChange={(checked) => 
                  filters.updateSize(size, checked as boolean)
                }
              />
              <label
                htmlFor={`size-${size}`}
                className="text-sm font-medium leading-none"
              >
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={filters.filters.priceRange}
            onValueChange={(value) => filters.updatePriceRange(value as [number, number])}
            max={PRICE_RANGES.MAX}
            min={PRICE_RANGES.MIN}
            step={PRICE_RANGES.STEP}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Rs. {filters.filters.priceRange[0].toLocaleString()}</span>
            <span>Rs. {filters.filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {filters.hasActiveFilters && (
        <Button
          variant="outline"
          onClick={filters.clearAllFilters}
          className="w-full"
        >
          Clear All Filters ({filters.activeFiltersCount})
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        cartItemCount={cart.itemCount}
        wishlistItemCount={wishlist.itemCount}
        onSearchToggle={() => setIsSearchOpen(true)}
        onCartToggle={cart.toggleCart}
        onWishlistClick={() => window.location.href = '/wishlist'}
      />
      
      <main className="pt-16">
        <SectionContainer>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-2">
                Discover our complete collection ({products.totalCount} items)
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <Select
                value={filters.filters.sortBy}
                onValueChange={(value) => filters.updateSortBy(value as any)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden sm:flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="sm:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {filters.hasActiveFilters && (
                      <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {filters.activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Refine your search to find exactly what you're looking for.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 bg-white border rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Filters</h2>
                <FilterContent />
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-9">
              <ProductGrid
                products={products.filteredProducts}
                viewMode={viewMode}
                columns={viewMode === 'grid' ? 3 : 1}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistedIds={wishlist.getWishlistedIds()}
                loading={products.loading}
                emptyStateMessage={
                  products.hasFilters 
                    ? "No products match your current filters" 
                    : "No products found"
                }
              />
            </div>
          </div>
        </SectionContainer>
      </main>

      <Footer />

      {/* Modals and Drawers */}
      <CartDrawer
        isOpen={cart.isOpen}
        onClose={cart.closeCart}
        items={cart.cart.items}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
        totalPrice={cart.cart.totalPrice}
        totalItems={cart.cart.totalItems}
        loading={cart.loading}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  )
}
