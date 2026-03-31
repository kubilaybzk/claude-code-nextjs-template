import type { ZodObject } from 'zod'

import { QuestionContentStep } from '../sections/question-wizard/steps/QuestionContentStep'
import { QuestionSettingsStep } from '../sections/question-wizard/steps/QuestionSettingsStep'
import {
  questionContentStepSchema,
  questionSettingsStepSchema,
} from '../validations/questionWizardSchemas'

// ── Step config types ───────────────────────────────────

/** Soru wizard adim konfigurasyonu */
export interface QuestionWizardStepConfig {
  /** Benzersiz adim ID'si */
  id: string
  /** Gosterilecek etiket */
  label: string
  /** Kisa aciklama */
  description: string
  /** Adimin Zod validation schema'si */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: ZodObject<any>
  /** Adim component'i */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
}

interface UseWizardStepsReturn {
  /** Tum adim konfigurasyonlari */
  steps: QuestionWizardStepConfig[]
  /** Aktif adimlar */
  activeSteps: QuestionWizardStepConfig[]
  /** Toplam adim sayisi */
  totalSteps: number
}

// ── Hook ────────────────────────────────────────────────

/**
 * Soru wizard'i icin adim konfigurasyonlari
 *
 * @returns Step config listesi ve toplam adim sayisi
 *
 * @example
 * const { activeSteps, totalSteps } = useQuestionWizardSteps()
 */
export function useQuestionWizardSteps(): UseWizardStepsReturn {
  const steps: QuestionWizardStepConfig[] = [
    {
      id: 'content',
      label: 'Question Details',
      description: 'Title, description, and options',
      schema: questionContentStepSchema,
      component: QuestionContentStep,
    },
    {
      id: 'settings',
      label: 'Category and Hint',
      description: 'Category, difficulty, hint',
      schema: questionSettingsStepSchema,
      component: QuestionSettingsStep,
    },
  ]

  return {
    steps,
    activeSteps: steps,
    totalSteps: steps.length,
  }
}

/**
 * Zod schema'sindan field isimlerini cikarir
 *
 * @param schema - Zod object schema
 * @returns Field isimleri dizisi
 *
 * @example
 * const fields = getSchemaFields(questionContentStepSchema)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSchemaFields(schema: ZodObject<any>): string[] {
  return Object.keys(schema.shape)
}
