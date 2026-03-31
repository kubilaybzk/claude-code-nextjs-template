'use client'

import { CATEGORY_CONFIG } from '@/constants/categories'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CategoryDropdownProps {
  selectedIds: number[]
  onToggle: (categoryId: number) => void
  maxSelection?: number
}

export function CategoryDropdown({
  selectedIds,
  onToggle,
  maxSelection = 3,
}: CategoryDropdownProps) {
  return (
    <div className="category-dropdown">
      {CATEGORY_CONFIG.map((category) => {
        const Icon = category.icon
        const isSelected = selectedIds.includes(category.id)
        const isDisabled = !isSelected && selectedIds.length >= maxSelection

        return (
          <Button
            key={category.id}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            disabled={isDisabled}
            onClick={() => onToggle(category.id)}
            className={cn(
              'category-dropdown__button',
              isSelected && 'category-dropdown__button--active',
            )}
          >
            <Icon className="category-dropdown__icon" />
            {category.label}
          </Button>
        )
      })}
    </div>
  )
}
