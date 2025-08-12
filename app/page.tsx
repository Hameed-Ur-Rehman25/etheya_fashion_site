'use client'

import { useState } from 'react'
import { Navbar } from '@/shared/components/layout/navbar'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { NewArrivalsCarousel } from '@/components/new-arrivals-carousel'
import { ReviewsSection } from '@/components/reviews-section'
import { ProductGrid } from '@/features/products'
import { useCart } from '@/features/cart'
import { useWishlist } from '@/features/wishlist'
import { CartDrawer } from '@/features/cart'
import { SearchModal } from '@/components/search-modal'
import { PRODUCTS } from '@/data/products.data'
import { Button } from '@/shared/components/ui/button'

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const cart = useCart()
  const wishlist = useWishlist()

  // Get featured products for display
  const featuredProducts = PRODUCTS.filter(product => product.featured)
  const allProducts = PRODUCTS.slice(0, 8) // Show first 8 products

  const handleAddToCart = (product: any, size?: string) => {
    cart.addItem(product, size)
    console.log('Added to cart:', product.title)
  }

  const handleToggleWishlist = (product: any) => {
    wishlist.toggleItem(product)
    console.log('Toggled wishlist:', product.title)
  }

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
        {/* Hero Section */}
        <HeroSection />

        {/* Category Section */}
        <CategorySection />

        {/* New Arrivals */}
        <NewArrivalsCarousel />

        {/* Featured Products Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Collection</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our handpicked selection of premium clothing designed for the modern woman
              </p>
            </div>
            
            <ProductGrid
              products={featuredProducts}
              columns={4}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistedIds={wishlist.getWishlistedIds()}
            />
          </div>
        </section>

        {/* Reviews Section */}
        <ReviewsSection />

        {/* All Products Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Collection</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our complete range of elegant designs and contemporary styles
              </p>
            </div>
            
            <ProductGrid
              products={allProducts}
              columns={4}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistedIds={wishlist.getWishlistedIds()}
            />
            
            <div className="text-center mt-12">
              <Button 
                className="bg-black text-white hover:bg-gray-800 px-8 py-3"
                onClick={() => window.location.href = '/products'}
              >
                View All Products
              </Button>
            </div>
          </div>
        </section>
      </main>

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
