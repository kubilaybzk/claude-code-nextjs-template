'use client'

/**
 * Quiz Kart Component
 *
 * Grid gorunumunde her quiz'i kart seklinde gosterir.
 * Thumbnail, status badge, kategori ikonlari, countdown timer,
 * hover action overlay ve selection modu icerir.
 *
 * @example
 * <QuizCard quiz={quiz} onStart={(id) => openRulesModal(id)} />
 *
 * @example
 * <QuizCard
 *   quiz={quiz}
 *   isSelected={selectedIds.has(quiz.id)}
 *   onToggleSelect={() => toggleSelection(quiz.id)}
 *   hasSelection
 * />
 */

import { useMemo } from 'react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { getDifficultyGradient, getDifficultyGradientColor } from '@/constants/difficulty'
import { BarChart3, Play } from 'lucide-react'
import type { QuizListItem } from '@/services/QuizService'

import { ProgressBar } from '@/components/shared/ProgressBar'
import { QuizIcons } from '../../../constants/icons'
import {
  DATE_DISPLAY_FORMAT,
  MAX_CATEGORY_ICONS,
  THUMBNAIL_PATHS,
  calculateEndTime,
} from '../../../constants/quiz'
import { formatDuration, getCardStatus, isNewQuiz } from '../../../utils/quizHelpers'
import { HoverButton } from './HoverButton'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { CountdownTimer } from '@/components/shared/CountdownTimer'

// ── Types ───────────────────────────────────────────────────

export interface QuizCardProps {
  /** Quiz list item verisi */
  quiz: QuizListItem & {
    /** Devam eden quiz mi (current_quiz olarak isaretlenmis) */
    is_current?: boolean
  }
  /** Sistemde baska aktif quiz var mi */
  hasActiveQuizInSystem?: boolean
  /** Quiz baslat callback'i */
  onStart?: (id: string) => void
  /** Devam et callback'i */
  onContinue?: () => void
  /** Rapor goster callback'i */
  onViewReport?: () => void
  /** Detay goster callback'i */
  onViewDetails?: () => void
  /** Quiz'i bitir callback'i (timer sona erdiginde) */
  onTimerComplete?: () => void
  /** Kart secili mi (toplu islem modu) */
  isSelected?: boolean
  /** Secim toggle callback'i */
  onToggleSelect?: () => void
  /** Herhangi bir kart secili mi (selection mode aktif) */
  hasSelection?: boolean
  /** Ek CSS class'lari */
  className?: string
}

// ── Component ───────────────────────────────────────────────

export function QuizCard({
  quiz,
  hasActiveQuizInSystem = false,
  onStart,
  onContinue,
  onViewReport,
  onTimerComplete,
  isSelected,
  onToggleSelect,
  hasSelection,
  className,
}: QuizCardProps) {
  const status = useMemo(() => getCardStatus(quiz), [quiz])

  const retakeLimit = quiz.retake_limit ?? 0
  const retakeCount = quiz.retake_count ?? 0
  const hasUnlimitedAttempts = retakeLimit === 0
  const hasCompletedUnlimited = hasUnlimitedAttempts && retakeCount > 0
  const isNew = isNewQuiz(quiz.not_before || undefined)

  const progressRate = quiz.question_count
    ? ((quiz.solve_question_count ?? 0) / quiz.question_count) * 100
    : 0

  const anotherQuizInProgress = hasActiveQuizInSystem && !quiz.is_current

  const thumbnailSrc = useMemo(() => {
    if (quiz.thumbnail_url) return quiz.thumbnail_url
    if (status === 'completed') return THUMBNAIL_PATHS.COMPLETED
    if (status === 'ongoing') return THUMBNAIL_PATHS.ONGOING
    return THUMBNAIL_PATHS.NEW
  }, [quiz.thumbnail_url, status])

  const timerTarget = useMemo(() => {
    if (status !== 'ongoing' || !quiz.start_date) return 0
    return calculateEndTime(quiz.start_date, quiz.duration)
  }, [status, quiz.start_date, quiz.duration])

  const gradientColor = getDifficultyGradientColor(quiz.difficulty)

  const isClickable = status === 'available' && !anotherQuizInProgress
  const showHoverActions = !hasSelection && status !== 'expired'

  return (
    <div
      className={cn(
        'group bg-card relative flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300',
        'border-border/50 hover:border-primary/30',
        'hover:shadow-primary/5 hover:shadow-lg',
        isClickable && 'cursor-pointer',
        status === 'ongoing' && 'cursor-pointer',
        isSelected && 'ring-primary ring-offset-background ring-2 ring-offset-2',
        isNew && status === 'available' && 'ring-difficulty-easy/40 ring-1',
        className,
      )}
      onClick={() => {
        if (isClickable) onStart?.(quiz.id)
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onStart?.(quiz.id)
        }
      }}
      aria-label={isClickable ? `${quiz.name} quiz'ini ac` : undefined}
    >
      {/* ── Thumbnail Area ─────────────────────────────────── */}
      <div
        className="relative flex h-[140px] items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${gradientColor}30 0%, ${gradientColor}08 50%, transparent 100%)`,
        }}
      >
        {/* Depth pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,var(--color-primary)/0.04,transparent_60%)]" />

        {/* Thumbnail image */}
        <div
          className={cn(
            'relative aspect-video w-full overflow-hidden bg-linear-to-r',
            getDifficultyGradient(quiz.difficulty),
          )}
        >
          <div className="absolute inset-3 flex items-center justify-center">
            <Image
              src={thumbnailSrc}
              alt={quiz.name ?? 'Quiz thumbnail'}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </div>
        {/* Sol ust — sure / countdown */}
        <div className="border-border/40 bg-card/80 absolute top-2 left-2 z-10 rounded-lg border px-2.5 py-1 shadow-sm backdrop-blur-sm">
          {status === 'ongoing' && timerTarget > 0 ? (
            <div className="flex items-center gap-1.5">
              <QuizIcons.meta.duration className="text-primary size-3.5" />
              <CountdownTimer
                targetDate={timerTarget}
                onComplete={onTimerComplete}
                className="text-primary text-xs font-semibold"
              />
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <QuizIcons.meta.duration className="text-muted-foreground size-3.5" />
              <span className="text-muted-foreground font-mono text-xs font-medium">
                {formatDuration(quiz.duration)}
              </span>
            </div>
          )}
        </div>

        {/* Sag ust — kategori ikonlari */}
        {quiz.category && quiz.category.length > 0 && (
          <div className="border-border/40 bg-card/80 absolute top-2 right-2 z-10 flex flex-col items-center gap-1 rounded-lg border p-1.5 shadow-sm backdrop-blur-sm">
            {quiz.category.slice(0, MAX_CATEGORY_ICONS).map((cat) => (
              <CategoryIcon key={cat} category={cat} size={14} />
            ))}
          </div>
        )}

        {/* Sol alt — status badge */}
        {status === 'ongoing' && (
          <div className="absolute bottom-2 left-2 z-10">
            <Badge className="bg-primary/90 text-primary-foreground border-0 text-[10px] font-semibold shadow-sm backdrop-blur-sm">
              In Progress
            </Badge>
          </div>
        )}

        {status === 'completed' && (
          <div className="absolute bottom-2 left-2 z-10">
            <Badge
              variant="secondary"
              className="text-[10px] font-semibold shadow-sm backdrop-blur-sm"
            >
              Completed
            </Badge>
          </div>
        )}

        {isNew && status === 'available' && (
          <div className="absolute bottom-2 left-2 z-10">
            <Badge className="bg-difficulty-easy text-primary-foreground border-0 text-[10px] font-semibold shadow-sm">
              New
            </Badge>
          </div>
        )}

        {/* Sag alt — retake dots / unlimited */}
        <div className="absolute right-2 bottom-2 z-10">
          {retakeLimit > 1 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="border-border/40 bg-card/80 flex items-center gap-1 rounded-full border px-2 py-1 backdrop-blur-sm">
                  {Array.from({ length: Math.min(retakeLimit, 5) }, (_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'size-2 rounded-full transition-colors',
                        i < retakeCount ? 'bg-primary' : 'bg-muted-foreground/25',
                      )}
                    />
                  ))}
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                {retakeCount}/{retakeLimit} Attempts
              </TooltipContent>
            </Tooltip>
          ) : hasUnlimitedAttempts ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="border-border/40 bg-card/80 flex size-7 items-center justify-center rounded-full border backdrop-blur-sm">
                  <QuizIcons.meta.attempts className="text-muted-foreground size-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Unlimited Attempts</TooltipContent>
            </Tooltip>
          ) : null}
        </div>

        {/* ── Overlays ─────────────────────────────────────── */}

        {/* Selection overlay */}
        {hasSelection && (
          <div className="bg-foreground/20 absolute inset-0 z-20 backdrop-blur-[1px]">
            <button
              type="button"
              className="absolute top-2.5 left-2.5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onToggleSelect?.()
              }}
              aria-label={isSelected ? 'Remove selection' : 'Select'}
            >
              <div
                className={cn(
                  'flex size-6 items-center justify-center rounded-md border-2 transition-all',
                  isSelected
                    ? 'border-primary bg-primary shadow-sm'
                    : 'border-muted-foreground/60 bg-card',
                )}
              >
                {isSelected && <QuizIcons.action.check className="text-primary-foreground size-3.5" />}
              </div>
            </button>
          </div>
        )}

        {/* Expired overlay */}
        {status === 'expired' && !hasSelection && (
          <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[3px]">
            <div className="border-border bg-card rounded-xl border px-5 py-4 text-center shadow-lg">
              <QuizIcons.meta.calendar className="text-muted-foreground mx-auto size-5" />
              <p className="text-muted-foreground mt-1.5 text-xs font-medium">Expired</p>
              {quiz.expires > 0 && (
                <p className="text-muted-foreground/70 mt-0.5 font-mono text-[11px]">
                  {new Date(quiz.expires * 1000).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Upcoming overlay */}
        {status === 'upcoming' && !hasSelection && (
          <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[3px]">
            <div className="border-border bg-card rounded-xl border px-5 py-4 text-center shadow-lg">
              <QuizIcons.meta.calendar className="text-muted-foreground mx-auto size-5" />
              <p className="text-muted-foreground mt-1.5 text-xs font-medium">Starts</p>
              {quiz.not_before > 0 && (
                <p className="text-foreground mt-0.5 font-mono text-[11px] font-medium">
                  {new Date(quiz.not_before * 1000).toLocaleString(undefined, DATE_DISPLAY_FORMAT)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Another quiz in progress overlay */}
        {anotherQuizInProgress && status === 'available' && !hasSelection && (
          <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center opacity-0 backdrop-blur-[3px] transition-opacity duration-200 group-hover:opacity-100">
            <div className="border-border bg-card rounded-xl border px-5 py-4 text-center shadow-lg">
              <QuizIcons.status.warning className="text-destructive mx-auto size-5" />
              <p className="text-muted-foreground mt-1.5 max-w-[160px] text-xs font-medium">
                Another quiz is in progress
              </p>
            </div>
          </div>
        )}

        {/* Hover action buttons */}
        {showHoverActions && !anotherQuizInProgress && status !== 'upcoming' && (
          <div className="bg-background/40 absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
            {status === 'ongoing' && (
              <>
                <HoverButton
                  icon={Play}
                  label="Continue"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    onContinue?.()
                  }}
                />
                {hasUnlimitedAttempts && (
                  <HoverButton
                    icon={BarChart3}
                    label="View My Report"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewReport?.()
                    }}
                  />
                )}
              </>
            )}

            {status === 'available' && (
              <>
                <HoverButton
                  icon={Play}
                  label="Start Quiz"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStart?.(quiz.id)
                  }}
                />
                {(hasUnlimitedAttempts || hasCompletedUnlimited) && (
                  <HoverButton
                    icon={BarChart3}
                    label="View Quiz Report"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewReport?.()
                    }}
                  />
                )}
              </>
            )}

            {status === 'completed' && (
              <HoverButton
                icon={BarChart3}
                label="View Report"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewReport?.()
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Content Area ─────────────────────────────────── */}
      <div className="flex flex-1 flex-col px-3 pt-2 pb-2.5">
        {/* Quiz name */}
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="text-foreground truncate text-[13px] leading-tight font-semibold">
              {quiz.name}
            </h3>
          </TooltipTrigger>
          {(quiz.name?.length ?? 0) > 22 && <TooltipContent>{quiz.name}</TooltipContent>}
        </Tooltip>

        {/* Question count */}
        <p className="text-muted-foreground mt-0.5 text-[11px]">
          {status === 'ongoing' && quiz.solve_question_count !== undefined
            ? `${quiz.solve_question_count}/${quiz.question_count} Questions`
            : `${quiz.question_count} Questions`}
        </p>

        {/* Progress bar (ongoing) */}
        {status === 'ongoing' && progressRate > 0 && (
          <ProgressBar value={progressRate} showLabel className="mt-2" />
        )}

        {/* Footer — XP + difficulty */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span
            className={cn(
              'text-muted-foreground font-bold',
              status === 'ongoing' && progressRate > 0 ? 'text-[11px]' : 'text-sm',
            )}
          >
            {quiz.max_score} XP
          </span>
          <DifficultyBadge difficulty={quiz.difficulty} locale="en" />
        </div>
      </div>
    </div>
  )
}
