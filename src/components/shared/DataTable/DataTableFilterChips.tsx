'use client'

import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActiveFilter } from './filter-types'

interface DataTableFilterChipsProps {
  /** Aktif filtreler — useDataTableFilters.activeFilters */
  activeFilters: ActiveFilter[]
  /**
   * Tek filtreyi kaldırır
   * @param field - Filtre field adı
   * @param value - Multi-select'te kaldırılacak değer
   */
  onRemove: (field: string, value: string) => void
  /** Tüm filtreleri temizler */
  onClearAll: () => void
}

/**
 * Aktif filtre chip satırı.
 *
 * `activeFilters` boşsa hiçbir şey render etmez.
 * Her chip bağımsız olarak silinebilir. "Temizle" butonu tümünü kaldırır.
 *
 * Chip formatı: `"Grup Başlığı: Değer"` + sil ikonu
 *
 * `DataTable`'ın `filterChips` prop'una verilir:
 *
 * @example
 * <DataTable
 *   filterChips={
 *     <DataTableFilterChips
 *       activeFilters={filters.activeFilters}
 *       onRemove={filters.removeFilter}
 *       onClearAll={filters.clearAllFilters}
 *     />
 *   }
 * />
 */
export function DataTableFilterChips({
  activeFilters,
  onRemove,
  onClearAll,
}: DataTableFilterChipsProps) {
  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* Filtreler etiketi */}
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        Filtreler
      </span>

      {activeFilters.map((filter) => (
        <span
          key={`${filter.field}-${filter.value}`}
          className={cn(
            'group inline-flex h-6 items-center gap-0 overflow-hidden rounded-sm',
            'border border-primary/20 bg-primary/8',
            'transition-all duration-150 hover:border-primary/40 hover:bg-primary/12',
          )}
        >
          {/* Grup etiketi */}
          <span className="border-r border-primary/20  px-2 text-[10px] font-semibold uppercase tracking-wider text-primary/70">
            {filter.groupTitle}
          </span>

          {/* Değer */}
          <span className="px-2 font-mono text-[11px] font-medium text-foreground">
            {filter.label}
          </span>

          {/* Sil butonu */}
          <button
            type="button"
            onClick={() => onRemove(filter.field, filter.value)}
            className={cn(
              'flex h-full items-center border-l border-primary/20 px-1.5',
              'text-muted-foreground/40 transition-colors',
              'hover:bg-destructive/15 hover:text-destructive',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            )}
            aria-label={`${filter.groupTitle}: ${filter.label} filtresini kaldır`}
          >
            <XIcon className="size-2.5" />
          </button>
        </span>
      ))}

      {/* Temizle */}
      <button
        type="button"
        onClick={onClearAll}
        className={cn(
          'inline-flex h-6 items-center gap-1 rounded-sm px-2',
          'text-[10px] font-medium text-muted-foreground/60',
          'border border-transparent transition-all duration-150',
          'hover:border-destructive/30 hover:bg-destructive/8 hover:text-destructive',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        )}
      >
        <XIcon className="size-2.5" />
        Temizle
      </button>
    </div>
  )
}
