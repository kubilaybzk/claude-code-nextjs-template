'use client'

/**
 * Quiz Kural Seti Modalı
 *
 * Quiz başlatılmadan önce quiz kurallarını gösterir.
 * Her kural ikon + başlık + açıklama cümlesi formatında listelenir.
 *
 * @example
 * <QuizRuleSetModal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   quizId={selectedQuizId}
 *   onConfirm={handleConfirmStart}
 *   isPending={isStarting}
 * />
 */

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import * as QuizService from '@/services/QuizService'
import { QuizIcons } from '../../../constants/icons'

// ── Types ──────────────────────────────────────────────────────

/** QuizRuleSetModal props */
interface QuizRuleSetModalProps {
  /** Diyalog açık mı */
  open: boolean
  /** Kapatma callback'i */
  onClose: () => void
  /** Kuralları gösterilecek quiz ID'si */
  quizId: string | null
  /** "Quiz'i Başlat" onay callback'i */
  onConfirm: () => void
  /** API çağrısı devam ediyor mu */
  isPending?: boolean
}

// ── Helpers ────────────────────────────────────────────────────

const SCORING_LABELS: Record<number, string> = {
  0: 'first attempt',
  1: 'average',
  2: 'highest',
  3: 'last attempt',
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h} hour${h > 1 ? 's' : ''} ${m > 0 ? `${m} min` : ''}`
  return `${m} min`
}

// ── Sub-Components ─────────────────────────────────────────────

interface RuleItemProps {
  icon: React.ElementType
  title: string
  desc: React.ReactNode
  index: number
  accent?: 'primary' | 'chart-3' | 'chart-2' | 'secondary' | 'primary' | 'destructive'
}

/**
 * Accent style mappings for rule items.
 * Uses semantic tokens for colors instead of raw Tailwind.
 * - chart-2: Emerald (green)
 * - chart-3: Amber (yellow)
 * - secondary: Sky (blue)
 * - primary: Violet (purple)
 * - destructive: Rose (red)
 */
const ACCENT_STYLES = {
  primary: {
    border: 'border-primary/40',
    iconBg: 'bg-primary/10',
    iconText: 'text-primary',
    glow: 'shadow-primary/20',
    dot: 'bg-primary',
  },
  'chart-3': {
    border: 'border-chart-3/40',
    iconBg: 'bg-chart-3/10',
    iconText: 'text-chart-3',
    glow: 'shadow-chart-3/20',
    dot: 'bg-chart-3',
  },
  'chart-2': {
    border: 'border-chart-2/40',
    iconBg: 'bg-chart-2/10',
    iconText: 'text-chart-2',
    glow: 'shadow-chart-2/20',
    dot: 'bg-chart-2',
  },
  secondary: {
    border: 'border-secondary/40',
    iconBg: 'bg-secondary/10',
    iconText: 'text-secondary',
    glow: 'shadow-secondary/20',
    dot: 'bg-secondary',
  },
  destructive: {
    border: 'border-destructive/40',
    iconBg: 'bg-destructive/10',
    iconText: 'text-destructive',
    glow: 'shadow-destructive/20',
    dot: 'bg-destructive',
  },
}

function RuleItem({ icon: Icon, title, desc, index, accent = 'primary' }: RuleItemProps) {
  const s = ACCENT_STYLES[accent]

  return (
    <div
      className={cn(
        'group relative flex gap-3.5 rounded-lg border p-3.5 transition-all duration-200',
        'bg-card/40 hover:bg-card/80',
        s.border,
        'hover:shadow-sm',
        s.glow,
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg',
          s.iconBg,
        )}
      >
        <Icon className={cn('size-4', s.iconText)} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] font-semibold leading-snug text-foreground">{title}</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">{desc}</p>
      </div>

      {/* Active dot */}
      <div
        className={cn(
          'absolute top-3 right-3 size-1.5 rounded-full opacity-60',
          s.dot,
        )}
      />
    </div>
  )
}

function SkeletonRules() {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3.5 rounded-lg border border-border/30 p-3.5">
          <Skeleton className="size-9 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────

/**
 * Quiz başlatmadan önce kural setini gösteren modal.
 */
export function QuizRuleSetModal({
  open,
  onClose,
  quizId,
  onConfirm,
  isPending = false,
}: QuizRuleSetModalProps) {
  const { data: quiz, isLoading } = QuizService.useGetQuizDetail(quizId ?? '', {
    enabled: open && !!quizId,
  })

  // Kural listesini oluştur
  const rules: RuleItemProps[] = []

  if (quiz) {
    // Navigasyon — her zaman göster
    if (!quiz.navigation) {
      rules.push({
        icon: QuizIcons.wizard.navigation,
        title: 'Sequential Progress',
        desc: 'Questions appear in order; once you move past a question, you cannot go back.',
        accent: 'secondary',
        index: rules.length,
      })
    } else {
      rules.push({
        icon: QuizIcons.wizard.navigation,
        title: 'Free Navigation',
        desc: 'You can move back and forth between questions freely.',
        accent: 'secondary',
        index: rules.length,
      })
    }

    // Cevap gösterimi
    if (quiz.show_question_answer) {
      rules.push({
        icon: QuizIcons.solve.correct,
        title: 'Instant Feedback',
        desc: 'You will immediately see whether your answer is correct or incorrect.',
        accent: 'chart-2',
        index: rules.length,
      })
    }

    // Skor gösterimi
    if (quiz.show_result_score) {
      rules.push({
        icon: QuizIcons.solve.trophy,
        title: 'Result Score',
        desc: 'Your total score will be shown on the screen when the quiz ends.',
        accent: 'chart-3',
        index: rules.length,
      })
    }

    // Geçerli skor — her zaman göster
    rules.push({
      icon: QuizIcons.wizard.kpi,
      title: 'Applied Score',
      desc: (
        <>
          Your final score is calculated based on the{' '}
          <span className="font-semibold text-foreground">
            {SCORING_LABELS[quiz.scoring_algorithm] ?? 'last attempt'}
          </span>{' '}
          result.
        </>
      ),
      accent: 'primary',
      index: rules.length,
    })

    // Pas hakkı
    if (quiz.pass_limit > 0 && !quiz.navigation) {
      rules.push({
        icon: QuizIcons.wizard.pass,
        title: 'Pass Limit',
        desc: (
          <>
            You can skip questions you do not know. You have{' '}
            <span className="font-semibold text-foreground">{quiz.pass_limit}</span> passes in total.
          </>
        ),
        accent: 'chart-3',
        index: rules.length,
      })
    }

    // Deneme hakkı
    if (quiz.retake_limit > 1) {
      const remaining = quiz.retake_limit - quiz.retake_count
      rules.push({
        icon: QuizIcons.solve.retry,
        title: 'Retry',
        desc: (
          <>
            You can take this quiz more than once. Remaining attempts:{' '}
            <span className="font-semibold text-foreground">{remaining}</span>.
          </>
        ),
        accent: 'primary',
        index: rules.length,
      })
    }

    // İpucu
    if (quiz.allow_hint) {
      rules.push({
        icon: QuizIcons.solve.hint,
        title: 'Hint Usage',
        desc: 'You can request a hint for difficult questions; taking a hint reduces the score for that question.',
        accent: 'destructive',
        index: rules.length,
      })
    }

    // Süre
    if (quiz.duration > 0) {
      rules.push({
        icon: QuizIcons.meta.duration,
        title: 'Time Limit',
        desc: (
          <>
            You have{' '}
            <span className="font-semibold text-foreground">{formatDuration(quiz.duration)}</span>{' '}
            to complete the quiz. When time runs out, the quiz is submitted automatically.
          </>
        ),
        accent: 'destructive',
        index: rules.length,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="relative overflow-hidden px-6 pt-6 pb-5">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/0.08,transparent_60%)]" />
          <div className="pointer-events-none absolute top-0 right-0 h-px w-2/3 bg-gradient-to-l from-transparent via-primary/30 to-transparent" />

          <DialogTitle className="sr-only">Quiz Rules</DialogTitle>

        <div className="relative flex items-start gap-4">
            {/* Icon block */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-lg shadow-primary/10">
              <QuizIcons.wizard.rules className="size-5 text-primary" />
            </div>

            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Quiz Rules
              </p>
              {isLoading ? (
                <Skeleton className="mt-1 h-5 w-48" />
              ) : (
                <h2 className="text-base font-semibold leading-snug text-foreground">
                  {quiz?.name ?? ''}
                </h2>
              )}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* ── Rules list ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <SkeletonRules />
          ) : (
            <div className="flex flex-col gap-2.5">
              {rules.map((rule) => (
                <RuleItem key={rule.title} {...rule} />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="relative border-t border-border/50 px-6 pt-4 pb-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--color-primary)/0.04,transparent_60%)]" />

          {/* Good luck */}
          {!isLoading && (
            <p className="relative mb-4 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
              Good luck
            </p>
          )}

          <DialogFooter className="relative flex-row gap-2 sm:justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isPending || isLoading}
              className="relative flex-1 overflow-hidden"
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,white/10,transparent_70%)]" />
              {isPending ? 'Starting...' : 'Start Quiz'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
