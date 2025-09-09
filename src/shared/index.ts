// Shared Module Barrel Exports

// Layout Components
export { Navbar } from './components/layout/navbar'

// UI Components (re-export from shadcn/ui)
export { Button } from './components/ui/button'
export { Input } from './components/ui/input'
export { Badge } from './components/ui/badge'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
export { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet'
export { Slider } from './components/ui/slider'
export { Checkbox } from './components/ui/checkbox'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'

// Utilities
export { cn } from './utils/cn'
export { formatCurrency, formatNumber, formatDate, formatPhoneNumber, slugify, capitalize, truncate } from './utils/formatters'
export { validateEmail, validatePhone, validatePassword, validateRequired, validateMinLength, validateMaxLength, validateNumeric, validateUrl } from './utils/validators'

// Constants
export {
  APP_CONFIG,
  BUSINESS_CONFIG,
  SIZES,
  COLORS,
  SORT_OPTIONS,
  PRICE_RANGES,
  NAVIGATION_ITEMS,
  FOOTER_LINKS,
  SOCIAL_LINKS,
  NEWSLETTER_CONFIG,
  SHIPPING_INFO,
  PRODUCT_FEATURES
} from './constants/app.constants'

// Types
export type {
  // Add shared types here when needed
} from './types/common.types'
