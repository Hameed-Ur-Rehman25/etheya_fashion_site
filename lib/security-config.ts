// Security Configuration for Supabase
// This file contains security-related constants and configurations

// Security: Rate limiting configurations
export const RATE_LIMITS = {
  // Authentication attempts
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_TIMEOUT_MINUTES: 15,
  
  // API requests
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_REQUESTS_PER_HOUR: 1000,
  
  // File uploads
  MAX_UPLOADS_PER_HOUR: 50,
  MAX_FILE_SIZE_MB: 5,
  
  // Search queries
  MAX_SEARCH_QUERIES_PER_MINUTE: 30
} as const

// Security: File validation
export const FILE_VALIDATION = {
  // Allowed image types
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ],
  
  // Maximum file sizes
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  
  // Allowed file extensions
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
} as const

// Security: Input validation patterns
export const VALIDATION_PATTERNS = {
  // Email validation
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Password requirements (minimum 8 chars, at least one letter and one number)
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
  
  // Username validation (alphanumeric, 3-20 chars)
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  
  // Phone number validation (basic)
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/
} as const

// Security: Session configuration
export const SESSION_CONFIG = {
  // Session timeout (24 hours)
  TIMEOUT_HOURS: 24,
  
  // Refresh token before expiry (5 minutes)
  REFRESH_BEFORE_EXPIRY_MINUTES: 5,
  
  // Remember me duration (30 days)
  REMEMBER_ME_DAYS: 30
} as const

// Security: CORS and headers
export const SECURITY_HEADERS = {
  // Content Security Policy
  CSP: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  
  // X-Frame-Options
  X_FRAME_OPTIONS: 'DENY',
  
  // X-Content-Type-Options
  X_CONTENT_TYPE_OPTIONS: 'nosniff',
  
  // Referrer Policy
  REFERRER_POLICY: 'strict-origin-when-cross-origin'
} as const

// Security: Database query limits
export const QUERY_LIMITS = {
  // Maximum results per query
  MAX_RESULTS: 100,
  
  // Default page size
  DEFAULT_PAGE_SIZE: 12,
  
  // Maximum page size
  MAX_PAGE_SIZE: 50,
  
  // Search query minimum length
  MIN_SEARCH_LENGTH: 2,
  
  // Search query maximum length
  MAX_SEARCH_LENGTH: 100
} as const

// Security: Error messages (don't expose sensitive information)
export const ERROR_MESSAGES = {
  // Generic errors
  GENERIC_ERROR: 'An error occurred. Please try again.',
  VALIDATION_ERROR: 'Invalid input provided.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_LOCKED: 'Account temporarily locked due to multiple failed attempts.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address.',
  
  // File upload errors
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'File type not allowed.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  
  // Rate limiting errors
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.'
} as const

// Security: Validation functions
export const SecurityUtils = {
  // Validate email format
  isValidEmail: (email: string): boolean => {
    return VALIDATION_PATTERNS.EMAIL.test(email)
  },
  
  // Validate password strength
  isValidPassword: (password: string): boolean => {
    return VALIDATION_PATTERNS.PASSWORD.test(password)
  },
  
  // Validate file type
  isValidFileType: (file: { type: string }): boolean => {
    return FILE_VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type as any)
  },
  
  // Validate file size
  isValidFileSize: (file: { size: number }, maxSize: number = FILE_VALIDATION.MAX_IMAGE_SIZE): boolean => {
    return file.size <= maxSize
  },
  
  // Sanitize input string
  sanitizeInput: (input: string): string => {
    return input.trim().replace(/[<>]/g, '')
  },
  
  // Generate secure random string
  generateSecureString: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
} as const

// Security: Export all configurations
export default {
  RATE_LIMITS,
  FILE_VALIDATION,
  VALIDATION_PATTERNS,
  SESSION_CONFIG,
  SECURITY_HEADERS,
  QUERY_LIMITS,
  ERROR_MESSAGES,
  SecurityUtils
}
