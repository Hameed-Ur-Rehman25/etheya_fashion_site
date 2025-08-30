'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadImage, validateImageFile, UploadResult } from '@/lib/image-upload'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { X, Upload, Image } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  bucket: 'product-images' | 'category-images' | 'hero-images'
  folder?: string
  onUpload: (result: UploadResult) => void
  currentImage?: string
  className?: string
  maxFiles?: number
  accept?: Record<string, string[]>
}

export function ImageUpload({
  bucket,
  folder,
  onUpload,
  currentImage,
  className,
  maxFiles = 1,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
  }
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    const validation = validateImageFile(file)

    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setError('')
    setUploading(true)
    setUploadProgress(0)

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const result = await uploadImage(file, bucket, folder)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      onUpload(result)
      setPreview(result.url)
      
      // Clean up object URL
      URL.revokeObjectURL(previewUrl)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [bucket, folder, onUpload, currentImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled: uploading
  })

  const removeImage = () => {
    setPreview(null)
    setError('')
  }

  return (
    <div className={cn("space-y-4", className)}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {preview ? (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            {!uploading && (
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {uploading && uploadProgress > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="bg-white p-4 rounded-lg">
                <Progress value={uploadProgress} className="w-32" />
                <p className="text-sm text-center mt-2">{uploadProgress}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            uploading && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600" />
              ) : (
                <Upload className="w-6 h-6 text-gray-600" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop image here' : 'Upload image'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400 mt-2">
                JPEG, PNG, WebP, GIF up to 5MB
              </p>
            </div>
            
            {!uploading && (
              <Button variant="outline" type="button">
                <Image className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
