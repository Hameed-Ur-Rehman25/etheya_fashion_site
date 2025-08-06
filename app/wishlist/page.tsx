'use client'

import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'

const wishlistItems = [
  {
    id: 1,
    title: 'Embroidered Lawn Suit',
    price: 7560,
    image: '/placeholder.svg?height=400&width=300',
    category: 'Unstitched'
  },
  {
    id: 2,
    title: 'Silk Formal Dress',
    price: 12500,
    image: '/placeholder.svg?height=400&width=300',
    category: 'Formal'
  },
  {
    id: 3,
    title: 'Cotton Kurta Set',
    price: 4200,
    image: '/placeholder.svg?height=400&width=300',
    category: 'Ready to Wear'
  },
  {
    id: 4,
    title: 'Designer Palazzo Set',
    price: 8900,
    image: '/placeholder.svg?height=400&width=300',
    category: 'Ready to Wear'
  },
  {
    id: 5,
    title: 'Chiffon Party Wear',
    price: 15000,
    image: '/placeholder.svg?height=400&width=300',
    category: 'Formal'
  },
  {
    id: 6,
    title: 'Luxury Lawn Collection',
    price: 9800,
    image: '/placeholder.svg?height=400&width=300',
    category: 'Luxury Lawn'
  }
]

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
              My Wishlist
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Save your favorite items and never lose track of what you love
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding items you love to your wishlist
              </p>
              <Button
                size="lg"
                className="fill-button bg-gray-900 text-white hover:bg-gray-800 px-8 py-3"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white rounded-lg overflow-hidden border"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={300}
                        height={400}
                        className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Remove from Wishlist Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white text-red-500 hover:text-red-600 shadow-md"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </Button>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xl font-bold text-gray-900 mb-4">
                        Rs. {item.price.toLocaleString()}
                      </p>
                      
                      <div className="flex space-x-3">
                        <Button
                          className="flex-1 fill-button bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          className="px-4 hover:bg-gray-50"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Wishlist Summary */}
              <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
                <h2 className="text-xl font-playfair font-bold text-gray-900 mb-2">
                  Ready to shop?
                </h2>
                <p className="text-gray-600 mb-6">
                  You have {wishlistItems.length} items in your wishlist
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="fill-button bg-gray-900 text-white hover:bg-gray-800 px-8 py-3"
                  >
                    Add All to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-3"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
