'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { NewArrivalsCarousel } from '@/components/new-arrivals-carousel'
import { ProductGrid } from '@/components/product-grid'
import { Newsletter } from '@/components/newsletter'
import { Footer } from '@/components/footer'
import { SectionContainer } from '@/components/section-container'
import { ProductModal } from '@/components/product-modal'
import { Button } from '@/components/ui/button'
import { PRODUCTS } from '@/lib/constants'
import { Product } from '@/types'

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set())

  // Get featured products for different sections
  const featuredProducts = PRODUCTS.filter(product => product.featured)
  const allProducts = PRODUCTS.slice(0, 8) // Show first 8 products
  const topProducts = PRODUCTS.slice(0, 4) // Top 4 products

  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart functionality
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
        <HeroSection />
        <CategorySection />
        <NewArrivalsCarousel />

        {/* Featured Products Section */}
        <SectionContainer padding="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-4">Featured Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium pieces that embody elegance and style
            </p>
          </div>
          
          <ProductGrid
            products={featuredProducts}
            onQuickView={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistedIds={wishlistedIds}
          />
        </SectionContainer>

        {/* All Products Section */}
        <SectionContainer padding="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-4">All Products</h2>
            <p className="text-gray-600">Explore our complete collection</p>
          </div>
          
          <ProductGrid
            products={allProducts}
            onQuickView={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistedIds={wishlistedIds}
          />
          
          <div className="text-center mt-12">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
              View More Products
            </Button>
          </div>
        </SectionContainer>

        <Newsletter />

        {/* This Week Top 4 */}
        <SectionContainer padding="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-4">This Week's Top Picks</h2>
            <p className="text-gray-600">Our most popular items this week</p>
          </div>
          
          <ProductGrid
            products={topProducts}
            onQuickView={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistedIds={wishlistedIds}
          />
        </SectionContainer>
      </main>

      <Footer />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
