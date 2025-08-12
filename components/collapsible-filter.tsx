'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface CollapsibleFilterProps {
  title: string
  isOpen?: boolean
  children: React.ReactNode
  className?: string
}

export function CollapsibleFilter({ 
  title, 
  isOpen: initialOpen = true, 
  children, 
  className 
}: CollapsibleFilterProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  return (
    <div className={cn("border-b border-gray-200 pb-3", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
          {title}
        </h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

interface FilterCheckboxProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function FilterCheckbox({ id, label, checked, onCheckedChange }: FilterCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        className="data-[state=checked]:bg-black data-[state=checked]:border-black"
      />
      <label 
        htmlFor={id}
        className="text-sm text-gray-700 cursor-pointer"
      >
        {label}
      </label>
    </div>
  )
}

interface PriceRangeFilterProps {
  value: [number, number]
  min: number
  max: number
  step: number
  onValueChange: (value: [number, number]) => void
}

export function PriceRangeFilter({ value, min, max, step, onValueChange }: PriceRangeFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Rs. {value[0].toLocaleString()}</span>
        <span>Rs. {value[1].toLocaleString()}</span>
      </div>
      <Slider
        value={value}
        onValueChange={(newValue) => onValueChange([newValue[0], newValue[1]])}
        max={max}
        min={min}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Rs. {min.toLocaleString()}</span>
        <span>Rs. {max.toLocaleString()}</span>
      </div>
    </div>
  )
}
