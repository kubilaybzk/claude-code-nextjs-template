/**
 * Soru bankası kart görünümü bileşeni.
 * Grid view'da her soru için render edilir.
 *
 * @example
 * <QuestionCard question={q} onEdit={handleEdit} onDelete={setDeleteId} />
 */
'use client'

import { useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { AlertTriangle, CheckCircle, Clock, Zap, BarChart3, HelpCircle, Eye, EyeOff, Share2, Copy, Download, RefreshCw, Search, X, Filter, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { paths } from '@/config/paths'
import { QuizIcons } from '@/features/quiz/constants/icons'
import type { QuestionListItem } from '@/services/QuizService'

interface QuestionCardProps {
  /** Gösterilecek soru verisi */
  question: QuestionListItem
  /** Silme diyaloğunu tetikler */
  onDelete: (id: string) => void
}

/**
 * Soru bankası grid view kart bileşeni.
 * Sorunun başlık, puan, meta bilgileri ve aksiyonlarını gösterir.
 */
export function QuestionCard({ question: q, onDelete }: QuestionCardProps) {
  const router = useRouter()

  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-medium">{q.title}</p>
          {q.description && (
            <p className="text-muted-foreground truncate text-xs">{q.description}</p>
          )}
        </div>
        <Badge variant="secondary" className="font-mono shrink-0">
          {q.score} XP
        </Badge>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className="text-xs">
          {q.type ? 'Multiple' : 'Single'}
        </Badge>
        <DifficultyBadge difficulty={q.difficulty} />
        {q.category.slice(0, 3).map((cat) => (
          <CategoryIcon key={cat} category={cat} size={16} />
        ))}
        {q.category.length > 3 && (
          <span className="text-muted-foreground text-xs">+{q.category.length - 3}</span>
        )}
        {q.hint && <QuizIcons.status.completed data-icon className="text-primary size-4" />}
      </div>

      {/* Başarı oranı */}
      {q.success_rate != null && (
        <div className="flex items-center gap-2">
          <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                q.success_rate >= 70
                  ? 'bg-primary'
                  : q.success_rate >= 40
                    ? 'bg-chart-3'
                    : 'bg-destructive',
              )}
              style={{ width: `${Math.min(100, Math.round(q.success_rate))}%` }}
            />
          </div>
          <span className="text-muted-foreground font-mono text-xs tabular-nums">
            %{Math.round(q.success_rate)}
          </span>
        </div>
      )}

      {/* Aksiyonlar */}
      <div className="border-border mt-auto flex items-center justify-end gap-1 border-t pt-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => router.push(paths.quiz.questionEdit(q.id))}
              aria-label="Edit"
            >
              <Edit data-icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Edit
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => onDelete(q.id)}
              aria-label="Delete"
            >
              <Trash2 data-icon className="text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Delete
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
