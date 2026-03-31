'use client'

/**
 * Soru Bankasi liste sayfasi.
 * Sayfalanmis, aranabilir soru tablosu/kart gorunumu gosterir.
 *
 * @module app/(dashboard)/quiz/questions/page
 */
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { paths } from '@/config/paths'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import LayouthIcons from '@/components/layout/LayouthIcons'
import { ComponentErrorBoundary } from '@/components/shared/ComponentErrorBoundary'
import { DataTable, DataTableToolbar, useDataTableFilters } from '@/components/shared/DataTable'
import { QuizIcons } from '@/features/quiz/constants/icons'
import { LayoutGrid, List, Plus } from 'lucide-react'
import * as QuizService from '@/services/QuizService'
import { getQuestionColumns } from './components/QuestionTableColumns'
import { QuestionCard } from './components/QuestionCard'

export function QuestionListPage() {
  const router = useRouter()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const filters = useDataTableFilters([], {
    prefix: 'question',
    defaultLimit: 10,
    searchPlaceholder: 'Search questions...',
  })

  const { data: listData, isLoading } = QuizService.useGetQuestionList({
    search: filters.debouncedSearch || undefined,
    limit: filters.limit,
    page: filters.page,
  })

  const { deleteQuestion, isPending: isDeleting } = QuizService.useDeleteQuestion({
    onSuccess: () => {
      toast.success('Question deleted successfully')
      setDeleteId(null)
    },
    onError: () => {
      toast.error('An error occurred while deleting the question')
    },
  })

  const questions = listData?.questions ?? []
  const total = listData?.total ?? 0

  const handleConfirmDelete = useCallback(() => {
    if (!deleteId) return
    deleteQuestion(deleteId)
  }, [deleteId, deleteQuestion])

  const columns = useMemo(() => getQuestionColumns({ router, onDelete: setDeleteId }), [router])

  const viewToggle = (
    <div className="flex shrink-0 items-center gap-2">
      <Badge variant="secondary" className="hidden tabular-nums sm:inline-flex">
        {total} Questions
      </Badge>
      <div className="border-border flex items-center rounded-md border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewMode('grid')}
          className={
            viewMode === 'grid'
              ? 'bg-muted text-foreground rounded-r-none'
              : 'text-muted-foreground hover:text-foreground rounded-r-none'
          }
          aria-label="Card view"
        >
          <LayoutGrid data-icon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewMode('table')}
          className={
            viewMode === 'table'
              ? 'bg-muted text-foreground rounded-l-none'
              : 'text-muted-foreground hover:text-foreground rounded-l-none'
          }
          aria-label="Table view"
        >
          <List data-icon />
        </Button>
      </div>
      <Button variant="outline" onClick={() => router.push(paths.quiz.root)}>
        <QuizIcons.meta.questions data-icon="inline-start" />
        Quiz List
      </Button>
      <Button onClick={() => router.push(paths.quiz.questionForm)}>
        <Plus data-icon="inline-start" />
        <span className="hidden sm:inline">Add</span>
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col gap-4 flex-1">
      <LayouthIcons
        icon={QuizIcons.meta.questions}
        title="Question Bank"
        desc="Quiz question pool"
        iconWrapperClassName="bg-cyber-quiz/15 border-cyber-quiz/30"
        iconClassName="text-cyber-quiz"
        breadcrumbs={[{ label: 'Quiz', href: paths.quiz.root }, { label: 'Question Bank' }]}
      />

      <ComponentErrorBoundary>
        {viewMode === 'table' ? (
          <DataTable
            columns={columns}
            data={questions}
            isLoading={isLoading}
            skeletonRows={5}
            getRowKey={(row) => row.id}
            enableRowHover
            showRowNumbers
            showColumnVisibility
            emptyTitle={filters.debouncedSearch ? 'No results found' : 'No questions yet'}
            emptyDescription={
              filters.debouncedSearch
                ? 'Try a different search term.'
                : 'Add new questions to the question bank.'
            }
            toolbar={
              <DataTableToolbar
                search={{
                  value: filters.search,
                  onChange: filters.setSearch,
                  placeholder: filters.searchPlaceholder,
                }}
              >
                {viewToggle}
              </DataTableToolbar>
            }
            pagination={{
              currentPage: filters.page,
              totalItems: total,
              pageSize: filters.limit,
              onPageChange: filters.setPage,
              onPageSizeChange: filters.setLimit,
            }}
          />
        ) : (
          <>
            <DataTableToolbar
              search={{
                value: filters.search,
                onChange: filters.setSearch,
                placeholder: filters.searchPlaceholder,
              }}
            >
              {viewToggle}
            </DataTableToolbar>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {questions.map((q) => (
                <QuestionCard key={q.id} question={q} onDelete={setDeleteId} />
              ))}
            </div>
          </>
        )}
      </ComponentErrorBoundary>

      {/* Silme onayı */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The question will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
