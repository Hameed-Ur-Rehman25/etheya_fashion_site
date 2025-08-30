'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  EyeOff,
  FolderOpen
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: number
  title: string
  image: string
  description: string
  slug: string
  product_count: number
  featured: boolean
  parent_id: number | null
  created_at: string
  updated_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    filterCategories()
  }, [categories, searchTerm])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setCategories(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterCategories = () => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories)
      return
    }

    const filtered = categories.filter(category =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    setFilteredCategories(filtered)
  }

  const toggleFeatured = async (id: number, featured: boolean) => {
    try {
      const { error } = await supabaseAdmin
        .from('categories')
        .update({ featured: !featured })
        .eq('id', id)

      if (error) throw error

      await loadCategories()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabaseAdmin
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      await loadCategories()
    } catch (err: any) {
      setError(err.message)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage product categories and collections</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {category.featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{category.product_count} products</span>
                    <span>/{category.slug}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link href={`/admin/categories/${category.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(category.id, category.featured)}
                  >
                    {category.featured ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No categories found' : 'No categories yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search criteria' 
                    : 'Get started by creating your first category'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/admin/categories/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Featured Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(c => c.featured).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, c) => sum + c.product_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Category Management Guide</CardTitle>
          <CardDescription>
            Best practices for organizing your product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Slug:</span> URL-friendly version of the category name (auto-generated but editable)
            </div>
            <div>
              <span className="font-medium">Featured:</span> Featured categories appear prominently on the homepage
            </div>
            <div>
              <span className="font-medium">Product Count:</span> Shows number of products in each category (updated automatically)
            </div>
            <div>
              <span className="font-medium">Images:</span> Use high-quality images (minimum 800x600) that represent the category well
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
