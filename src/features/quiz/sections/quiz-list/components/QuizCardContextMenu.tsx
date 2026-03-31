'use client'

/**
 * Quiz Kart Context Menu
 *
 * Sag tik ile acilan islem menusu. Kullanici yetkilerine gore
 * Edit, Assign, Delete, Select ve View Report seceneklerini gosterir.
 *
 * @example
 * <QuizCardContextMenu
 *   onEdit={() => router.push(paths.quiz.edit(quiz.id))}
 *   onViewReport={() => router.push(paths.quiz.report(quiz.id))}
 * >
 *   <QuizCard quiz={quiz} />
 * </QuizCardContextMenu>
 */

import { BarChart3, Trash2, Edit, Users, CheckCircle, Circle } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface QuizCardContextMenuProps {
  /** Sarmalanan icerik (QuizCard) */
  children: React.ReactNode
  /** Edit callback'i */
  onEdit?: () => void
  /** Assign callback'i */
  onAssign?: () => void
  /** Delete callback'i */
  onDelete?: () => void
  /** Rapor goster callback'i */
  onViewReport?: () => void
  /** Secim toggle callback'i */
  onToggleSelect?: () => void
  /** Kart secili mi */
  isSelected?: boolean
}

export function QuizCardContextMenu({
  children,
  onEdit,
  onAssign,
  onDelete,
  onViewReport,
  onToggleSelect,
  isSelected,
}: QuizCardContextMenuProps) {
  const hasAnyAction = Boolean(onEdit) || Boolean(onAssign) || Boolean(onDelete) || Boolean(onViewReport) || Boolean(onToggleSelect)

  if (!hasAnyAction) {
    return <>{children}</>
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="contents">{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-44">
        {onViewReport && (
          <ContextMenuItem onClick={onViewReport}>
            <BarChart3 data-icon="inline-start" />
            View Report
          </ContextMenuItem>
        )}

        {onEdit && (
          <ContextMenuItem onClick={onEdit}>
            <Edit data-icon="inline-start" />
            Edit
          </ContextMenuItem>
        )}

        {onAssign && (
          <ContextMenuItem onClick={onAssign}>
            <Users data-icon="inline-start" />
            Assign
          </ContextMenuItem>
        )}

        {onToggleSelect && (
          <ContextMenuItem onClick={onToggleSelect}>
            {isSelected ? (
              <CheckCircle data-icon="inline-start" />
            ) : (
              <Circle data-icon="inline-start" />
            )}
            {isSelected ? 'Remove Selection' : 'Select'}
          </ContextMenuItem>
        )}

        {onDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2 data-icon="inline-start" />
              Delete
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
