'use client'

/**
 * Kategori Filtre Bolumu
 *
 * Checkbox listesi ile quiz kategorilerini filtreler.
 *
 * @example
 * <CategoryFilterSection
 *   filters={{ categories: [0, 2], difficulty: [] }}
 *   onFilterChange={(key, value) => updateFilters({ [key]: value })}
 * />
 */

import { CATEGORY_CONFIG, getCategoryConfig } from '@/constants/categories'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

import type { QuizFilterValues } from './filterTypes'

// ── Types ───────────────────────────────────────────────────

interface CategoryFilterSectionProps {
  /** Aktif filtre degerleri */
  filters: QuizFilterValues
  /** Filtre degisim callback'i */
  onFilterChange: (key: string, value: unknown) => void
}

// ── Component ───────────────────────────────────────────────

export function CategoryFilterSection({ filters, onFilterChange }: CategoryFilterSectionProps) {
  const handleToggle = (category: number, checked: boolean) => {
    const current = filters.categories ?? []
    const next = checked
      ? current.includes(category) ? current : [...current, category]
      : current.filter((c) => c !== category)
    onFilterChange('categories', next.length > 0 ? next : undefined)
  }

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-medium text-foreground">Category</h4>
      <div className="flex flex-col gap-1.5">
        {CATEGORY_CONFIG.map((_, index) => {
          const id = `quiz-category-${index}`
          const checked = filters.categories?.includes(index) ?? false
          const cfg = getCategoryConfig(index)
          const CategoryIcon = cfg.icon

          return (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(val) => handleToggle(index, val === true)}
                aria-label={cfg.label}
              />
              <Label htmlFor={id} className="flex cursor-pointer items-center gap-1.5 text-sm font-normal">
                <CategoryIcon className={`size-3.5 ${cfg.colors.text}`} />
                {cfg.label}
              </Label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
