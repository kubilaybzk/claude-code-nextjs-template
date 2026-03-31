import { z } from 'zod'

import { LANGUAGE_LABELS } from '@/constants/languages'

/** Desteklenen dil kodlari (LANGUAGE_LABELS key'lerinden turetilir) */
const VALID_LANG_CODES = Object.keys(LANGUAGE_LABELS) as [string, ...string[]]

// ============================================================
// Per-Step Wizard Schemas — Quiz
//
// Her adimin kendi Zod schema'si + tum adimlarin birlesmis schema'si.
// Bu dosya SADECE wizard form validasyonu icindir.
// API response/input schema'lari quizSchemas.ts'de kalir.
// ============================================================

// ── Settings Step ─────────────────────────────────────────

/** Settings adimi temel object schema'si (merge icin kullanilir) */
const quizSettingsStepBaseSchema = z.object({
  name: z.string().min(1, 'Quiz name is required'),
  durationHours: z.number().int().min(0, 'Hours must be 0 or greater'),
  durationMinutes: z.number().int().min(0, 'Minutes must be 0 or greater').max(59, 'Minutes must be 59 or less'),
  lang: z.enum(VALID_LANG_CODES),
  isPublic: z.boolean(),
  limitedTime: z.boolean(),
  notBefore: z.date().optional(),
  expire: z.date().optional(),
  image: z.string(),
  minSuccessRate: z.number().int().min(0).max(100),
})

/**
 * Settings adimi validation schema'si
 *
 * @example
 * const fields = getSchemaFields(quizSettingsStepSchema)
 * form.trigger(fields)
 */
export const quizSettingsStepSchema = quizSettingsStepBaseSchema.refine(
  (data) => data.durationHours * 60 + data.durationMinutes >= 1,
  { message: 'Total duration must be at least 1 minute', path: ['durationMinutes'] },
)

// ── Configurations Step ───────────────────────────────────

/**
 * Configurations adimi validation schema'si
 *
 * @example
 * const fields = getSchemaFields(quizConfigurationsStepSchema)
 * form.trigger(fields)
 */
export const quizConfigurationsStepSchema = z.object({
  navigation: z.boolean(),
  allowPass: z.boolean(),
  passLimit: z.number().int().min(0),
  showQuestionAnswer: z.boolean(),
  retakeAllowed: z.boolean(),
  retakeLimit: z.number().int().min(0),
  scoringAlgorithm: z.number().int().min(0).max(3),
  showResultScore: z.boolean(),
  allowHint: z.boolean(),
  randomizedQuestions: z.boolean(),
})

// ── Questions Step ────────────────────────────────────────

/**
 * Soru secimi adimi validation schema'si
 *
 * @example
 * const fields = getSchemaFields(quizQuestionsStepSchema)
 * form.trigger(fields)
 */
export const quizQuestionsStepSchema = z.object({
  selectedQuestions: z.array(z.string()).min(1, 'Select at least one question'),
  questionDisplayMode: z.enum(['all_selected', 'random_shuffle']),
  displayQuestionCount: z.number().int().min(0),
  shuffleAnswerOptions: z.boolean(),
})

// ── KPI Step ──────────────────────────────────────────────

/**
 * KPI adimi validation schema'si (zorunlu alan yok)
 *
 * @example
 * const fields = getSchemaFields(quizKpiStepSchema)
 * form.trigger(fields)
 */
export const quizKpiStepSchema = z.object({
  kpiSuccessRate: z.number().min(0).max(100),
  kpiSuccessRateEnabled: z.boolean(),
  kpiFirstAttemptAccuracy: z.number().min(0).max(100),
  kpiFirstAttemptAccuracyEnabled: z.boolean(),
  kpiExpectedAttempts: z.number().int().min(0),
  kpiExpectedAttemptsEnabled: z.boolean(),
  kpiExpectedTime: z.number().int().min(0),
  kpiExpectedTimeEnabled: z.boolean(),
})

// ── Full Wizard Schema ────────────────────────────────────

/**
 * Tum wizard adimlarinin birlesmis schema'si (submit'te kullanilir)
 *
 * @example
 * const form = useForm({ resolver: zodResolver(quizWizardFullSchema) })
 */
export const quizWizardFullSchema = quizSettingsStepBaseSchema
  .merge(quizConfigurationsStepSchema)
  .merge(quizQuestionsStepSchema)
  .merge(quizKpiStepSchema)
  .refine(
    (data) => data.durationHours * 60 + data.durationMinutes >= 1,
    { message: 'Toplam sure en az 1 dakika olmali', path: ['durationMinutes'] },
  )
