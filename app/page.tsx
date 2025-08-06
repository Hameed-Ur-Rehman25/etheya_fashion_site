import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Heart, ShoppingBag, User, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { CategorySection } from '@/components/category-section'
import { NewArrivalsCarousel } from '@/components/new-arrivals-carousel'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <CategorySection />
        <NewArrivalsCarousel />
      </main>

      {/* Product Grid Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden bg-gray-50 rounded-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt={`Brown traditional outfit ${i + 1}`}
                    width={300}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4 text-center">
                  <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2 text-sm">
                    Shop Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 text-gray-800">All Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden bg-gray-50 rounded-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt={`Traditional outfit ${i + 1}`}
                    width={300}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium text-gray-800 mb-1">Traditional Outfit</h3>
                  <p className="text-sm text-gray-600 mb-2">Premium Collection</p>
                  <p className="text-lg font-semibold text-gray-900 mb-3">$299</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
              View More
            </Button>
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

      {/* This Week Top 4 */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 text-gray-800">This Week Top 4</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden bg-gray-50 rounded-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt={`Top seller ${i + 1}`}
                    width={300}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium text-gray-800 mb-1">Best Seller</h3>
                  <p className="text-lg font-semibold text-gray-900">$349</p>
                </div>
              </div>
            ))}
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
