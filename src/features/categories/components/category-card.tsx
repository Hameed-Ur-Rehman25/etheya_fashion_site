'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Category } from '../types/category.types'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  category: Category
  variant?: 'default' | 'overlay' | 'minimal'
  className?: string
  showProductCount?: boolean
}

export function CategoryCard({
  category,
  variant = 'default',
  className,
  showProductCount = true
}: CategoryCardProps) {
  if (variant === 'overlay') {
    return (
      <Link href={`/products?category=${category.slug}`}>
        <div className={cn(
          "group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer",
          "transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
          className
        )}>
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
              {category.title}
            </h3>
            <p className="text-sm text-gray-200 mb-3 line-clamp-2">
              {category.description}
            </p>
            {showProductCount && category.productCount && (
              <p className="text-xs text-gray-300">
                {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
              </p>
            )}
            
            {/* Arrow */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'minimal') {
    return (
      <Link 
        href={`/products?category=${category.slug}`}
        className={cn(
          "block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{category.title}</h4>
            {showProductCount && category.productCount && (
              <p className="text-sm text-gray-500">
                {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className={cn(
        "group bg-white rounded-lg border border-gray-200 overflow-hidden",
        "transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300",
        className
      )}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {category.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {category.description}
          </p>
          
          <div className="flex items-center justify-between">
            {showProductCount && category.productCount && (
              <span className="text-xs text-gray-500">
                {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
              </span>
            )}
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}
