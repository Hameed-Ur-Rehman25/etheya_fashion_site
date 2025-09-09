import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionContainerProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  background?: 'white' | 'gray' | 'transparent'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  maxWidth?: '4xl' | '5xl' | '6xl' | '7xl' | 'full'
}

export function SectionContainer({
  children,
  className,
  containerClassName,
  background = 'white',
  padding = 'lg',
  maxWidth = '7xl'
}: SectionContainerProps) {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    transparent: 'bg-transparent'
  }

  const paddingClasses = {
    none: '',
    sm: 'py-8 px-4',
    md: 'py-12 px-4',
    lg: 'py-16 px-6',
    xl: 'py-20 px-6'
  }

  const maxWidthClasses = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  }

  return (
    <section className={cn(
      paddingClasses[padding],
      backgroundClasses[background],
      className
    )}>
      <div className={cn(
        maxWidthClasses[maxWidth],
        'mx-auto',
        containerClassName
      )}>
        {children}
      </div>
    </section>
  )
}
