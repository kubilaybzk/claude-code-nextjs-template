/**
 * Quiz wizard — Soru Secimi adimi
 *
 * Tablo gorunumlu soru secici, filtreleme, pagination, DnD siralama.
 * Soru gosterim modu (tumu / rastgele) ve karistirma ayarlari.
 *
 * @example
 * <QuestionSelectionStep />
 */
'use client'

import { useState, useCallback } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ComponentErrorBoundary } from '@/components/shared/ComponentErrorBoundary'
import { ErrorState } from '@/components/shared/ErrorState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import type { QuestionListItem } from '@/services/QuizService'
import * as QuizService from '@/services/QuizService'
import { useDebounce } from '@/hooks/useDebounce'
import { Pagination } from '@/components/shared/Pagination'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { CATEGORY_CONFIG, getCategoryConfig } from '@/constants/categories'
import { VALID_DIFFICULTIES, DIFFICULTY_LABELS_TR, DIFFICULTY_BG_COLORS, getDifficultyLevel } from '@/constants/difficulty'
import type { QuizFormValues } from '@/features/quiz/utils/transforms'
import { QuizIcons } from '@/features/quiz/constants/icons'
import { AlertTriangle, CheckCircle, Clock, Zap, BarChart3, HelpCircle, Eye, EyeOff, Share2, Copy, Download, RefreshCw, Search, X, Filter } from 'lucide-react'

// ── Constants ─────────────────────────────────────────────

const PICKER_PAGE_SIZE = 10

const DIFFICULTY_GROUPS = [1, 2, 3, 4].map((level) => ({
  level,
  label: DIFFICULTY_LABELS_TR[level],
  color: getDifficultyLevel(level + 0.1).bgColor,
  difficulties: VALID_DIFFICULTIES.filter((d) => Math.floor(d) === level),
}))

// ── Component ─────────────────────────────────────────────

export function QuestionSelectionStep() {
  const { setValue, register, control, formState: { errors } } = useFormContext<QuizFormValues>()
  const selectedQuestions = useWatch({ control, name: 'selectedQuestions' })
  const questionDisplayMode = useWatch({ control, name: 'questionDisplayMode' })
  const shuffleAnswerOptions = useWatch({ control, name: 'shuffleAnswerOptions' })
  const count = selectedQuestions?.length ?? 0

  // Picker state
  const [showPicker, setShowPicker] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [categoryFilters, setCategoryFilters] = useState<number[]>([])
  const [difficultyFilters, setDifficultyFilters] = useState<number[]>([])

  const debouncedSearch = useDebounce(searchInput, 300)
  const activeFilterCount = categoryFilters.length + difficultyFilters.length

  const { data: questionData, isLoading: isSearching, isError, refetch } = QuizService.useGetQuestionList({
    search: debouncedSearch || undefined,
    limit: 100,
    page: 1,
  })

  const rawQuestions = questionData?.questions ?? []

  // Client-side filtreleme
  const availableQuestions = rawQuestions.filter((q) => {
    if (categoryFilters.length > 0 && !q.category.some((c) => categoryFilters.includes(c))) return false
    if (difficultyFilters.length > 0 && !difficultyFilters.includes(q.difficulty)) return false
    return true
  })

  const total = availableQuestions.length
  const totalPages = total > 0 ? Math.ceil(total / PICKER_PAGE_SIZE) : 1
  const paginatedQuestions = availableQuestions.slice((page - 1) * PICKER_PAGE_SIZE, page * PICKER_PAGE_SIZE)

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value)
    setPage(1)
  }, [])

  const handleCategoryToggle = useCallback((cat: number, checked: boolean) => {
    setCategoryFilters((prev) => {
      setPage(1)
      return checked ? [...prev, cat] : prev.filter((c) => c !== cat)
    })
  }, [])

  const handleDifficultyToggle = useCallback((diff: number, checked: boolean) => {
    setDifficultyFilters((prev) => {
      setPage(1)
      return checked ? [...prev, diff] : prev.filter((d) => d !== diff)
    })
  }, [])

  const handleClearFilters = useCallback(() => {
    setCategoryFilters([])
    setDifficultyFilters([])
    setPage(1)
  }, [])

  const handleToggleQuestion = useCallback((questionId: string) => {
    const current = selectedQuestions ?? []
    if (current.includes(questionId)) {
      setValue('selectedQuestions', current.filter((id) => id !== questionId), { shouldValidate: true })
    } else {
      setValue('selectedQuestions', [...current, questionId], { shouldValidate: true })
    }
  }, [selectedQuestions, setValue])

  const handleRemoveQuestion = useCallback((questionId: string) => {
    const current = selectedQuestions ?? []
    setValue('selectedQuestions', current.filter((id) => id !== questionId), { shouldValidate: true })
  }, [selectedQuestions, setValue])

  // DnD
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const current = selectedQuestions ?? []
    const oldIndex = current.indexOf(String(active.id))
    const newIndex = current.indexOf(String(over.id))
    if (oldIndex === -1 || newIndex === -1) return
    setValue('selectedQuestions', arrayMove(current, oldIndex, newIndex), { shouldValidate: true })
  }, [selectedQuestions, setValue])

  const selectedDetails = (selectedQuestions ?? []).map((id) => {
    const found = rawQuestions.find((q) => q.id === id)
    return found ?? { id, title: id, description: '', score: 0, success_rate: null, type: false, category: [], difficulty: 0, hint: false }
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Question Selection</h2>
          <p className="text-sm text-muted-foreground">Select questions from the question bank and define their order.</p>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && <Badge variant="secondary">{count} soru</Badge>}
          <Button type="button" variant="outline" size="sm" onClick={() => setShowPicker((p) => !p)}>
            <QuizIcons.wizard.questions data-icon="inline-start" />
            {showPicker ? 'Close' : 'Add Question'}
          </Button>
        </div>
      </div>

      {/* ── Error State ── */}
      {showPicker && isError && (
        <ComponentErrorBoundary>
          <ErrorState
            title="Failed to load questions"
            description="An error occurred while loading the question bank. Please try again."
            action={
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            }
          />
        </ComponentErrorBoundary>
      )}

      {/* ── Soru Secim Paneli ── */}
      {showPicker && !isError && (
        <TooltipProvider>
          <Card size="sm">
            <CardContent className="p-3">
              <div className="flex flex-col gap-3">
                {/* Arama + Filtre Toggle */}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search data-icon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search questions..." value={searchInput} onChange={(e) => handleSearchChange(e.target.value)} className="pl-9" aria-label="Search questions" />
                    </div>
                    <Button type="button" variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={() => setFilterOpen((p) => !p)}>
                      <Filter data-icon />
                      Filters
                      {activeFilterCount > 0 && <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 text-xs">{activeFilterCount}</Badge>}
                      <QuizIcons.nav.down data-icon className={cn('transition-transform duration-200', filterOpen && 'rotate-180')} />
                    </Button>
                  </div>

                  {/* Overlay filtre paneli */}
                  {filterOpen && (
                    <div className="absolute inset-x-0 top-[calc(100%+4px)] z-20 rounded-lg border border-border bg-card p-3 shadow-lg">
                      <div className="flex items-center justify-between pb-2">
                        <span className="text-sm font-semibold text-foreground">Filters</span>
                        {activeFilterCount > 0 && (
                          <Button type="button" variant="ghost" size="sm" onClick={handleClearFilters} className="h-auto px-2 py-0.5 text-xs">Clear</Button>
                        )}
                      </div>
                      <Separator className="mb-3" />
                      <div className="flex flex-col gap-4">
                        {/* Kategori */}
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-medium text-muted-foreground">Category</span>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            {CATEGORY_CONFIG.map((_, index) => {
                              const cfg = getCategoryConfig(index)
                              const CatIcon = cfg.icon
                              return (
                                <div key={index} className="flex items-center gap-2">
                                  <Checkbox id={`pc-${index}`} checked={categoryFilters.includes(index)} onCheckedChange={(val) => handleCategoryToggle(index, val === true)} />
                                  <Label htmlFor={`pc-${index}`} className="flex cursor-pointer items-center gap-1.5 text-sm font-normal">
                                    <CatIcon className={cn('size-3.5', cfg.colors.text)} />{cfg.label}
                                  </Label>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <Separator />
                        {/* Zorluk */}
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-medium text-muted-foreground">Difficulty Level</span>
                          <div className="grid grid-cols-4 gap-4">
                            {DIFFICULTY_GROUPS.map((group) => (
                              <div key={group.level} className="flex flex-col gap-2">
                                <span className="flex items-center gap-1.5 text-sm font-medium">
                                  <span className={cn('inline-block size-2 rounded-full', group.color)} />{group.label}
                                </span>
                                <div className="flex flex-col gap-1.5">
                                  {group.difficulties.map((diff) => {
                                    const level = getDifficultyLevel(diff)
                                    return (
                                      <div key={diff} className="flex items-center gap-2">
                                        <Checkbox id={`pd-${diff}`} checked={difficultyFilters.includes(diff)} onCheckedChange={(val) => handleDifficultyToggle(diff, val === true)} />
                                        <Label htmlFor={`pd-${diff}`} className="flex cursor-pointer items-center gap-1.5 text-sm font-normal">
                                          <span className={cn('inline-block size-1.5 rounded-full', level.bgColor)} />{diff}
                                        </Label>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tablo */}
                {isSearching ? (
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-11 w-full rounded-md" />)}
                  </div>
                ) : paginatedQuestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-1 py-8 text-center">
                    <QuizIcons.wizard.questions className="size-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      {debouncedSearch || activeFilterCount > 0 ? 'No results found' : 'No questions in the question bank'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="w-10"><span className="sr-only">Select</span></TableHead>
                          <TableHead className="min-w-[180px]">Question</TableHead>
                          <TableHead className="w-16 text-center">Score</TableHead>
                          <TableHead className="w-16">Type</TableHead>
                          <TableHead className="w-24">Category</TableHead>
                          <TableHead className="w-24">Difficulty</TableHead>
                          <TableHead className="w-14 text-center">Hint</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedQuestions.map((q) => {
                          const isSelected = selectedQuestions?.includes(q.id) ?? false
                          return (
                            <TableRow key={q.id} className={cn('cursor-pointer transition-colors', isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-accent/50')} onClick={() => handleToggleQuestion(q.id)}>
                              <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                <Checkbox checked={isSelected} onCheckedChange={() => handleToggleQuestion(q.id)} aria-label={`Select question ${q.title}`} />
                              </TableCell>
                              <TableCell>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="max-w-[220px]">
                                      <span className="block truncate text-sm font-medium text-foreground">{q.title}</span>
                                      {q.description && <span className="block truncate text-xs text-muted-foreground">{q.description}</span>}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom" className="max-w-xs text-xs">{q.title}</TooltipContent>
                                </Tooltip>
                              </TableCell>
                              <TableCell className="text-center"><Badge variant="secondary" className="font-mono text-xs">{q.score} XP</Badge></TableCell>
                              <TableCell><Badge variant="outline" className="text-xs">{q.type ? 'Multiple' : 'Single'}</Badge></TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {q.category.slice(0, 3).map((cat) => <CategoryIcon key={cat} category={cat} size={14} />)}
                                  {q.category.length > 3 && <span className="text-xs text-muted-foreground">+{q.category.length - 3}</span>}
                                </div>
                              </TableCell>
                              <TableCell><DifficultyBadge difficulty={q.difficulty} /></TableCell>
                              <TableCell className="text-center">
                                {q.hint ? (
                                  <QuizIcons.solve.correct data-icon className="mx-auto text-primary" />
                                ) : (
                                  <QuizIcons.solve.wrong data-icon className="mx-auto text-muted-foreground/50" />
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Pagination */}
                {!isSearching && paginatedQuestions.length > 0 && totalPages > 1 && (
                  <Pagination currentPage={page} totalPages={totalPages} totalItems={total} onPageChange={setPage} />
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipProvider>
      )}

      {/* ── Secili Sorular — DnD ── */}
      {count > 0 ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">Selected Questions ({count})</CardTitle>
            <CardDescription>Drag to change their order.</CardDescription>
          </CardHeader>
          <CardContent>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={selectedQuestions ?? []} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-1.5">
                  {selectedDetails.map((q, index) => (
                    <SortableQuestionItem key={q.id} question={q} index={index} onRemove={handleRemoveQuestion} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          'flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center',
          errors.selectedQuestions ? 'border-destructive/40 bg-destructive/5' : 'border-border bg-muted/30',
        )}>
          <QuizIcons.wizard.questions className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No question selected yet</p>
        </div>
      )}

      {errors.selectedQuestions?.message && <FieldError>{errors.selectedQuestions.message}</FieldError>}

      {/* ── Soru Gosterim Modu ── */}
      {count > 0 && (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QuizIcons.wizard.shuffle data-icon className="text-cyber-quiz" />
              Question Display Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-md px-1 py-2.5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Random Question Selection</span>
                  <span className="text-xs text-muted-foreground">
                    Display a random subset of the selected questions.
                  </span>
                </div>
                <Switch
                  checked={questionDisplayMode === 'random_shuffle'}
                  onCheckedChange={(checked) => {
                    setValue('questionDisplayMode', checked ? 'random_shuffle' : 'all_selected', { shouldValidate: true })
                    if (checked) {
                      setValue('displayQuestionCount', Math.min(10, count), { shouldValidate: true })
                    } else {
                      setValue('displayQuestionCount', 0, { shouldValidate: true })
                      setValue('shuffleAnswerOptions', false, { shouldValidate: true })
                    }
                  }}
                  size="sm"
                />
              </div>

              {questionDisplayMode === 'random_shuffle' && (
                <div className="ml-6 flex flex-col gap-3">
                  <Field>
                    <FieldLabel htmlFor="display-count">Number of Questions to Display</FieldLabel>
                    <FieldContent>
                      <Input
                        id="display-count"
                        type="number"
                        min={1}
                        max={count}
                        {...register('displayQuestionCount', { valueAsNumber: true })}
                        className="w-32"
                      />
                    </FieldContent>
                  </Field>

                  <div className="flex items-center justify-between rounded-md px-1 py-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">Shuffle Answer Options</span>
                      <span className="text-xs text-muted-foreground">
                        Answer options are shuffled for each question.
                      </span>
                    </div>
                    <Switch
                      checked={shuffleAnswerOptions}
                      onCheckedChange={(checked) => setValue('shuffleAnswerOptions', !!checked, { shouldValidate: true })}
                      size="sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── Sortable Question Item ──────────────────────────────────

function SortableQuestionItem({
  question,
  index,
  onRemove,
}: {
  question: QuestionListItem | { id: string; title: string; category: number[]; difficulty: number }
  index: number
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group/sortable grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-2 rounded-lg border bg-card px-3 py-2 transition-colors',
        isDragging ? 'z-50 border-primary/40 shadow-lg' : 'border-border hover:border-border/80',
      )}
    >
      <button type="button" className="shrink-0 cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing" {...attributes} {...listeners} aria-label="Surukle">
        <QuizIcons.editor.drag className="size-4" />
      </button>
      <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">{index + 1}</span>
      <span className="min-w-0 truncate text-sm font-medium">{question.title}</span>
      <div className="flex shrink-0 items-center gap-1.5">
        {question.category?.slice(0, 2).map((cat) => <CategoryIcon key={cat} category={cat} size={14} />)}
        {(question.category?.length ?? 0) > 2 && <span className="text-xs text-muted-foreground">+{question.category.length - 2}</span>}
        {question.difficulty > 0 && <DifficultyBadge difficulty={question.difficulty} />}
      </div>
      <Button type="button" variant="ghost" size="icon-xs" className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover/sortable:opacity-100" onClick={() => onRemove(question.id)} aria-label="Kaldir">
        <X data-icon />
      </Button>
    </div>
  )
}
