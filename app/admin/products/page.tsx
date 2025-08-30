'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  EyeOff, 
  Package,
  Filter
} from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: number
  title: string
  price: string
  image: string
  description: string
  sizes: string[]
  images: string[]
  category: string
  in_stock: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

interface ProductFilters {
  search: string
  category: string
  featured: boolean | null
  inStock: boolean | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'all',
    featured: null,
    inStock: null
  })

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, filters])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProducts(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('title')
        .order('title')

      if (error) throw error

      const categoryTitles = data?.map(cat => cat.title) || []
      setCategories(categoryTitles)
    } catch (err: any) {
      console.error('Failed to load categories:', err)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      )
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Featured filter
    if (filters.featured !== null) {
      filtered = filtered.filter(product => product.featured === filters.featured)
    }

    // Stock filter
    if (filters.inStock !== null) {
      filtered = filtered.filter(product => product.in_stock === filters.inStock)
    }

    setFilteredProducts(filtered)
  }

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleFeatured = async (id: number, featured: boolean) => {
    try {
      const { error } = await supabaseAdmin
        .from('products')
        .update({ featured: !featured })
        .eq('id', id)

      if (error) throw error

      await loadProducts()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const toggleStock = async (id: number, inStock: boolean) => {
    try {
      const { error } = await supabaseAdmin
        .from('products')
        .update({ in_stock: !inStock })
        .eq('id', id)

      if (error) throw error

      await loadProducts()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      await loadProducts()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      featured: null,
      inStock: null
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.category || 'all'} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.featured === null ? "all" : filters.featured.toString()} 
              onValueChange={(value) => updateFilter('featured', value === "all" ? null : value === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Featured status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All products</SelectItem>
                <SelectItem value="true">Featured only</SelectItem>
                <SelectItem value="false">Not featured</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.inStock === null ? "all" : filters.inStock.toString()} 
              onValueChange={(value) => updateFilter('inStock', value === "all" ? null : value === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Stock status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All products</SelectItem>
                <SelectItem value="true">In stock</SelectItem>
                <SelectItem value="false">Out of stock</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {product.featured && (
                    <Badge variant="default" className="text-xs">Featured</Badge>
                  )}
                  {!product.in_stock && (
                    <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>
                  <p className="text-lg font-bold text-green-600">{product.price}</p>
                  <p className="text-xs text-gray-600">{product.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.slice(0, 3).map(size => (
                      <Badge key={size} variant="outline" className="text-xs">
                        {size}
                      </Badge>
                    ))}
                    {product.sizes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.sizes.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 mt-4">
                  <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(product.id, product.featured)}
                    title={product.featured ? "Remove from featured" : "Make featured"}
                  >
                    {product.featured ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStock(product.id, product.in_stock)}
                    title={product.in_stock ? "Mark out of stock" : "Mark in stock"}
                  >
                    <Package className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                    title="Delete product"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {Object.values(filters).some(f => f) ? 'No products match your filters' : 'No products yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {Object.values(filters).some(f => f) 
                    ? 'Try adjusting your search criteria' 
                    : 'Get started by adding your first product'
                  }
                </p>
                {!Object.values(filters).some(f => f) && (
                  <Link href="/admin/products/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Featured Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.featured).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              In Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.in_stock).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => !p.in_stock).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
