'use client'

/**
 * Quiz Filtre Sidebar
 *
 * Desktop'ta sticky sol sidebar, mobilde Sheet drawer olarak gorunur.
 * Mobil Sheet durumu disaridan `mobileOpen` / `onMobileOpenChange` ile kontrol edilir.
 *
 * @example
 * // Disaridan kontrol
 * const [filterOpen, setFilterOpen] = useState(false)
 * <Button onClick={() => setFilterOpen(true)}>Filtreler</Button>
 * <QuizFilterSidebar mobileOpen={filterOpen} onMobileOpenChange={setFilterOpen} ... />
 */

import { useState } from 'react'

import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Clock, Zap, BarChart3, HelpCircle, Eye, EyeOff, Share2, Copy, Download, RefreshCw, Search, X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import type { QuizFilterValues } from './filterTypes'
import { FilterContent } from './FilterContent'

// ── Types ───────────────────────────────────────────────────

interface QuizFilterSidebarProps {
  /** Aktif filtre degerleri */
  filters: QuizFilterValues
  /** Filtre degisim callback'i */
  onFilterChange: (key: string, value: unknown) => void
  /** Tum filtreleri temizle */
  onClearFilters: () => void
  /** Disaridan kontrol edilen mobil sheet durumu */
  mobileOpen?: boolean
  /** Mobil sheet durum degisim callback'i */
  onMobileOpenChange?: (open: boolean) => void
  /** Ek CSS class'lari */
  className?: string
}

// ── Component ───────────────────────────────────────────────

export function QuizFilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  mobileOpen,
  onMobileOpenChange,
  className,
}: QuizFilterSidebarProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = mobileOpen !== undefined
  const sheetOpen = isControlled ? mobileOpen : internalOpen
  const setSheetOpen = isControlled ? (onMobileOpenChange ?? setInternalOpen) : setInternalOpen

  const hasActiveFilters = filters.categories.length > 0 || filters.difficulty.length > 0

  return (
    <>
      {/* Mobile: Sheet (trigger disarida render edilir) */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        {/* Kontrol edilmiyorsa dahili trigger goster */}
        {!isControlled && (
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSheetOpen(true)}
              aria-label="Open filters"
            >
              <Filter className="size-4" data-icon="inline-start" />
              Filters
              {hasActiveFilters && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {filters.categories.length + filters.difficulty.length}
                </span>
              )}
            </Button>
          </div>
        )}
        <SheetContent side="left" className="w-80 overflow-y-auto p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="px-4 py-4">
            <FilterContent
              filters={filters}
              onFilterChange={onFilterChange}
              onClearFilters={onClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop: Sticky sidebar */}
      <aside
        className={cn(
          'sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto',
          'rounded-lg border border-border bg-background p-4',
          className,
        )}
        aria-label="Filter panel"
      >
        <FilterContent
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </aside>
    </>
  )
}
