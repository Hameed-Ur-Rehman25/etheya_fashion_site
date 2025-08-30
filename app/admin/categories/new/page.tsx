'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { ImageUpload } from '@/components/admin/image-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { UploadResult } from '@/lib/image-upload'

interface CategoryForm {
  title: string
  image: string
  description: string
  slug: string
  featured: boolean
}

export default function NewCategoryPage() {
  const [form, setForm] = useState<CategoryForm>({
    title: '',
    image: '',
    description: '',
    slug: '',
    featured: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleImageUpload = (result: UploadResult) => {
    setForm(prev => ({
      ...prev,
      image: result.url
    }))
  }

  const handleInputChange = (field: keyof CategoryForm, value: any) => {
    setForm(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      
      // Auto-generate slug when title changes
      if (field === 'title' && !prev.slug) {
        updated.slug = generateSlug(value)
      }
      
      return updated
    })
  }

  const validateForm = (): string | null => {
    if (!form.title.trim()) return 'Title is required'
    if (!form.description.trim()) return 'Description is required'
    if (!form.slug.trim()) return 'Slug is required'
    if (!form.image) return 'Image is required'

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(form.slug)) {
      return 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    return null
  }

  const checkSlugExists = async (slug: string): Promise<boolean> => {
    const { data } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    return !!data
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      // Check if slug already exists
      const slugExists = await checkSlugExists(form.slug)
      if (slugExists) {
        setError('A category with this slug already exists')
        setLoading(false)
        return
      }

      // Create category
      const { error: insertError } = await supabaseAdmin
        .from('categories')
        .insert([{
          title: form.title.trim(),
          image: form.image,
          description: form.description.trim(),
          slug: form.slug.trim(),
          product_count: 0,
          featured: form.featured
        }])

      if (insertError) throw insertError

      router.push('/admin/categories')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/categories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Category</h1>
          <p className="text-gray-600 mt-2">Create a new product category</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the category details and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Category Name *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Summer Collection"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="e.g., summer-collection"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used in URLs. Only lowercase letters, numbers, and hyphens allowed.
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what this category includes..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={form.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
                <Label htmlFor="featured">Featured category (show on homepage)</Label>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Category Image</CardTitle>
              <CardDescription>
                Upload an image that represents this category (recommended: 800x600 or larger)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                bucket="category-images"
                onUpload={handleImageUpload}
                currentImage={form.image}
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {form.image && form.title && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                How your category will appear on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Card Preview */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={form.image}
                      alt={form.title}
                      className="w-full h-full object-cover"
                    />
                    {form.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{form.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{form.description}</p>
                    <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                      <span>0 products</span>
                      <span>/{form.slug}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/categories">
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Category
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
