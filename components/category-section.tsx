'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SectionContainer } from './section-container'
import { DatabaseService } from '@/lib/database-service'
import { CATEGORIES } from '@/lib/constants'

interface Category {
  id: string
  title: string
  description: string
  slug: string
  image: string
  productCount?: number
  featured?: boolean
}

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data, error } = await DatabaseService.getCategoriesWithImages()
        
        if (error) {
          console.error('Error fetching categories:', error)
          // Check if it's a table not found error
          if (error.code === '42P01') {
            setError('Categories table not found - using default categories')
          } else {
            setError('Failed to load categories from database')
          }
          // Keep using fallback categories from constants
          setCategories(CATEGORIES)
        } else if (data && data.length > 0) {
          setCategories(data)
          setError(null)
        } else {
          // Fallback to constants if no data
          setError('No categories found - using default categories')
          setCategories(CATEGORIES)
        }
      } catch (err) {
        console.error('Unexpected error fetching categories:', err)
        setError('Unexpected error - using default categories')
        setCategories(CATEGORIES)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <SectionContainer padding="xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-80 rounded-lg"></div>
            </div>
          ))}
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer padding="xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
        {error && (
          <p className="text-sm text-amber-600 mb-4">
            {error} - Showing default categories
          </p>
        )}
        {/* <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our diverse collection of premium fashion categories, 
          each crafted with attention to detail and style
        </p> */}
      </div>
      
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
                height={650}
                className="object-cover w-full h-110 group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{category.description}</p>
                  
                  <Link href={`/products?category=${category.slug}`}>
                    <Button 
                      variant="outline" 
                      className="relative bg-white text-black border-white transition-all duration-300 overflow-hidden
                        before:absolute before:inset-0 before:bg-black before:translate-x-[-100%] before:transition-transform before:duration-500 before:ease-out
                        hover:before:translate-x-0 hover:text-white hover:border-black z-10
                        after:absolute after:inset-0 after:bg-white after:translate-x-[100%] after:transition-transform after:duration-500 after:ease-out after:z-[-1]"
                    >
                      <span className="relative z-20">Shop Now</span>
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
