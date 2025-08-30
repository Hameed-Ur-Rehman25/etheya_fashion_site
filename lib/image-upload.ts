import { supabase } from './supabase'

export interface UploadResult {
  url: string
  path: string
}

export async function uploadImage(
  file: File, 
  bucket: 'product-images' | 'category-images' | 'hero-images',
  folder?: string
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      url: publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('Image upload error:', error)
    throw error
  }
}

export async function deleteImage(
  bucket: 'product-images' | 'category-images' | 'hero-images',
  path: string
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  } catch (error) {
    console.error('Image delete error:', error)
    throw error
  }
}

export function getImagePath(url: string): string {
  // Extract path from Supabase public URL
  const urlParts = url.split('/')
  const bucketIndex = urlParts.findIndex(part => 
    ['product-images', 'category-images', 'hero-images'].includes(part)
  )
  
  if (bucketIndex === -1) return ''
  
  return urlParts.slice(bucketIndex + 1).join('/')
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, WebP, or GIF)'
    }
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 5MB'
    }
  }

  return { valid: true }
}
