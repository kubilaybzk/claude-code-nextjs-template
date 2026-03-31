import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { BarChart3, Eye, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { paths } from '@/config/paths'
import { getCategoryConfig } from '@/constants/categories'
import { formatDuration, formatTimestamp, isQuizOngoing } from '@/features/quiz/utils/quizHelpers'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import type { DataTableColumn } from '@/components/shared/DataTable'
import type { QuizListItem } from '@/services/QuizService'

interface GetQuizColumnsParams {
  /** Next.js router instance */
  router: ReturnType<typeof useRouter>
  /** Devam eden quiz ID'si */
  currentQuizId?: string
  /** Tab durumu bayrakları */
  isCompletedTab: boolean
  isUpcomingTab: boolean
  isExpiredTab: boolean
  /** Quiz başlat callback'i */
  onStartQuiz?: (quizId: string) => void
  /** Devam et callback'i */
  onContinueQuiz?: (quizId: string) => void
}

/**
 * Quiz listesi tablo kolonları
 *
 * @example
 * const columns = getQuizColumns({ router, currentQuizId, isCompletedTab, ... })
 */
export function getQuizColumns({
  router,
  currentQuizId,
  isCompletedTab,
  isUpcomingTab,
  isExpiredTab,
  onStartQuiz,
  onContinueQuiz,
}: GetQuizColumnsParams): DataTableColumn<QuizListItem>[] {
  return [
    {
      id: 'name',
      header: 'Quiz Name',
      cell: ({ row }) => (
        <span
          className="max-w-64 truncate text-sm font-medium text-foreground"
          title={row.original.name.length > 45 ? row.original.name : undefined}
        >
          {row.original.name}
        </span>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const categories = [...new Set(row.original.category)].slice(0, 3)
        return (
          <div className="flex items-center gap-1">
            {categories.map((catId) => {
              const cfg = getCategoryConfig(catId)
              const Icon = cfg.icon
              return (
                <Tooltip key={catId}>
                  <TooltipTrigger asChild>
                    <div className={cn('flex size-6 items-center justify-center rounded', cfg.colors.bg)}>
                      <Icon className={cn('size-3.5', cfg.colors.text)} aria-hidden="true" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">{cfg.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        )
      },
    },
    {
      id: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }) => (
        <DifficultyBadge difficulty={row.original.difficulty} showValue={false} locale="en" />
      ),
    },
    {
      id: 'question_count',
      header: 'Questions',
      meta: { align: 'center' },
      cell: ({ row }) => {
        const isOngoing =
          row.original.id === currentQuizId ||
          isQuizOngoing(row.original.start_date, row.original.duration)
        return isOngoing ? (
          <span className="font-mono text-xs">
            <span className="text-cyber-quiz">{row.original.solve_question_count}</span>
            <span className="text-muted-foreground">/{row.original.question_count}</span>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">{row.original.question_count}</span>
        )
      },
    },
    {
      id: 'duration',
      header: 'Duration',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {formatDuration(row.original.duration)}
        </span>
      ),
    },
    {
      id: 'max_score',
      header: 'Score',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-cyber-quiz">
          {row.original.max_score} XP
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      meta: { align: 'right', width: 'w-28' },
      cell: ({ row }) => {
        const isOngoing =
          row.original.id === currentQuizId ||
          isQuizOngoing(row.original.start_date, row.original.duration)
        return (
          <div className="flex items-center justify-end gap-1">
            {isUpcomingTab ? (
              <span className="text-[10px] text-muted-foreground">
                {formatTimestamp(row.original.not_before)}
              </span>
            ) : isExpiredTab ? (
              <span className="text-[10px] text-muted-foreground">Expired</span>
            ) : isOngoing ? (
              <Button size="xs" onClick={() => onContinueQuiz?.(String(row.original.id))}>
                <Play data-icon="inline-start" />
                Continue
              </Button>
            ) : isCompletedTab ? (
              <Button
                size="xs"
                variant="outline"
                onClick={() => router.push(paths.quiz.report(String(row.original.id)))}
              >
                <Eye data-icon="inline-start" />
                Details
              </Button>
            ) : (
              <Button size="xs" onClick={() => onStartQuiz?.(String(row.original.id))}>
                <Play data-icon="inline-start" />
                Start
              </Button>
            )}

            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => router.push(paths.quiz.report(String(row.original.id)))}
              aria-label="View report"
            >
              <BarChart3 />
            </Button>
          </div>
        )
      },
    },
  ]
}
