import { supabase } from './supabase'

// Security: Storage service for handling product images securely
export class StorageService {
  // Security: Bucket names (should match your Supabase storage buckets)
  private static readonly BUCKETS = {
    PRODUCTS: 'product-images',
    CATEGORIES: 'category-images',
    USER_AVATARS: 'user-avatars'
  } as const

  // Security: Allowed file types for images
  private static readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ]

  // Security: Maximum file size (5MB)
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024

  // Security: Validate file before upload
  private static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: `Invalid file type. Allowed: ${this.ALLOWED_IMAGE_TYPES.join(', ')}` 
      }
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: `File too large. Maximum size: ${this.MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }
    }

    return { valid: true }
  }

  // Security: Generate secure filename
  private static generateSecureFilename(originalName: string, prefix: string = ''): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    return `${prefix}${timestamp}_${randomString}_${sanitizedName}`
  }

  // Security: Upload product image
  static async uploadProductImage(
    file: File, 
    productId: number
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      // Security: Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { url: null, error: validation.error! }
      }

      // Security: Generate secure filename
      const filename = this.generateSecureFilename(file.name, `product_${productId}_`)
      const filePath = `${productId}/${filename}`

      // Security: Upload file with metadata
      const { data, error } = await supabase.storage
        .from(this.BUCKETS.PRODUCTS)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false, // Security: Don't overwrite existing files
          metadata: {
            productId: productId.toString(),
            uploadedAt: new Date().toISOString(),
            originalName: file.name,
            fileSize: file.size.toString(),
            contentType: file.type
          }
        })

      if (error) {
        console.error('Storage upload error:', error)
        return { url: null, error: error.message }
      }

      // Security: Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKETS.PRODUCTS)
        .getPublicUrl(filePath)

      return { url: urlData.publicUrl, error: null }
    } catch (error) {
      console.error('Unexpected error during image upload:', error)
      return { url: null, error: 'Upload failed' }
    }
  }

  // Security: Upload category image
  static async uploadCategoryImage(
    file: File, 
    categorySlug: string
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      // Security: Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { url: null, error: validation.error! }
      }

      // Security: Generate secure filename
      const filename = this.generateSecureFilename(file.name, `category_${categorySlug}_`)
      const filePath = `${categorySlug}/${filename}`

      // Security: Upload file
      const { data, error } = await supabase.storage
        .from(this.BUCKETS.CATEGORIES)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          metadata: {
            categorySlug,
            uploadedAt: new Date().toISOString(),
            originalName: file.name,
            fileSize: file.size.toString(),
            contentType: file.type
          }
        })

      if (error) {
        console.error('Storage upload error:', error)
        return { url: null, error: error.message }
      }

      // Security: Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKETS.CATEGORIES)
        .getPublicUrl(filePath)

      return { url: urlData.publicUrl, error: null }
    } catch (error) {
      console.error('Unexpected error during category image upload:', error)
      return { url: null, error: 'Upload failed' }
    }
  }

  // Security: Delete image
  static async deleteImage(
    bucket: keyof typeof StorageService.BUCKETS,
    filePath: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // Security: Validate bucket name
      if (!Object.values(this.BUCKETS).includes(bucket as any)) {
        return { success: false, error: 'Invalid bucket' }
      }

      // Security: Validate file path
      if (!filePath || typeof filePath !== 'string') {
        return { success: false, error: 'Invalid file path' }
      }

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        console.error('Storage delete error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Unexpected error during image deletion:', error)
      return { success: false, error: 'Deletion failed' }
    }
  }

  // Security: Get image URL
  static getImageUrl(bucket: keyof typeof StorageService.BUCKETS, filePath: string): string | null {
    try {
      if (!Object.values(this.BUCKETS).includes(bucket as any)) {
        return null
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error getting image URL:', error)
      return null
    }
  }

  // Security: List images in bucket
  static async listImages(
    bucket: keyof typeof StorageService.BUCKETS,
    folder: string = ''
  ): Promise<{ files: string[] | null; error: string | null }> {
    try {
      if (!Object.values(this.BUCKETS).includes(bucket as any)) {
        return { files: null, error: 'Invalid bucket' }
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit: 100,
          offset: 0
        })

      if (error) {
        console.error('Storage list error:', error)
        return { files: null, error: error.message }
      }

      const files = data?.map(item => item.name) || []
      return { files, error: null }
    } catch (error) {
      console.error('Unexpected error listing images:', error)
      return { files: null, error: 'Listing failed' }
    }
  }
}

// Security: Export only the service class
export default StorageService
