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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { UploadResult } from '@/lib/image-upload'

interface HeroImageForm {
  src: string
  alt: string
  title: string
  subtitle: string
  button_text: string
  content_position: 'left' | 'right'
  active: boolean
  order_index: number
}

export default function NewHeroImagePage() {
  const [form, setForm] = useState<HeroImageForm>({
    src: '',
    alt: '',
    title: '',
    subtitle: '',
    button_text: 'Shop Now',
    content_position: 'right',
    active: true,
    order_index: 1
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleImageUpload = (result: UploadResult) => {
    setForm(prev => ({
      ...prev,
      src: result.url
    }))
  }

  const handleInputChange = (field: keyof HeroImageForm, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.src) {
      setError('Please upload an image')
      return
    }

    if (!form.title || !form.subtitle) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get the next order index
      const { data: existingImages } = await supabaseAdmin
        .from('hero_images')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingImages && existingImages.length > 0 
        ? existingImages[0].order_index + 1 
        : 1

      // Create hero image
      const { error: insertError } = await supabaseAdmin
        .from('hero_images')
        .insert([{
          ...form,
          order_index: nextOrderIndex
        }])

      if (insertError) throw insertError

      router.push('/admin/hero')
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
        <Link href="/admin/hero">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hero Images
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Hero Image</h1>
          <p className="text-gray-600 mt-2">Create a new hero section slide</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
              <CardDescription>
                Upload a high-quality image for the hero section (recommended: 1920x1080)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                bucket="hero-images"
                onUpload={handleImageUpload}
                currentImage={form.src}
              />
              
              <div className="mt-4">
                <Label htmlFor="alt">Alt Text *</Label>
                <Input
                  id="alt"
                  value={form.alt}
                  onChange={(e) => handleInputChange('alt', e.target.value)}
                  placeholder="Describe the image for accessibility"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Configure the text content that appears over the hero image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Main headline"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle *</Label>
                <Textarea
                  id="subtitle"
                  value={form.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Supporting text or description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  value={form.button_text}
                  onChange={(e) => handleInputChange('button_text', e.target.value)}
                  placeholder="Call-to-action text"
                />
              </div>

              <div>
                <Label>Content Position</Label>
                <RadioGroup
                  value={form.content_position}
                  onValueChange={(value) => handleInputChange('content_position', value)}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="left" />
                    <Label htmlFor="left">Left</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right" id="right" />
                    <Label htmlFor="right">Right</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={form.active}
                  onCheckedChange={(checked) => handleInputChange('active', checked)}
                />
                <Label htmlFor="active">Active (show on website)</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {form.src && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                How your hero image will look on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <img
                  src={form.src}
                  alt={form.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                
                <div className={`absolute inset-0 flex items-center px-8 md:px-16 lg:px-24 ${
                  form.content_position === 'right' ? 'justify-end' : 'justify-start'
                }`}>
                  <div className="text-white max-w-2xl">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                      {form.title || 'Hero Title'}
                    </h1>
                    <p className="text-lg md:text-xl mb-6 opacity-90">
                      {form.subtitle || 'Hero subtitle will appear here'}
                    </p>
                    <Button 
                      size="lg"
                      className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
                    >
                      {form.button_text || 'Button Text'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/hero">
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
                Create Hero Image
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
