import type { ZodObject, ZodEffects } from 'zod'

import { ConfigurationsStep } from '../sections/quiz-wizard/steps/ConfigurationsStep'
import { KpiStep } from '../sections/quiz-wizard/steps/KpiStep'
import { PreviewStep } from '../sections/quiz-wizard/steps/PreviewStep'
import { QuestionSelectionStep } from '../sections/quiz-wizard/steps/QuestionSelectionStep'
import { SettingsStep } from '../sections/quiz-wizard/steps/SettingsStep'
import {
  quizConfigurationsStepSchema,
  quizKpiStepSchema,
  quizQuestionsStepSchema,
  quizSettingsStepSchema,
} from '../validations/quizWizardSchemas'

// ── Step config types ───────────────────────────────────

/** Wizard adim konfigurasyonu */
export interface QuizWizardStepConfig {
  /** Benzersiz adim ID'si */
  id: string
  /** Gosterilecek etiket */
  label: string
  /** Kisa aciklama */
  description: string
  /** Adimin Zod validation schema'si (preview icin undefined) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: ZodObject<any> | any
  /** Adim component'i */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
  /** Opsiyonel — adimin gorunurlugunu form degerlerine gore belirler */
  isVisible?: (formValues: Record<string, unknown>) => boolean
}

interface UseWizardStepsReturn {
  /** Tum adim konfigurasyonlari */
  steps: QuizWizardStepConfig[]
  /** Sadece gorunur olan adimlar */
  activeSteps: QuizWizardStepConfig[]
  /** Aktif adim sayisi */
  totalSteps: number
}

// ── Hook ────────────────────────────────────────────────

/**
 * Quiz wizard'i icin adim konfigurasyonlari
 *
 * Config-driven step tanimi saglar.
 * Conditional step'ler isVisible ile kontrol edilir.
 *
 * @returns Step config listesi, aktif adimlar ve toplam adim sayisi
 *
 * @example
 * const { activeSteps, totalSteps } = useQuizWizardSteps()
 */
export function useQuizWizardSteps(): UseWizardStepsReturn {
  const steps: QuizWizardStepConfig[] = [
    {
      id: 'settings',
      label: 'Settings',
      description: 'Basic information',
      schema: quizSettingsStepSchema,
      component: SettingsStep,
    },
    {
      id: 'configurations',
      label: 'Configuration',
      description: 'Quiz behavior',
      schema: quizConfigurationsStepSchema,
      component: ConfigurationsStep,
    },
    {
      id: 'questions',
      label: 'Question Selection',
      description: 'Question management',
      schema: quizQuestionsStepSchema,
      component: QuestionSelectionStep,
    },
    {
      id: 'kpi',
      label: 'KPI',
      description: 'Performance targets',
      schema: quizKpiStepSchema,
      component: KpiStep,
    },
    {
      id: 'preview',
      label: 'Preview',
      description: 'Final review',
      component: PreviewStep,
    },
  ]

  const activeSteps = steps.filter((step) => !step.isVisible || step.isVisible({}))

  return {
    steps,
    activeSteps,
    totalSteps: activeSteps.length,
  }
}

/**
 * Zod schema'sindan field isimlerini cikarir
 *
 * form.trigger(fields) ile per-step validation icin kullanilir.
 * ZodEffects (refine/superRefine) icindeki inner schema'yi da destekler.
 *
 * @param schema - Zod object schema veya ZodEffects
 * @returns Field isimleri dizisi
 *
 * @example
 * const fields = getSchemaFields(quizSettingsStepSchema)
 * // ['name', 'durationHours', 'durationMinutes', 'lang', ...]
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSchemaFields(schema: ZodObject<any> | ZodEffects<ZodObject<any>>): string[] {
  const inner = 'shape' in schema ? schema : schema._def.schema
  return Object.keys(inner.shape)
}
