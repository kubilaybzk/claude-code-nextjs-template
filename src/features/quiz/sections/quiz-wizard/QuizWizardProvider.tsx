/**
 * Quiz olusturma/duzenleme wizard provider'i
 *
 * React Hook Form + FormProvider ile tum adimlari sarar.
 * Step navigation, veri yukleme, submit islemlerini yonetir.
 *
 * Create modu: /quiz/form
 * Edit modu: /quiz/form/[id]
 *
 * @example
 * // Create modu
 * export default function CreateQuizPage() {
 *   return <QuizWizardProvider mode="create" />
 * }
 *
 * @example
 * // Edit modu
 * export default function EditQuizPage() {
 *   return <QuizWizardProvider mode="edit" quizId="abc" />
 * }
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, FormProvider, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import LayouthIcons from '@/components/layout/LayouthIcons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import * as QuizService from '@/services/QuizService'
import { paths } from '@/config/paths'
import { QuizIcons } from '@/features/quiz/constants/icons'
import { FormValidationDebugger } from '@/components/shared/FormValidationDebugger'
import { StepPanel } from '@/components/shared/StepPanel'
import type { StepConfig } from '@/components/shared/StepPanel'
import { useQuizWizardSteps, getSchemaFields } from '../../hooks/useQuizWizardSteps'
import { quizWizardFullSchema } from '../../validations/quizWizardSchemas'
import type { QuizFormValues, QuizFormInitialData } from '../../utils/transforms'
import { quizFormToRequest } from '../../utils/transforms'
import { QuizWizardProviderContext } from './QuizWizardContext'

// ── Constants ─────────────────────────────────────────────

const DEFAULT_VALUES: QuizFormValues = {
  // Settings
  name: '',
  durationHours: 1,
  durationMinutes: 0,
  minSuccessRate: 50,
  isPublic: false,
  limitedTime: false,
  lang: 'tr',
  image: '',

  // Configurations
  navigation: true,
  allowPass: false,
  passLimit: 0,
  showQuestionAnswer: false,
  showResultScore: false,
  retakeAllowed: false,
  retakeLimit: 2,
  scoringAlgorithm: 0,
  allowHint: false,
  randomizedQuestions: false,

  // Questions
  selectedQuestions: [],
  questionDisplayMode: 'all_selected',
  displayQuestionCount: 0,
  shuffleAnswerOptions: false,

  // KPI
  kpiSuccessRate: 0,
  kpiSuccessRateEnabled: false,
  kpiFirstAttemptAccuracy: 0,
  kpiFirstAttemptAccuracyEnabled: false,
  kpiExpectedAttempts: 0,
  kpiExpectedAttemptsEnabled: false,
  kpiExpectedTime: 0,
  kpiExpectedTimeEnabled: false,
}

/** Step panel ikon konfigurasyonu */
const STEP_PANEL_CONFIG: StepConfig[] = [
  { id: 'settings', label: 'Settings', icon: <QuizIcons.wizard.settings className="size-4" />, description: 'Basic information' },
  { id: 'configurations', label: 'Configuration', icon: <QuizIcons.wizard.configurations className="size-4" />, description: 'Quiz behavior' },
  { id: 'questions', label: 'Question Selection', icon: <QuizIcons.wizard.questions className="size-4" />, description: 'Question management' },
  { id: 'kpi', label: 'KPI', icon: <QuizIcons.wizard.kpi className="size-4" />, description: 'Performance targets' },
  { id: 'preview', label: 'Preview', icon: <QuizIcons.wizard.preview className="size-4" />, description: 'Final review' },
]

// ── Helpers ───────────────────────────────────────────────

/** API initial data'yi form values'a donusturur */
function initialDataToFormValues(data: QuizFormInitialData): QuizFormValues {
  return {
    name: data.name,
    durationHours: Math.floor(data.duration / 3600),
    durationMinutes: Math.floor((data.duration % 3600) / 60),
    minSuccessRate: data.min_success_rate,
    isPublic: data.is_public,
    limitedTime: data.not_before > 0 || data.expire > 0,
    lang: (data.lang === 'en' ? 'en' : 'tr') as 'en' | 'tr',
    notBefore: data.not_before > 0 ? new Date(data.not_before * 1000) : undefined,
    expire: data.expire > 0 ? new Date(data.expire * 1000) : undefined,
    image: '',
    navigation: data.navigation,
    allowPass: data.pass_limit > 0,
    passLimit: data.pass_limit,
    showQuestionAnswer: data.show_question_answer,
    retakeAllowed: data.retake_limit > 1,
    retakeLimit: data.retake_limit,
    scoringAlgorithm: data.scoring_algorithm,
    showResultScore: data.show_result_score,
    allowHint: data.allow_hint,
    randomizedQuestions: data.randomized_questions,
    selectedQuestions: data.questions,
    questionDisplayMode: data.question_count > 0 ? 'random_shuffle' : 'all_selected',
    displayQuestionCount: data.question_count,
    shuffleAnswerOptions: false,
    kpiSuccessRate: 0,
    kpiSuccessRateEnabled: false,
    kpiFirstAttemptAccuracy: 0,
    kpiFirstAttemptAccuracyEnabled: false,
    kpiExpectedAttempts: 0,
    kpiExpectedAttemptsEnabled: false,
    kpiExpectedTime: 0,
    kpiExpectedTimeEnabled: false,
  }
}

// ── Props ─────────────────────────────────────────────────

interface QuizWizardProviderProps {
  /** Wizard modu */
  mode: 'create' | 'edit'
  /** Edit modunda quiz ID */
  quizId?: string
}

// ── Component ─────────────────────────────────────────────

export function QuizWizardProvider({ mode, quizId }: QuizWizardProviderProps) {
  const router = useRouter()
  const isEditMode = mode === 'edit'

  // ── Step state ──────────────────────────────────────
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const isInitialLoad = useRef(true)

  // ── Form ────────────────────────────────────────────
  const form = useForm<QuizFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(quizWizardFullSchema) as unknown as Resolver<QuizFormValues>,
    defaultValues: DEFAULT_VALUES,
  })

  const { activeSteps, totalSteps } = useQuizWizardSteps()
  const currentStep = activeSteps[currentStepIndex]
  const isLastStep = currentStepIndex === totalSteps - 1

  // ── Edit modu — quiz detail yukleme ─────────────────
  const { data: quizDetail, isLoading } = QuizService.useGetQuizDetail(
    quizId ?? '',
    { enabled: isEditMode && !!quizId },
  )

  useEffect(() => {
    if (!isEditMode || !quizDetail || !isInitialLoad.current) return
    isInitialLoad.current = false

    const d = quizDetail as unknown as Record<string, unknown>
    const initialData: QuizFormInitialData = {
      name: (d.name as string) || '',
      duration: (d.duration as number) || 0,
      min_success_rate: (d.min_success_rate as number) || 0,
      is_public: (d.is_public as boolean) || false,
      lang: (d.lang as string) || 'tr',
      pass_limit: (d.pass_limit as number) || 0,
      show_question_answer: (d.show_question_answer as boolean) || false,
      show_result_score: (d.show_result_score as boolean) || false,
      navigation: d.navigation !== undefined ? (d.navigation as boolean) : true,
      image: '',
      allow_hint: (d.allow_hint as boolean) || false,
      retake_limit: (d.retake_limit as number) || 1,
      scoring_algorithm: (d.scoring_algorithm as number) || 0,
      randomized_questions: (d.randomized_questions as boolean) || false,
      not_before: (d.not_before as number) || 0,
      expire: (d.expire as number) || 0,
      tags: (d.tag as number[]) ?? [],
      questions: ((d.questions as Array<{ id: string }>) ?? []).map((q) => q.id),
      question_count: (d.question_count as number) || 0,
    }
    form.reset(initialDataToFormValues(initialData))
  }, [isEditMode, quizDetail, form])

  // ── Mutations ───────────────────────────────────────
  const { createQuiz, isPending: isCreating } = QuizService.useCreateQuiz({
    onSuccess: () => {
      toast.success('Quiz created successfully')
      router.push(paths.quiz.root)
    },
    onError: () => toast.error('Quiz could not be created'),
  })

  const { updateQuiz, isPending: isUpdating } = QuizService.useUpdateQuiz(
    quizId ?? '',
    {
      onSuccess: () => {
        toast.success('Quiz updated successfully')
        router.push(paths.quiz.root)
      },
      onError: () => toast.error('Quiz could not be updated'),
    },
  )

  const isSubmitting = isEditMode ? isUpdating : isCreating

  // ── Navigation ──────────────────────────────────────

  const handleNext = async () => {
    if (!currentStep.schema) {
      setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1))
      return
    }

    const fieldsToValidate = getSchemaFields(currentStep.schema)
    const isValid = await form.trigger(fieldsToValidate as (keyof QuizFormValues)[])

    if (isValid) {
      setCompletedSteps((prev) => new Set([...prev, currentStep.id]))
      setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1))
    } else {
      toast.error('Please fill in the required fields')
    }
  }

  const handleBack = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleStepChange = async (stepId: string) => {
    const targetIdx = activeSteps.findIndex((s) => s.id === stepId)
    if (targetIdx < currentStepIndex) {
      setCurrentStepIndex(targetIdx)
      return
    }

    if (currentStep.schema) {
      const fieldsToValidate = getSchemaFields(currentStep.schema)
      const isValid = await form.trigger(fieldsToValidate as (keyof QuizFormValues)[])
      if (!isValid) {
        toast.error('Please fill in the required fields')
        return
      }
    }

    setCompletedSteps((prev) => new Set([...prev, currentStep.id]))
    setCurrentStepIndex(targetIdx)
  }

  /** Son adimda (preview) submit butonuyla tetiklenir */
  const handleFinalSubmit = () => {
    form.handleSubmit((data) => {
      const payload = quizFormToRequest(data)
      if (isEditMode && quizId) {
        updateQuiz(payload)
      } else {
        createQuiz(payload)
      }
    })()
  }

  // ── Render ──────────────────────────────────────────

  const StepComponent = currentStep?.component

  if (isEditMode && isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-48 sm:w-64" />
        <Skeleton className="h-8 w-64 sm:w-80" />
        <Skeleton className="h-14 lg:hidden" />
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <Skeleton className="hidden h-40 w-56 lg:block" />
          <Skeleton className="h-80 flex-1 sm:h-96" />
        </div>
      </div>
    )
  }

  return (
    <QuizWizardProviderContext value={{ isSubmitting, onFinalSubmit: handleFinalSubmit }}>
      <FormProvider {...form}>
        <div className="flex flex-col gap-4">
          <LayouthIcons
            icon={QuizIcons.meta.questions}
            title={isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
            desc={isEditMode ? 'Your changes will be saved' : 'Follow the steps to create a quiz'}
            iconWrapperClassName="bg-cyber-quiz/15 border-cyber-quiz/30"
            iconClassName="text-cyber-quiz"
            breadcrumbs={[
              { label: 'Quiz', href: paths.quiz.root },
              { label: isEditMode ? 'Edit Quiz' : 'New Quiz' },
            ]}
          />

          {/* Content */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
            <StepPanel
              activeStep={currentStep?.id ?? ''}
              completedSteps={completedSteps}
              onStepChange={handleStepChange}
              steps={STEP_PANEL_CONFIG}
            />

            <div className="cyber-panel flex-1 p-4 sm:p-6 lg:min-h-[500px]">
              {StepComponent && <StepComponent />}

              {/* Navigation — preview disindaki adimlar */}
              {!isLastStep && (
                <>
                  <Separator className="mt-6 sm:mt-8" />
                  <div className="flex justify-between pt-4 sm:pt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      disabled={currentStepIndex === 0}
                      onClick={handleBack}
                    >
                      <QuizIcons.nav.back data-icon="inline-start" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      className="gap-1.5 bg-cyber-quiz text-primary-foreground hover:bg-cyber-quiz/90"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form debugger */}
          <FormValidationDebugger methods={form} label="Quiz Wizard" />
        </div>
      </FormProvider>
    </QuizWizardProviderContext>
  )
}
