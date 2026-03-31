import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { DataTableColumn } from '@/components/shared/DataTable'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { AlertTriangle, CheckCircle, Clock, Zap, BarChart3, HelpCircle, Eye, EyeOff, Share2, Copy, Download, RefreshCw, Search, X, Filter, Circle, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { paths } from '@/config/paths'
import { QuizIcons } from '@/features/quiz/constants/icons'
import type { QuestionListItem } from '@/services/QuizService'

interface GetQuestionColumnsParams {
  /** Next.js router instance */
  router: { push: (path: string) => void }
  /** Delete butonu tıklandığında soru ID'sini iletir */
  onDelete: (id: string) => void
}

/**
 * Soru bankası tablosu için kolon tanımları.
 *
 * @example
 * const columns = getQuestionColumns({ router, onDelete: setDeleteId })
 */
export function getQuestionColumns({
  router,
  onDelete,
}: GetQuestionColumnsParams): DataTableColumn<QuestionListItem>[] {
  return [
    {
      id: 'title',
      header: 'Question',
      meta: { cellClassName: 'max-w-[280px]' },
      cell: ({ row }) => {
        const { title, description } = row.original
        return (
          <div>
            <span className="text-foreground block truncate text-sm font-medium">{title}</span>
            {description && (
              <span className="text-muted-foreground block truncate text-xs">{description}</span>
            )}
          </div>
        )
      },
    },
    {
      id: 'score',
      header: 'Score',
      meta: { align: 'center' },
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          {row.original.score} XP
        </Badge>
      ),
    },
    {
      id: 'success_rate',
      header: 'Success',
      meta: { align: 'center', responsive: 'md' },
      cell: ({ row }) => {
        const rate = row.original.success_rate
        if (rate == null) return <span className="text-muted-foreground text-xs">-</span>
        return (
          <div className="flex items-center justify-center gap-2">
            <div className="bg-muted h-1.5 w-12 overflow-hidden rounded-full">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  rate >= 70 ? 'bg-primary' : rate >= 40 ? 'bg-chart-3' : 'bg-destructive',
                )}
                style={{ width: `${Math.min(100, Math.round(rate))}%` }}
              />
            </div>
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              %{Math.round(rate)}
            </span>
          </div>
        )
      },
    },
    {
      id: 'type',
      header: 'Type',
      meta: { responsive: 'sm' },
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.original.type ? 'Multiple' : 'Single'}
        </Badge>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      meta: { responsive: 'lg' },
      cell: ({ row }) => {
        const { category } = row.original
        return (
          <div className="flex items-center gap-1.5">
            {category.slice(0, 3).map((cat) => (
              <CategoryIcon key={cat} category={cat} size={16} />
            ))}
            {category.length > 3 && (
              <span className="text-muted-foreground text-xs">+{category.length - 3}</span>
            )}
          </div>
        )
      },
    },
    {
      id: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }) => <DifficultyBadge difficulty={row.original.difficulty} />,
    },
    {
      id: 'hint',
      header: 'Hint',
      meta: { align: 'center', responsive: 'md' },
      cell: ({ row }) =>
        row.original.hint ? (
          <QuizIcons.status.completed data-icon className="text-primary mx-auto" />
        ) : (
          <Circle data-icon className="text-muted-foreground/50 mx-auto" />
        ),
    },
    {
      id: 'actions',
      header: 'Action',
      meta: { align: 'right', width: 'w-24' },
      cell: ({ row }) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => router.push(paths.quiz.questionEdit(row.original.id))}
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
                onClick={() => onDelete(row.original.id)}
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
      ),
    },
  ]
}
