'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { supabaseAdmin } from '@/lib/supabase'

interface Category {
  id: number
  title: string
}

export default function NewProductPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    sizes: [] as string[],
    images: [] as string[],
    in_stock: true,
    featured: false
  })
  const [newSize, setNewSize] = useState('')
  const router = useRouter()

  // Load categories on component mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('id, title')
        .order('title')

      if (error) throw error
      setCategories(data || [])
    } catch (err: any) {
      console.error('Failed to load categories:', err)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }))
      setNewSize('')
    }
  }

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }))
  }

  const handleImageUpload = async (files: FileList) => {
    setLoading(true)
    try {
      const uploadedUrls = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileName = `${Date.now()}-${file.name}`
        
        const { data, error } = await supabaseAdmin.storage
          .from('product-images')
          .upload(fileName, file)

        if (error) throw error

        const { data: urlData } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(fileName)

        uploadedUrls.push(urlData.publicUrl)
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Product title is required')
      }
      if (!formData.price.trim()) {
        throw new Error('Product price is required')
      }
      if (!formData.category) {
        throw new Error('Product category is required')
      }
      if (formData.images.length === 0) {
        throw new Error('At least one product image is required')
      }

      const { error } = await supabaseAdmin
        .from('products')
        .insert([{
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: formData.price.trim(),
          category: formData.category,
          sizes: formData.sizes,
          images: formData.images,
          image: formData.images[0], // Use first image as main image
          in_stock: formData.in_stock,
          featured: formData.featured
        }])

      if (error) throw error

      router.push('/admin/products')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-gray-600">Create a new product for your store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential product details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter product title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price (e.g., $99.99)"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.title}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Images & Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Images & Settings</CardTitle>
                <CardDescription>
                  Product images and availability settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Upload */}
                <div>
                  <Label>Product Images *</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sizes */}
                <div>
                  <Label>Sizes</Label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Add size (e.g., S, M, L)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    />
                    <Button type="button" onClick={addSize} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.sizes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.sizes.map((size) => (
                        <Badge key={size} variant="secondary" className="cursor-pointer" onClick={() => removeSize(size)}>
                          {size} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in_stock"
                      checked={formData.in_stock}
                      onCheckedChange={(checked) => handleInputChange('in_stock', checked)}
                    />
                    <Label htmlFor="in_stock">In Stock</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating Product...' : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/products')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
