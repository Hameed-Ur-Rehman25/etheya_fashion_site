'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Filter, Grid, List, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const products = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 15000) + 3000,
  image: '/placeholder.svg?height=400&width=300',
  category: ['Unstitched', 'Formal', 'Ready to Wear', 'Luxury Lawn'][Math.floor(Math.random() * 4)],
  size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)]
}))

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('newest')

  const categories = ['Unstitched', 'Formal', 'Ready to Wear', 'Luxury Lawn']
  const sizes = ['S', 'M', 'L', 'XL']
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink']

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-playfair font-bold">All Products</h1>
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <div className="flex items-center space-x-2 mb-6">
                  <Filter className="w-5 h-5" />
                  <h2 className="text-lg font-medium">Filters</h2>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Price Range</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={20000}
                    step={500}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Rs. {priceRange[0].toLocaleString()}</span>
                    <span>Rs. {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Category</h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label htmlFor={category} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Size</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleSize(size)}
                        className="h-10"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Color</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-900 transition-colors"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategories([])
                    setSelectedSizes([])
                    setPriceRange([0, 20000])
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white rounded-lg overflow-hidden border ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-48 flex-shrink-0' : ''
                    }`}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        width={300}
                        height={400}
                        className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                          viewMode === 'list' ? 'w-full h-48' : 'w-full h-80'
                        }`}
                      />
                    </div>
                    
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Size: {product.size}</p>
                      <p className="text-xl font-bold text-gray-900 mb-4">
                        Rs. {product.price.toLocaleString()}
                      </p>
                      
                      <Button
                        className="w-full fill-button bg-transparent border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button variant="outline" disabled>Previous</Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
