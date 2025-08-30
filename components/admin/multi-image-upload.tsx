'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadImage, validateImageFile, UploadResult, deleteImage, getImagePath } from '@/lib/image-upload'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { X, Upload, Image as ImageIcon, Star, StarOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MultiImageUploadProps {
  bucket: 'product-images' | 'category-images' | 'hero-images'
  folder?: string
  onImagesChange: (images: string[]) => void
  currentImages?: string[]
  className?: string
  maxFiles?: number
  accept?: Record<string, string[]>
}

interface ImageUploadState {
  url: string
  uploading: boolean
  progress: number
  error?: string
}

export function MultiImageUpload({
  bucket,
  folder,
  onImagesChange,
  currentImages = [],
  className,
  maxFiles = 10,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
  }
}: MultiImageUploadProps) {
  const [images, setImages] = useState<ImageUploadState[]>(
    currentImages.map(url => ({ url, uploading: false, progress: 0 }))
  )
  const [error, setError] = useState('')

  const updateImages = (newImages: ImageUploadState[]) => {
    setImages(newImages)
    const completedImages = newImages
      .filter(img => !img.uploading && !img.error)
      .map(img => img.url)
    onImagesChange(completedImages)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const availableSlots = maxFiles - images.filter(img => !img.uploading && !img.error).length
    if (availableSlots <= 0) {
      setError(`Maximum ${maxFiles} images allowed`)
      return
    }

    const filesToUpload = acceptedFiles.slice(0, availableSlots)
    setError('')

    // Add placeholder entries for uploading files
    const uploadingImages: ImageUploadState[] = filesToUpload.map(() => ({
      url: '',
      uploading: true,
      progress: 0
    }))

    const newImages = [...images, ...uploadingImages]
    setImages(newImages)

    // Upload files
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i]
      const imageIndex = images.length + i

      const validation = validateImageFile(file)
      if (!validation.valid) {
        updateImageAtIndex(imageIndex, {
          url: '',
          uploading: false,
          progress: 0,
          error: validation.error
        })
        continue
      }

      try {
        // Create preview
        const previewUrl = URL.createObjectURL(file)
        updateImageAtIndex(imageIndex, {
          url: previewUrl,
          uploading: true,
          progress: 10
        })

        // Simulate progress
        const progressInterval = setInterval(() => {
          updateImageAtIndex(imageIndex, prev => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90)
          }))
        }, 100)

        const result = await uploadImage(file, bucket, folder)
        
        clearInterval(progressInterval)
        
        // Clean up object URL
        URL.revokeObjectURL(previewUrl)

        updateImageAtIndex(imageIndex, {
          url: result.url,
          uploading: false,
          progress: 100,
          error: undefined
        })

        setTimeout(() => {
          updateImageAtIndex(imageIndex, prev => ({
            ...prev,
            progress: 0
          }))
        }, 1000)

      } catch (err: any) {
        updateImageAtIndex(imageIndex, {
          url: '',
          uploading: false,
          progress: 0,
          error: err.message || 'Upload failed'
        })
      }
    }
  }, [bucket, folder, images, maxFiles])

  const updateImageAtIndex = (index: number, update: Partial<ImageUploadState> | ((prev: ImageUploadState) => ImageUploadState)) => {
    setImages(prev => {
      const newImages = [...prev]
      if (typeof update === 'function') {
        newImages[index] = update(newImages[index])
      } else {
        newImages[index] = { ...newImages[index], ...update }
      }
      
      // Update parent component
      const completedImages = newImages
        .filter(img => !img.uploading && !img.error && img.url)
        .map(img => img.url)
      onImagesChange(completedImages)
      
      return newImages
    })
  }

  const removeImage = async (index: number) => {
    const image = images[index]
    
    // Try to delete from storage if it's a Supabase URL
    if (image.url && image.url.includes('supabase')) {
      try {
        const path = getImagePath(image.url)
        if (path) {
          await deleteImage(bucket, path)
        }
      } catch (err) {
        console.error('Failed to delete image from storage:', err)
      }
    }

    const newImages = images.filter((_, i) => i !== index)
    updateImages(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    updateImages(newImages)
  }

  const setPrimaryImage = (index: number) => {
    if (index === 0) return // Already primary
    moveImage(index, 0)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - images.filter(img => !img.uploading && !img.error).length,
    disabled: images.filter(img => !img.uploading && !img.error).length >= maxFiles
  })

  return (
    <div className={cn("space-y-4", className)}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Existing Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* Primary badge */}
                {index === 0 && !image.uploading && !image.error && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  </div>
                )}

                {/* Loading overlay */}
                {image.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-2 rounded">
                      <Progress value={image.progress} className="w-16" />
                    </div>
                  </div>
                )}

                {/* Error overlay */}
                {image.error && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                    <p className="text-white text-xs text-center p-2">{image.error}</p>
                  </div>
                )}

                {/* Actions */}
                {!image.uploading && !image.error && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    {index !== 0 && (
                      <button
                        onClick={() => setPrimaryImage(index)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        title="Set as primary image"
                      >
                        <Star className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(index)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.filter(img => !img.uploading && !img.error).length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-3">
            <div className="mx-auto w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-gray-600" />
            </div>
            
            <div>
              <p className="font-medium text-gray-900">
                {isDragActive ? 'Drop images here' : 'Add more images'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {images.filter(img => !img.uploading && !img.error).length}/{maxFiles} images uploaded
              </p>
            </div>
            
            <Button variant="outline" size="sm" type="button">
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose Images
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>• First image will be used as the primary product image</p>
        <p>• Use high-quality images (minimum 800x800) for best results</p>
        <p>• Supported formats: JPEG, PNG, WebP, GIF (max 5MB each)</p>
      </div>
    </div>
  )
}
