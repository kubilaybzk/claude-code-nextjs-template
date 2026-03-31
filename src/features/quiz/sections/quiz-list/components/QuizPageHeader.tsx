'use client'

/**
 * Quiz Sayfa Header
 *
 * Arama, filtre, toplam sayi, gorunum modu ve olusturma butonlarini gosterir.
 * Iki satirli layout: arama (ust) + toolbar (alt).
 *
 * @example
 * <QuizPageHeader
 *   totalCount={32}
 *   searchValue={searchInput}
 *   onSearchChange={setSearchInput}
 *   viewMode="grid"
 *   onViewModeChange={(mode) => dispatch(setViewMode(mode))}
 *   filterSlot={<Button>Filtreler</Button>}
 * />
 */
import { useRouter } from 'next/navigation'

import { LayoutGrid, List, Plus, Search } from 'lucide-react'
import { paths } from '@/config/paths'
import { cn } from '@/lib/utils'
import { QuizIcons } from '../../../constants/icons'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ── Types ───────────────────────────────────────────────────

interface QuizPageHeaderProps {
  /** Toplam quiz sayisi */
  totalCount: number
  /** Arama input degeri */
  searchValue: string
  /** Arama degisim callback'i */
  onSearchChange: (value: string) => void
  /** Gorunum modu */
  viewMode: 'grid' | 'table'
  /** Gorunum degisim callback'i */
  onViewModeChange: (mode: 'grid' | 'table') => void
  /** Olusturma yetkisi var mi */
  canCreate?: boolean
  /** Filtre buton slotu — toolbar'in sol tarafina yerlestirilir */
  filterSlot?: React.ReactNode
  /** Ek CSS class'lari */
  className?: string
}

// ── Component ───────────────────────────────────────────────

export function QuizPageHeader({
  totalCount,
  searchValue,
  onSearchChange,
  viewMode,
  onViewModeChange,
  canCreate = true,
  filterSlot,
  className,
}: QuizPageHeaderProps) {
  const router = useRouter()

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Arama */}
      <div className="relative w-full sm:max-w-sm">
        <Search data-icon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search quizzes..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search quizzes"
        />
      </div>

      {/* Toolbar: Filtre (sol) + Aksiyonlar (sag) */}
      <div className="flex items-center justify-between">
        {/* Sol: Filtre butonu (mobilde gorunur) */}
        <div className="lg:hidden">
          {filterSlot}
        </div>

        {/* Sag: Count + View toggle + Actions */}
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="hidden shrink-0 tabular-nums sm:inline-flex">
            {totalCount} Quiz
          </Badge>

          {/* View toggle */}
          <div className="flex items-center rounded-md border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'rounded-r-none',
                viewMode === 'grid'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              aria-label="Grid view"
            >
              <LayoutGrid data-icon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewModeChange('table')}
              className={cn(
                'rounded-l-none',
                viewMode === 'table'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              aria-label="Table view"
            >
              <List data-icon />
            </Button>
          </div>

          {/* Soru Bankasi */}
          <Button
            variant="outline"
            onClick={() => router.push(paths.quiz.questions)}
            className="gap-1.5"
          >
            <QuizIcons.meta.questions data-icon="inline-start" />
            <span className="hidden sm:inline">Question Bank</span>
          </Button>

          {/* Quiz Ekle */}
          {canCreate && (
            <Button onClick={() => router.push(paths.quiz.form)} className="gap-1.5">
              <Plus data-icon="inline-start" />
              <span className="hidden sm:inline">Add Quiz</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
