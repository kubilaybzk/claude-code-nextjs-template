'use client'

/**
 * Quiz Tablo Görünümü
 *
 * Quiz listesini tablo formatında gösterir.
 * Checkbox seçimi, kategori ikonları, zorluk badge ve aksiyon butonları içerir.
 *
 * @example
 * <QuizTable
 *   quizzes={quizList}
 *   tabGroup={0}
 *   currentQuizId="abc"
 *   selectedIds={['abc']}
 *   onToggleSelect={(id) => dispatch(toggleQuizSelection(id))}
 *   permissions={{ canCreate: true, canAssign: true, canViewReport: true }}
 * />
 */

import { useRouter } from 'next/navigation'

import { DataTable } from '@/components/shared/DataTable'
import type { QuizListItem } from '@/services/QuizService'
import { QuizGroup } from '../../../constants/quiz'
import { getQuizColumns } from './QuizTableColumns'

// ── Props ───────────────────────────────────────────────────

interface QuizTableProps {
  /** Quiz listesi */
  quizzes: QuizListItem[]
  /** Aktif tab grubu */
  tabGroup: number
  /** Devam eden quiz ID'si */
  currentQuizId?: string
  /** Seçili quiz ID'leri */
  selectedIds: string[]
  /** Seçim toggle callback'i */
  onToggleSelect: (id: string) => void
  /** Quiz başlat callback'i */
  onStartQuiz?: (quizId: string) => void
  /** Devam et callback'i */
  onContinueQuiz?: (quizId: string) => void
}

// ── Component ───────────────────────────────────────────────

export function QuizTable({
  quizzes,
  tabGroup,
  currentQuizId,
  selectedIds,
  onToggleSelect,
  onStartQuiz,
  onContinueQuiz,
}: QuizTableProps) {
  const router = useRouter()

  const columns = getQuizColumns({
    router,
    currentQuizId,
    isCompletedTab: tabGroup === QuizGroup.Completed,
    isUpcomingTab: tabGroup === QuizGroup.Upcoming,
    isExpiredTab: tabGroup === QuizGroup.Expired,
    onStartQuiz,
    onContinueQuiz,
  })

  return (
    <DataTable
      columns={columns}
      data={quizzes}
      variant="card"
      getRowKey={(row) => row.id}
      selection={{
        selectedIds,
        getRowId: (row) => String(row.id),
        onToggle: onToggleSelect,
      }}
      emptyTitle="No quizzes found"
      emptyDescription="There are no quizzes to display in this tab"
    />
  )
}
