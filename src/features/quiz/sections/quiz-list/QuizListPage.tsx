'use client'

/**
 * Quiz Listesi Ana Component
 *
 * Academy Classes sayfasi ile ayni layout:
 * Sol tarafta sticky filter sidebar, sagda card grid + pagination.
 * URL-based filtreleme, debounce arama ve toplu islem.
 *
 * @example
 * // page.tsx icinde
 * <QuizListPage />
 */

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { ComponentErrorBoundary } from '@/components/shared/ComponentErrorBoundary'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { Pagination } from '@/components/shared/Pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { paths } from '@/config/paths'
import { Filter, LayoutGrid, List, Plus, Search, Trash2, Users, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import * as QuizService from '@/services/QuizService'
import { QuizIcons } from '../../constants/icons'
import { QuizGroup } from '../../constants/quiz'

import { QuizFilterSidebar } from '@/features/quiz/components'
import { QuizCard } from './components/QuizCard'
import { QuizCardContextMenu } from './components/QuizCardContextMenu'
import { QuizListSkeleton } from './components/QuizListSkeleton'
import { QuizRuleSetModal } from './components/QuizRuleSetModal'
import { QuizTable } from './components/QuizTable'

export function QuizListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const viewMode = (searchParams.get('view') ?? 'grid') as 'grid' | 'table'
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // ── URL'den filtre degerlerini oku ────────────────────────
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '12')
  const search = searchParams.get('search') ?? ''
  const group =
    searchParams.get('group') !== null ? Number(searchParams.get('group')) : QuizGroup.Available
  const difficulty = searchParams.getAll('difficulty').map(Number).filter(Boolean)
  const categories = searchParams.getAll('categories').map(Number)

  // ── Filtre objesi ─────────────────────────────────────────
  const filters: QuizService.QuizListFilters = useMemo(
    () => ({
      page,
      limit,
      group,
      search: search || undefined,
      difficulty: difficulty.length > 0 ? difficulty : undefined,
      category: categories.length > 0 ? categories : undefined,
    }),
    [page, limit, group, search, difficulty, categories],
  )

  // ── Query ─────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = QuizService.useGetQuizList(filters)

  const currentQuiz = data?.current_quiz
  const totalPages = data?.total_pages ?? 1

  // Current quiz'i listenin basina ekle (sadece Available tab)
  const displayList = useMemo(() => {
    const list = data?.quiz_list ?? []
    if (group !== QuizGroup.Available || !currentQuiz) return list
    const filtered = list.filter((q) => q.id !== currentQuiz.id)
    return [currentQuiz, ...filtered]
  }, [data?.quiz_list, currentQuiz, group])

  const hasActiveQuiz = Boolean(currentQuiz)
  const toggleSelection = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const clearSelection = () => setSelectedIds([])

  const selectedCount = selectedIds.length
  const hasSelection = selectedCount > 0

  const [filterOpen, setFilterOpen] = useState(false)

  // ── Quiz başlatma ────────────────────────────────────────
  const { startQuiz } = QuizService.useStartQuiz()
  const startingRef = useRef(false)

  // QuizRuleSet modal state
  const [ruleModalQuizId, setRuleModalQuizId] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  /** Kural modalını aç */
  const handleStartQuiz = useCallback((quizId: string) => {
    setRuleModalQuizId(quizId)
  }, [])

  /** Modal onayı sonrası quiz başlat ve solve'a yönlendir */
  const handleConfirmStart = useCallback(async () => {
    if (!ruleModalQuizId || startingRef.current) return
    startingRef.current = true
    setIsStarting(true)
    try {
      await startQuiz(ruleModalQuizId)
      router.push(paths.quiz.solve(ruleModalQuizId))
    } catch {
      toast.error('Quiz could not be started. Please try again.')
    } finally {
      startingRef.current = false
      setIsStarting(false)
    }
  }, [ruleModalQuizId, startQuiz, router])

  /** Devam eden quiz'e git */
  const handleContinueQuiz = useCallback(
    (quizId: string) => {
      router.push(paths.quiz.solve(quizId))
    },
    [router],
  )

  // ── Dialog state'leri ─────────────────────────────────────
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  // ── Delete mutation ─────────────────────────────────────
  const { deleteQuiz, isPending: isDeleting } = QuizService.useDeleteQuiz({
    onSuccess: () => {
      toast.success('Quiz deleted successfully')
      setIsDeleteDialogOpen(false)
      setPendingDeleteId(null)
      clearSelection()
    },
    onError: () => {
      toast.error('An error occurred while deleting the quiz')
    },
  })

  /** Tekil silme — context menu'den tetiklenir */
  const handleSingleDelete = useCallback((quizId: string) => {
    setPendingDeleteId(quizId)
    setIsDeleteDialogOpen(true)
  }, [])

  /** Onay sonrasi silme */
  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      deleteQuiz(pendingDeleteId)
    } else {
      selectedIds.forEach((id) => deleteQuiz(id))
    }
  }

  /** Toplu silme — toolbar'dan tetiklenir */
  const handleBulkDelete = () => {
    setPendingDeleteId(null)
    setIsDeleteDialogOpen(true)
  }

  // ── Secim temizleme — arama degisince (sayfa degisimi secimi korur) ───────────
  useEffect(() => {
    clearSelection()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // ── URL guncelleme (useUrlFilters hook) ──────────────────
  const { updateFilters } = useUrlFilters()

  // ── Arama debounce ────────────────────────────────────────
  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    updateFilters({ search: debouncedSearch || undefined })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  // ── Handlers ──────────────────────────────────────────────
  const handlePageChange = (newPage: number) => updateFilters({ page: newPage })

  const handleClearFilters = () => {
    updateFilters({
      difficulty: undefined,
      categories: undefined,
      search: undefined,
    })
    setSearchInput('')
  }

  // ── Icerik render ─────────────────────────────────────────
  const renderContent = () => {
    if (isLoading) {
      return <QuizListSkeleton />
    }

    if (isError) {
      return (
        <ErrorState
          title="Failed to load quizzes"
          description="An error occurred while loading the quiz list. Please try again."
          action={
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          }
        />
      )
    }

    if (displayList.length === 0) {
      return (
        <EmptyState
          icon={<QuizIcons.meta.questions className="size-12" />}
          title="No quizzes yet"
          description="Adjust your filters or create a new quiz."
        />
      )
    }

    if (viewMode === 'table') {
      return (
        <ComponentErrorBoundary>
          <QuizTable
            quizzes={displayList}
            tabGroup={group}
            currentQuizId={currentQuiz?.id}
            selectedIds={selectedIds}
            onToggleSelect={(id) => toggleSelection(id)}
            onStartQuiz={handleStartQuiz}
            onContinueQuiz={handleContinueQuiz}
          />
        </ComponentErrorBoundary>
      )
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {displayList.map((quiz) => (
          <ComponentErrorBoundary key={quiz.id} compact>
            <QuizCardContextMenu
              onEdit={() => router.push(paths.quiz.edit(quiz.id))}
              onViewReport={() => router.push(paths.quiz.report(quiz.id))}
              onDelete={() => handleSingleDelete(quiz.id)}
              onToggleSelect={() => toggleSelection(quiz.id)}
              isSelected={selectedIds.includes(quiz.id)}
            >
              <QuizCard
                quiz={{ ...quiz, is_current: quiz.id === currentQuiz?.id }}
                hasActiveQuizInSystem={hasActiveQuiz}
                onStart={(id) => handleStartQuiz(id)}
                onContinue={() => handleContinueQuiz(quiz.id)}
                onViewReport={() => router.push(paths.quiz.report(quiz.id))}
                isSelected={selectedIds.includes(quiz.id)}
                onToggleSelect={() => toggleSelection(quiz.id)}
                hasSelection={hasSelection}
              />
            </QuizCardContextMenu>
          </ComponentErrorBoundary>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Search + Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search
            data-icon
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
          />
          <Input
            placeholder="Search quizzes..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
            aria-label="Search quizzes"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setFilterOpen(true)}
            aria-label="Open filters"
          >
            <Filter data-icon="inline-start" />
            Filters
          </Button>
          <Badge variant="secondary" className="hidden shrink-0 tabular-nums sm:inline-flex">
            {data?.quiz_list?.length ?? 0} Quiz
          </Badge>
          <div className="border-border flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateFilters({ view: 'grid', page })}
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
              onClick={() => updateFilters({ view: 'table', page })}
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
          <Button variant="outline" onClick={() => router.push(paths.quiz.questions)}>
            <QuizIcons.meta.questions data-icon="inline-start" />
            <span className="hidden sm:inline">Question Bank</span>
          </Button>
          <Button onClick={() => router.push(paths.quiz.form)}>
            <Plus data-icon="inline-start" />
            <span className="hidden sm:inline">Add Quiz</span>
          </Button>
        </div>
      </div>

      {/* Toplu islem toolbar */}
      {hasSelection && (
        <div className="border-primary/30 bg-primary/5 flex items-center gap-3 rounded-lg border px-4 py-2">
          <span className="text-foreground text-sm font-medium">{selectedCount} quizzes selected</span>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Users data-icon="inline-start" />
              Assign
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleBulkDelete}
            >
              <Trash2 data-icon="inline-start" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSelection}
              aria-label="Clear selection"
            >
              <X />
            </Button>
          </div>
        </div>
      )}

      {/* Ana icerik: Sidebar + Grid */}
      <div className="flex gap-6">
        <QuizFilterSidebar
          filters={{
            categories,
            difficulty,
          }}
          onFilterChange={(key, value) => updateFilters({ [key]: value })}
          onClearFilters={handleClearFilters}
          mobileOpen={filterOpen}
          onMobileOpenChange={setFilterOpen}
          className="hidden w-64 shrink-0 lg:block"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {renderContent()}

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={
                (data?.available_count ?? 0) +
                (data?.assigned_count ?? 0) +
                (data?.upcoming_count ?? 0) +
                (data?.expired_count ?? 0) +
                (data?.completed_count ?? 0)
              }
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      {/* ── Toplu silme onay dialog ──────────────────────── */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsDeleteDialogOpen(open)
          if (!open) setPendingDeleteId(null)
        }}
        title={pendingDeleteId ? 'Quiz will be deleted' : `${selectedCount} quizzes will be deleted`}
        description="This action cannot be undone. The selected quizzes will be permanently deleted."
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />

      {/* ── Quiz Kural Seti Modalı ────────────────────────── */}
      <QuizRuleSetModal
        open={!!ruleModalQuizId}
        onClose={() => setRuleModalQuizId(null)}
        quizId={ruleModalQuizId}
        onConfirm={handleConfirmStart}
        isPending={isStarting}
      />
    </div>
  )
}
