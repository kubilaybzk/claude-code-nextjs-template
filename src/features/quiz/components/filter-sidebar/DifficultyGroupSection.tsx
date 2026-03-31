'use client'

/**
 * Zorluk Grubu Filtre Bolumu
 *
 * Tek bir zorluk grubunu (ornegin Seviye 1) genisletilebilir
 * checkbox listesi olarak gosterir.
 *
 * @example
 * <DifficultyGroupSection
 *   group={{ level: 1, label: 'Kolay (Seviye 1)', color: 'bg-difficulty-easy' }}
 *   difficulties={[1.1, 1.2, 1.3]}
 *   filters={filters}
 *   onFilterChange={onFilterChange}
 * />
 */

import { useState } from 'react'

import { cn } from '@/lib/utils'
import { getDifficultyLevel } from '@/constants/difficulty'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import type { DifficultyGroup, QuizFilterValues } from './filterTypes'
import { formatDifficultyLabel } from './filterTypes'

// ── Types ───────────────────────────────────────────────────

interface DifficultyGroupSectionProps {
  /** Zorluk grubu tanimi */
  group: DifficultyGroup
  /** Bu gruptaki zorluk degerleri */
  difficulties: readonly number[]
  /** Aktif filtre degerleri */
  filters: QuizFilterValues
  /** Filtre degisim callback'i */
  onFilterChange: (key: string, value: unknown) => void
}

// ── Component ───────────────────────────────────────────────

export function DifficultyGroupSection({
  group,
  difficulties,
  filters,
  onFilterChange,
}: DifficultyGroupSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleToggle = (difficulty: number, checked: boolean) => {
    const current = filters.difficulty ?? []
    const next = checked
      ? [...current, difficulty]
      : current.filter((d) => d !== difficulty)
    onFilterChange('difficulty', next.length > 0 ? next : undefined)
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="ghost"
        type="button"
        className="flex h-auto w-full items-center justify-start gap-1.5 rounded-md px-1 py-1 text-sm font-medium text-foreground hover:bg-muted"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${group.label} group`}
      >
        <span
          className={cn(
            'size-3.5 text-muted-foreground transition-transform duration-200',
            isExpanded ? '' : '-rotate-90',
          )}
        >
          ▾
        </span>
        <span className={cn('mr-1 inline-block size-2 rounded-full', group.color)} />
        {group.label}
      </Button>

      {isExpanded && (
        <div className="ml-5 flex flex-col gap-1.5">
          {difficulties.map((difficulty) => {
            const id = `quiz-difficulty-${difficulty}`
            const checked = filters.difficulty?.includes(difficulty) ?? false

            return (
              <div key={difficulty} className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={(val) => handleToggle(difficulty, val === true)}
                  aria-label={formatDifficultyLabel(difficulty)}
                />
                <Label htmlFor={id} className="cursor-pointer text-sm font-normal">
                  <span
                    className={cn(
                      'mr-1.5 inline-block size-1.5 rounded-full',
                      getDifficultyLevel(difficulty).bgColor,
                    )}
                  />
                  {formatDifficultyLabel(difficulty)}
                </Label>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
