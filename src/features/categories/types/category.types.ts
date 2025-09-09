export interface Category {
  id: number
  title: string
  image: string
  description: string
  slug: string
  productCount?: number
  featured?: boolean
  parentId?: number
}

export interface CategoryTree extends Category {
  children?: CategoryTree[]
}

export interface CategoryDisplayProps {
  category: Category
  onSelect?: (category: Category) => void
  showProductCount?: boolean
  variant?: 'card' | 'list' | 'minimal'
}

export interface CategoryFilters {
  featured?: boolean
  parentId?: number
  search?: string
}
