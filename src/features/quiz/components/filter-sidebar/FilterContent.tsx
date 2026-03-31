'use client'

/**
 * Quiz Filtre Icerik Paneli
 *
 * Kategori ve zorluk filtrelerini bir arada sunar.
 * Hem desktop sidebar hem de mobil Sheet icinde kullanilir.
 *
 * @example
 * <FilterContent
 *   filters={filters}
 *   onFilterChange={onFilterChange}
 *   onClearFilters={onClearFilters}
 *   hasActiveFilters={hasActiveFilters}
 * />
 */

import { VALID_DIFFICULTIES } from '@/constants/difficulty'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import type { DifficultyGroup, QuizFilterValues } from './filterTypes'
import { DIFFICULTY_FILTER_GROUPS } from './filterTypes'
import { CategoryFilterSection } from './CategoryFilterSection'
import { DifficultyGroupSection } from './DifficultyGroupSection'

// ── Types ───────────────────────────────────────────────────

interface FilterContentProps {
  /** Aktif filtre degerleri */
  filters: QuizFilterValues
  /** Filtre degisim callback'i */
  onFilterChange: (key: string, value: unknown) => void
  /** Tum filtreleri temizle */
  onClearFilters: () => void
  /** Aktif filtre var mi */
  hasActiveFilters: boolean
}

// ── Component ───────────────────────────────────────────────

export function FilterContent({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: FilterContentProps) {
  const groupedDifficulties = DIFFICULTY_FILTER_GROUPS.map((group: DifficultyGroup) => ({
    group,
    difficulties: VALID_DIFFICULTIES.filter(
      (d) => Math.floor(d) === group.level,
    ),
  }))

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-auto px-2 py-1 text-xs"
            aria-label="Clear all filters"
          >
            Clear
          </Button>
        )}
      </div>

      <Separator />

      {/* Kategori */}
      <CategoryFilterSection
        filters={filters}
        onFilterChange={onFilterChange}
      />

      <Separator />

      {/* Zorluk Seviyesi */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-foreground">Difficulty Level</h4>
        <div className="flex flex-col gap-1">
          {groupedDifficulties.map(({ group, difficulties }: { group: DifficultyGroup; difficulties: number[] }) => (
            <DifficultyGroupSection
              key={group.level}
              group={group}
              difficulties={difficulties}
              filters={filters}
              onFilterChange={onFilterChange}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
