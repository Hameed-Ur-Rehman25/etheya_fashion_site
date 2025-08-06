'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SectionContainer } from './section-container'
import { CATEGORIES } from '@/lib/constants'

export function CategorySection() {
  return (
    <SectionContainer padding="xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our diverse collection of premium fashion categories, 
          each crafted with attention to detail and style
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {CATEGORIES.map((category) => (
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
                className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{category.description}</p>
                  
                  <Link href={`/categories/${category.slug}`}>
                    <Button 
                      variant="outline" 
                      className="bg-white text-black hover:bg-gray-100 border-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}
