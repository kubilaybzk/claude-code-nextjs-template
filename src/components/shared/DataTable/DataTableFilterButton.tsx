'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FilterIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DataTableFilterPanel } from './DataTableFilterPanel'
import type { FilterGroup } from './filter-types'

interface DataTableFilterButtonProps {
  /** Filtre grupları konfigürasyonu */
  groups: FilterGroup[]
  /** Mevcut filtre değerleri — useDataTableFilters'dan gelir */
  filterValues: Record<string, string | string[] | undefined>
  /** Filtre değiştiğinde çağrılır — useDataTableFilters.setFilter */
  onFilterChange: (field: string, value: string | string[] | undefined) => void
  /** Aktif filtre sayısı — buton badge için */
  activeFilterCount: number
  /** Ek className */
  className?: string
}

/**
 * DataTable filtre butonu ve Popover paneli.
 *
 * Aktif filtre varsa buton üzerinde sayaç badge gösterir.
 * Popover içinde `DataTableFilterPanel` render eder.
 *
 * `DataTableToolbar`'ın `children` slotuna yerleştirilir:
 *
 * @example
 * <DataTableToolbar search={...}>
 *   <DataTableFilterButton
 *     groups={MY_FILTERS}
 *     filterValues={filters.filterValues}
 *     onFilterChange={filters.setFilter}
 *     activeFilterCount={filters.activeFilterCount}
 *   />
 * </DataTableToolbar>
 */
export function DataTableFilterButton({
  groups,
  filterValues,
  onFilterChange,
  activeFilterCount,
  className,
}: DataTableFilterButtonProps) {
  const hasActiveFilters = activeFilterCount > 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'relative gap-1.5 text-xs transition-all duration-150',
            hasActiveFilters
              ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.15)] hover:bg-primary/15 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]'
              : 'hover:border-border',
            className,
          )}
        >
          <FilterIcon className="size-3.5" />
          <span className="hidden sm:inline">Filtre</span>
          {hasActiveFilters && (
            <span className={cn(
              'ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-sm px-1',
              'bg-primary text-[9px] font-bold tabular-nums text-primary-foreground',
            )}>
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[calc(100vw-2rem)] p-0 sm:w-[480px] lg:w-[640px]"
      >
        {/* Panel başlığı */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <FilterIcon className="size-3.5 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Filtreler</h3>
          </div>
          {hasActiveFilters && (
            <span className={cn(
              'inline-flex items-center gap-1 rounded-sm px-2 py-0.5',
              'bg-primary/10 text-[10px] font-semibold text-primary',
            )}>
              <span className="size-1.5 rounded-full bg-primary" />
              {activeFilterCount} aktif
            </span>
          )}
        </div>

        {/* Filtre grupları */}
        <div className="p-5">
          <DataTableFilterPanel
            groups={groups}
            filterValues={filterValues}
            onFilterChange={onFilterChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
