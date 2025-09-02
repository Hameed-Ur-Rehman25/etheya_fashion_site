'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { SimpleProductGrid } from '@/components/simple-product-grid'
import { ProductModal } from '@/components/product-modal'

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
import { PRODUCTS, CATEGORIES } from '@/src/data/products.data'
import { SORT_OPTIONS, PRICE_RANGES } from '@/lib/constants'
import { Product, SearchFilters } from '@/types'
import { filterProducts, sortProducts } from '@/lib/product-utils'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('category')
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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

  // Set initial category filter based on URL parameter
  useEffect(() => {
    if (categorySlug) {
      const category = CATEGORIES.find(cat => cat.slug === categorySlug)
      if (category) {
        setFilters(prev => ({
          ...prev,
          categories: [category.title]
        }))
      }
    }
  }, [categorySlug])

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

  const handleProductClick = (product: Product) => {
    console.log('Opening product modal for:', product.title)
    setSelectedProduct(product)
  }

  // Get category title for display
  const currentCategory = categorySlug ? CATEGORIES.find(cat => cat.slug === categorySlug) : null
  const pageTitle = currentCategory ? `${currentCategory.title} Collection` : 'All Products'
  const pageDescription = currentCategory 
    ? `Explore our ${currentCategory.title.toLowerCase()} collection` 
    : `Showing ${filteredAndSortedProducts.length} of ${PRODUCTS.length} products`

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16">
        <SectionContainer>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
            <p className="text-gray-600">
              {pageDescription}
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
                onClick={handleProductClick}
                emptyStateMessage="No products match your current filters"
                columns={4}
              />
            </div>
          </div>
        </SectionContainer>
      </main>

      {/* Footer */}
      <footer id="footer" className="relative bg-black/[0.96] text-white py-16 overflow-hidden">
        {/* Grid pattern background */}
        <div className="pointer-events-none absolute inset-0 [background-size:40px_40px] select-none [background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]" />
        
        {/* Spotlight effect */}
        <div className="absolute -top-40 left-0 md:-top-20 md:left-60 w-[200px] h-[200px] bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Newsletter Section */}
          <div className="text-center mb-12">
            <h2 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-3xl md:text-4xl font-bold text-transparent mb-4">
              WHAT ARE YOU WAITING FOR
            </h2>
            <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about our latest collections, 
              exclusive offers, and fashion updates.
            </p>
            
            <div className="flex justify-center max-w-md mx-auto mb-12">
              <div className="flex space-x-2 w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white text-black border-white/20 px-3 py-2 rounded-md"
                />
                <button className="bg-white text-black hover:bg-gray-100 px-6 py-2 rounded-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-700">
            {/* Contact Us */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-200">Contact Us</h3>
              <div className="space-y-2 text-neutral-400">
                <p>© Etheya | Islamabad Pakistan</p>
                <p>info@etheya.com</p>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-200">Follow Us</h3>
              <div className="space-y-2 text-neutral-400">
                <p>Stay connected for latest updates</p>
                <p>Premium fashion for modern lifestyle</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
