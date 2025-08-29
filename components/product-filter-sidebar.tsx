'use client'

import { CollapsibleFilter, FilterCheckbox, PriceRangeFilter } from './collapsible-filter'
import { Button } from '@/components/ui/button'
import { SearchFilters } from '@/types'
import { 
  CATEGORIES, 
  SIZES, 
  AVAILABILITY_OPTIONS, 
  TYPE_OPTIONS, 
  FABRIC_OPTIONS, 
  PIECES_OPTIONS,
  PRICE_RANGES 
} from '@/lib/constants'

interface ProductFilterSidebarProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onClearFilters: () => void
}

export function ProductFilterSidebar({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: ProductFilterSidebarProps) {
  
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleArrayFilterChange = (
    key: 'categories' | 'sizes' | 'availability' | 'types' | 'fabrics' | 'pieces',
    item: string,
    checked: boolean
  ) => {
    const currentArray = filters[key]
    const newArray = checked
      ? [...currentArray, item]
      : currentArray.filter(i => i !== item)
    
    handleFilterChange(key, newArray)
  }

  return (
    <div className="w-full max-w-xs bg-white border-r border-gray-200">
      <div className="p-4 space-y-3">
        
        {/* Availability Filter */}
  <CollapsibleFilter title="AVAILABILITY" isOpen={false}>
          {AVAILABILITY_OPTIONS.map((option) => (
            <FilterCheckbox
              key={option.value}
              id={`availability-${option.value}`}
              label={option.label}
              checked={filters.availability.includes(option.value)}
              onCheckedChange={(checked) => 
                handleArrayFilterChange('availability', option.value, checked)
              }
            />
          ))}
        </CollapsibleFilter>

        {/* Price Filter */}
  <CollapsibleFilter title="PRICE" isOpen={false}>
          <PriceRangeFilter
            value={filters.priceRange}
            min={PRICE_RANGES.MIN}
            max={PRICE_RANGES.MAX}
            step={PRICE_RANGES.STEP}
            onValueChange={(value) => handleFilterChange('priceRange', value)}
          />
        </CollapsibleFilter>

        {/* Type Filter */}
  <CollapsibleFilter title="TYPE" isOpen={false}>
          {TYPE_OPTIONS.map((option) => (
            <FilterCheckbox
              key={option.value}
              id={`type-${option.value}`}
              label={option.label}
              checked={filters.types.includes(option.value)}
              onCheckedChange={(checked) => 
                handleArrayFilterChange('types', option.value, checked)
              }
            />
          ))}
        </CollapsibleFilter>

        {/* Fabric Filter */}
  <CollapsibleFilter title="FABRIC" isOpen={false}>
          {FABRIC_OPTIONS.map((option) => (
            <FilterCheckbox
              key={option.value}
              id={`fabric-${option.value}`}
              label={option.label}
              checked={filters.fabrics.includes(option.value)}
              onCheckedChange={(checked) => 
                handleArrayFilterChange('fabrics', option.value, checked)
              }
            />
          ))}
        </CollapsibleFilter>

        {/* Categories Filter */}
  <CollapsibleFilter title="CATEGORIES" isOpen={false}>
          {CATEGORIES.map((category) => (
            <FilterCheckbox
              key={category.id}
              id={`category-${category.id}`}
              label={category.title}
              checked={filters.categories.includes(category.title)}
              onCheckedChange={(checked) => 
                handleArrayFilterChange('categories', category.title, checked)
              }
            />
          ))}
        </CollapsibleFilter>

        {/* Size Filter */}
  <CollapsibleFilter title="SIZE" isOpen={false}>
          <div className="grid grid-cols-3 gap-1">
            {SIZES.map((size) => (
              <FilterCheckbox
                key={size}
                id={`size-${size}`}
                label={size}
                checked={filters.sizes.includes(size)}
                onCheckedChange={(checked) => 
                  handleArrayFilterChange('sizes', size, checked)
                }
              />
            ))}
          </div>
        </CollapsibleFilter>

        {/* Pieces Filter */}
  <CollapsibleFilter title="PIECES" isOpen={false}>
          {PIECES_OPTIONS.map((option) => (
            <FilterCheckbox
              key={option.value}
              id={`pieces-${option.value}`}
              label={option.label}
              checked={filters.pieces.includes(option.value)}
              onCheckedChange={(checked) => 
                handleArrayFilterChange('pieces', option.value, checked)
              }
            />
          ))}
        </CollapsibleFilter>

        {/* Clear All Button */}
        <div className="pt-3 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
