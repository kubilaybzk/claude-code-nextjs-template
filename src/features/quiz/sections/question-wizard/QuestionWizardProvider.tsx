/**
 * Soru olusturma/duzenleme wizard provider'i
 *
 * React Hook Form + FormProvider ile 2 adimli soru formunu yonetir.
 * Adim 1: Soru icerigi (baslik, aciklama, dil, secenekler)
 * Adim 2: Kategori, zorluk, ipucu
 *
 * @example
 * <QuestionWizardProvider mode="create" />
 *
 * @example
 * <QuestionWizardProvider mode="edit" questionId="abc" />
 */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { toast } from 'sonner'

import LayouthIcons from '@/components/layout/LayouthIcons'
import { FormValidationDebugger } from '@/components/shared/FormValidationDebugger'
import type { StepConfig } from '@/components/shared/StepPanel'
import { StepPanel } from '@/components/shared/StepPanel'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { paths } from '@/config/paths'
import { QuizIcons } from '@/features/quiz/constants/icons'
import * as QuizService from '@/services/QuizService'
import { getSchemaFields, useQuestionWizardSteps } from '../../hooks/useQuestionWizardSteps'
import type { QuestionFormValues } from '../../utils/transforms'
import { questionFormToRequest, questionResponseToForm } from '../../utils/transforms'
import { questionWizardFullSchema } from '../../validations/questionWizardSchemas'
import { QuestionWizardProviderContext } from './QuestionWizardContext'

/** Step panel ikon konfigurasyonu */
const STEP_PANEL_CONFIG: StepConfig[] = [
  {
    id: 'content',
    label: 'Question Details',
    icon: <QuizIcons.wizard.content className="size-4" />,
    description: 'Title, description, options',
  },
  {
    id: 'settings',
    label: 'Category and Hint',
    icon: <QuizIcons.wizard.tags className="size-4" />,
    description: 'Category, difficulty, hint',
  },
]

// ── Props ─────────────────────────────────────────────────

interface QuestionWizardProviderProps {
  /** Wizard modu */
  mode: 'create' | 'edit'
  /** Edit modunda soru ID */
  questionId?: string
}

// ── Component ─────────────────────────────────────────────

export function QuestionWizardProvider({ mode, questionId }: QuestionWizardProviderProps) {
  const router = useRouter()
  const isEditMode = mode === 'edit'

  // ── Step state ──────────────────────────────────────
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const isInitialLoad = useRef(true)

  // ── Form ────────────────────────────────────────────
  const form = useForm<QuestionFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(questionWizardFullSchema) as unknown as Resolver<QuestionFormValues>,
    defaultValues: {
      title: '',
      description: '',
      lang: 'tr',
      options: [
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ],
      categories: [],
      difficulty: 2.1,
      hint: '',
    },
  })

  const { activeSteps, totalSteps } = useQuestionWizardSteps()
  const currentStep = activeSteps[currentStepIndex]
  const isLastStep = currentStepIndex === totalSteps - 1

  // ── Edit modu — soru detay yukleme ──────────────────
  const {
    data: questionDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = QuizService.useGetQuestionDetail(
    questionId ?? '',
    { enabled: isEditMode && !!questionId },
  )

  const [isDataReady, setIsDataReady] = useState(!isEditMode)

  useEffect(() => {
    if (!isEditMode || !questionDetail || !isInitialLoad.current) return
    isInitialLoad.current = false
    form.reset(questionResponseToForm(questionDetail))
    // Kisa bir gecikme ile data'nin form'a yansimasi beklenir
    requestAnimationFrame(() => setIsDataReady(true))
  }, [isEditMode, questionDetail, form])

  const isLoading = isEditMode && !!questionId && (isDetailLoading || (!isDataReady && !isDetailError))

  // ── Mutations ───────────────────────────────────────
  const { createQuestion, isPending: isCreating } = QuizService.useCreateQuestion({
    onSuccess: () => {
      toast.success('Question created successfully')
      router.push(paths.quiz.questions)
    },
    onError: () => toast.error('Question could not be created'),
  })

  const { updateQuestion, isPending: isUpdating } = QuizService.useUpdateQuestion(
    questionId ?? '',
    {
      onSuccess: () => {
        toast.success('Question updated successfully')
        router.push(paths.quiz.questions)
      },
      onError: () => toast.error('Question could not be updated'),
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
    const isValid = await form.trigger(fieldsToValidate as (keyof QuestionFormValues)[])

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
      const isValid = await form.trigger(fieldsToValidate as (keyof QuestionFormValues)[])
      if (!isValid) {
        toast.error('Please fill in the required fields')
        return
      }
    }

    setCompletedSteps((prev) => new Set([...prev, currentStep.id]))
    setCurrentStepIndex(targetIdx)
  }

  /** Son adimda submit butonuyla tetiklenir */
  const handleFinalSubmit = () => {
    form.handleSubmit((data) => {
      const payload = questionFormToRequest(data)
      if (isEditMode) {
        updateQuestion(payload)
      } else {
        createQuestion(payload)
      }
    })()
  }

  // ── Render ──────────────────────────────────────────

  const StepComponent = currentStep?.component

  if (isLoading) {
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
    <QuestionWizardProviderContext value={{ isSubmitting, onFinalSubmit: handleFinalSubmit }}>
      <FormProvider {...form}>
        <div className="flex flex-col gap-4">
          <LayouthIcons
            icon={QuizIcons.meta.questions}
            title={isEditMode ? 'Edit Question' : 'Create New Question'}
            desc={
              isEditMode ? 'Your changes will be saved' : 'Follow the steps to create a question'
            }
            iconWrapperClassName="bg-cyber-quiz/15 border-cyber-quiz/30"
            iconClassName="text-cyber-quiz"
            breadcrumbs={[
              { label: 'Quiz', href: paths.quiz.root },
              { label: 'Question Bank', href: paths.quiz.questions },
              { label: isEditMode ? 'Edit Question' : 'New Question' },
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

              {/* Navigation + Submit */}
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

                {isLastStep ? (
                  <Button
                    size="sm"
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="bg-cyber-quiz text-primary-foreground hover:bg-cyber-quiz/90 gap-1.5"
                  >
                    {isSubmitting
                      ? isEditMode
                        ? 'Updating...'
                        : 'Creating...'
                      : isEditMode
                        ? 'Save'
                        : 'Create'}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    type="button"
                    className="bg-cyber-quiz text-primary-foreground hover:bg-cyber-quiz/90 gap-1.5"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Form debugger */}
          <FormValidationDebugger methods={form} label="Question Wizard" />
        </div>
      </FormProvider>
    </QuestionWizardProviderContext>
  )
}
