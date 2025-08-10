
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { NewArrivalsCarousel } from '@/components/new-arrivals-carousel'

import { ProductCard } from '@/components/ProductCard'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <CategorySection />
        <NewArrivalsCarousel />
      </main>

      {/* This Week Top 4 */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
              This Week's Top 4
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular pieces this week, handpicked by fashion enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCard
                key={i}
                imageSrc="/placeholder.svg?height=400&width=300"
                alt={`Top seller ${i + 1}`}
                title={`Premium Collection #${i + 1}`}
                description="Elegant design with modern aesthetics"
                price="PKR 34,900"
                oldPrice="PKR 49,900"
                discount="30% OFF"
                showWishlist
                showDiscount
                showOldPrice
                buttonLabel="Add to Cart"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">WHAT ARE YOU WAITING FOR</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about our latest collections, 
            exclusive offers, and fashion updates.
          </p>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 text-gray-800">All Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCard
                key={i}
                imageSrc="/placeholder.svg?height=400&width=300"
                alt={`Traditional outfit ${i + 1}`}
                title="Traditional Outfit"
                description="Premium Collection"
                price="PKR 29,900"
                buttonLabel="Shop Now"
                buttonClass="bg-black text-white hover:bg-gray-800"
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
              View More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Us */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-300">
                <p>© Etheya | Islamabad Pakistan</p>
                <p>info@etheya.com</p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Join our Newsletter</h3>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white text-black"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
