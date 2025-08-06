'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

const categories = [
  {
    id: 1,
    title: 'UNSTITCHED',
    image: '/placeholder.svg?height=500&width=300',
    description: 'Premium fabric collections'
  },
  {
    id: 2,
    title: 'FORMAL',
    image: '/placeholder.svg?height=500&width=300',
    description: 'Elegant formal wear'
  },
  {
    id: 3,
    title: 'READY TO WEAR',
    image: '/placeholder.svg?height=500&width=300',
    description: 'Contemporary designs'
  },
  {
    id: 4,
    title: 'LUXURY LAWN',
    image: '/placeholder.svg?height=500&width=300',
    description: 'Summer essentials'
  }
]

export function CategorySection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-16 text-gray-900">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  width={300}
                  height={500}
                  className="object-cover w-full h-96 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-xl font-playfair font-bold mb-2">{category.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{category.description}</p>
                  
                  <Button
                    size="sm"
                    className="fill-button bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
