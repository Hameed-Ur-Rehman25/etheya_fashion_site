'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'

interface HeroImage {
  id: number
  src: string
  alt: string
  title: string
  subtitle: string
  button_text: string
  content_position: 'left' | 'right'
  active: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export default function HeroManagementPage() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadHeroImages()
  }, [])

  const loadHeroImages = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('hero_images')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error

      setHeroImages(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: number, active: boolean) => {
    try {
      const { error } = await supabaseAdmin
        .from('hero_images')
        .update({ active: !active })
        .eq('id', id)

      if (error) throw error

      await loadHeroImages()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const updateOrder = async (id: number, direction: 'up' | 'down') => {
    const currentImage = heroImages.find(img => img.id === id)
    if (!currentImage) return

    const newIndex = direction === 'up' 
      ? currentImage.order_index - 1 
      : currentImage.order_index + 1

    // Find image to swap with
    const swapImage = heroImages.find(img => img.order_index === newIndex)
    if (!swapImage) return

    try {
      // Swap order indices
      await Promise.all([
        supabaseAdmin
          .from('hero_images')
          .update({ order_index: newIndex })
          .eq('id', id),
        supabaseAdmin
          .from('hero_images')
          .update({ order_index: currentImage.order_index })
          .eq('id', swapImage.id)
      ])

      await loadHeroImages()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteHeroImage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return

    try {
      const { error } = await supabaseAdmin
        .from('hero_images')
        .delete()
        .eq('id', id)

      if (error) throw error

      await loadHeroImages()
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
          <h1 className="text-3xl font-bold text-gray-900">Hero Section Management</h1>
          <p className="text-gray-600 mt-2">Manage homepage hero images and content</p>
        </div>
        <Link href="/admin/hero/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Hero Image
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Hero Images Grid */}
      <div className="grid gap-6">
        {heroImages.length > 0 ? (
          heroImages.map((heroImage, index) => (
            <Card key={heroImage.id} className="overflow-hidden">
              <div className="md:flex">
                {/* Image Preview */}
                <div className="md:w-1/3">
                  <div className="relative h-48 md:h-full">
                    <img
                      src={heroImage.src}
                      alt={heroImage.alt}
                      className="w-full h-full object-cover"
                    />
                    {!heroImage.active && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="secondary">Inactive</Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{heroImage.title}</h3>
                      <p className="text-gray-600 mt-1">{heroImage.subtitle}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={heroImage.active ? "default" : "secondary"}>
                        {heroImage.active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">
                        Position: {heroImage.content_position}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Button Text:</span>
                      <p className="text-sm">{heroImage.button_text}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-500">Order:</span>
                      <p className="text-sm">#{heroImage.order_index}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    <Link href={`/admin/hero/${heroImage.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(heroImage.id, heroImage.active)}
                    >
                      {heroImage.active ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>

                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateOrder(heroImage.id, 'up')}
                      >
                        <ArrowUp className="w-4 h-4 mr-1" />
                        Move Up
                      </Button>
                    )}

                    {index < heroImages.length - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateOrder(heroImage.id, 'down')}
                      >
                        <ArrowDown className="w-4 h-4 mr-1" />
                        Move Down
                      </Button>
                    )}

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteHeroImage(heroImage.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hero images</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first hero image</p>
              <Link href="/admin/hero/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Hero Image
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
          <CardDescription>
            How to manage your hero section effectively
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Order:</span> Hero images are displayed in order. Use the move up/down buttons to reorder.
            </div>
            <div>
              <span className="font-medium">Active Status:</span> Only active hero images are shown on the website.
            </div>
            <div>
              <span className="font-medium">Content Position:</span> Choose whether text appears on the left or right side of the image.
            </div>
            <div>
              <span className="font-medium">Image Requirements:</span> Use high-quality images (1920x1080 or similar) for best results.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
