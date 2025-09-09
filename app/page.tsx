
'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { NewArrivalsCarousel } from '@/components/new-arrivals-carousel'
import { SimpleProductGrid } from '@/components/simple-product-grid'
import { SimpleProductCard } from '@/components/simple-product-card'
import { ProductModal } from '@/components/product-modal'
import { Spotlight } from "@/components/ui/spotlight"
import { ReviewsSection } from '@/components/reviews-section'
import { Product } from '@/types'
import { DatabaseService } from '@/lib/database-service'

import { ProductCard } from '@/components/product-card'

export default function HomePage() {
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set())
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products from Supabase on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: supabaseProducts, error } = await DatabaseService.getProducts()
        if (error) {
          console.error('Error fetching products:', error)
          setTopProducts([])
          setAllProducts([])
        } else if (supabaseProducts) {
          // Use the first 4 products for top section
          setTopProducts(supabaseProducts.slice(0, 4))
          // Use the first 8 products for all products section
          setAllProducts(supabaseProducts.slice(0, 8))
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setTopProducts([])
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product.title)
    // Here you would typically add to cart logic
  }

  const handleToggleWishlist = (product: Product) => {
    console.log('Toggle wishlist:', product.title)
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

  const handleProductClick = (product: Product) => {
    console.log('Opening product modal for:', product.title)
    setSelectedProduct(product)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <CategorySection />
        <NewArrivalsCarousel />
      </main>

      {/* This Week Top 4 - mobile: horizontal scroll, desktop: grid */}
      <section className="py-16 px-2 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-playfair font-bold text-gray-900 mb-3 md:mb-4">
              This Week's Top 4
            </h2>
            <p className="text-gray-600 max-w-md md:max-w-2xl mx-auto text-sm md:text-base">
              Discover our most popular pieces this week, handpicked by fashion enthusiasts
            </p>
          </div>
          {/* Mobile: horizontal scroll, Desktop: grid */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-9 md:gap-8 overflow-x-auto scrollbar-hide pb-2">
            {loading ? (
              Array(4).fill(null).map((_, i) => (
                <div key={i} className="animate-pulse min-w-[220px] md:min-w-0">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))
            ) : topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div key={product.id} className="min-w-[220px] md:min-w-0">
                  <SimpleProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    onClick={handleProductClick}
                    isWishlisted={wishlistedIds.has(product.id)}
                  />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-12">
                <p className="text-gray-500">No products available at the moment</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* All Products Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
              All Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of premium fashion pieces
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                         {loading ? (
               // Show loading skeleton
               Array(8).fill(null).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))
            ) : allProducts.length > 0 ? (
              allProducts.map((product) => (
                <SimpleProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onClick={handleProductClick}
                  isWishlisted={wishlistedIds.has(product.id)}
                />
              ))
            ) : (
              // Show empty state
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No products available at the moment</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
                View More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="relative bg-black/[0.96] text-white py-16 overflow-hidden">
        {/* Grid pattern background */}
        <div className="pointer-events-none absolute inset-0 [background-size:40px_40px] select-none [background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]" />
        
        {/* Spotlight effect */}
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />
        
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
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white text-black border-white/20"
                />
                <Button className="bg-white text-black hover:bg-gray-100 px-6">
                  Subscribe
                </Button>
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
