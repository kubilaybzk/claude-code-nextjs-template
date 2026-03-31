import { z } from 'zod'

import { LANGUAGE_LABELS } from '@/constants/languages'

// ============================================================
// Runtime Validation Schemas — Question Wizard
//
// Soru olusturma/duzenleme wizard'inin adim bazli ve
// birlesmis Zod schema'lari. TypeScript type/interface
// tanimlari burada YAPILMAZ.
// ============================================================

/** Desteklenen dil kodlari (LANGUAGE_LABELS key'lerinden turetilir) */
const VALID_LANG_CODES = Object.keys(LANGUAGE_LABELS) as [string, ...string[]]

// ---------- Shared Sub-Schemas ----------

/** Soru secenegi form schema'si */
const questionOptionFormSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'Option text is required'),
  is_correct: z.boolean(),
})

/** Secenekler dizisi — 2-10 arasi, en az 1 dogru, bos metin yok */
const optionsSchema = z
  .array(questionOptionFormSchema)
  .min(2, 'At least 2 options are required')
  .max(10, 'At most 10 options are allowed')
  .refine((opts) => opts.every((o) => o.text.trim().length > 0), {
    message: 'All options must have text',
  })
  .refine((opts) => opts.some((o) => o.is_correct), {
    message: 'At least one option must be marked as correct',
  })

/** Kategori dizisi — 1-3 arasi, 0-10 arasinda int */
const categoriesSchema = z
  .array(z.number().int().min(0).max(10))
  .min(1, 'Select at least 1 category')
  .max(3, 'You can select up to 3 categories')

// ---------- Per-Step Schemas ----------

/**
 * Soru bilgileri adimi validation schema'si (baslik, aciklama, dil, secenekler)
 *
 * @example
 * const fields = getSchemaFields(questionContentStepSchema)
 * form.trigger(fields)
 */
export const questionContentStepSchema = z.object({
  title: z.string().min(1, 'Question title is required'),
  description: z.string(),
  lang: z.enum(VALID_LANG_CODES),
  options: optionsSchema,
})

/**
 * Kategori, zorluk ve ipucu adimi validation schema'si
 *
 * @example
 * const fields = getSchemaFields(questionSettingsStepSchema)
 * form.trigger(fields)
 */
export const questionSettingsStepSchema = z.object({
  categories: categoriesSchema,
  difficulty: z.number().min(1.1).max(4.3),
  hint: z.string(),
})

// ---------- Combined Schemas ----------

/**
 * Tum soru wizard adimlarinin birlesmis schema'si (submit'te kullanilir)
 *
 * @example
 * const form = useForm({ resolver: zodResolver(questionWizardFullSchema) })
 */
export const questionWizardFullSchema = questionContentStepSchema.merge(
  questionSettingsStepSchema,
)

/**
 * Soru olusturma/guncelleme form schema'si (wizard disinda tek adimli form icin)
 *
 * Kurallar:
 * - Baslik zorunlu (min 1 karakter)
 * - 2-10 secenek, her biri bos olmayan metin icermeli
 * - En az bir secenek dogru olmali
 * - 1-3 kategori secilmeli
 * - Zorluk 1.1-4.3 arasi
 * - Ipucu opsiyonel
 *
 * @example
 * const parsed = questionFormSchema.parse(formValues)
 */
export const questionFormSchema = z.object({
  title: z.string().min(1, 'Question title is required'),
  description: z.string(),
  lang: z.enum(VALID_LANG_CODES),
  options: optionsSchema,
  categories: categoriesSchema,
  difficulty: z.number().min(1.1).max(4.3),
  hint: z.string(),
})

// ❌ YAPMA — type'lari buradan export etme
// export type QuestionFormValues = z.infer<typeof questionFormSchema>
//
// ✅ YAP — type'lar features/quiz/utils/transforms.ts'de tanimli
