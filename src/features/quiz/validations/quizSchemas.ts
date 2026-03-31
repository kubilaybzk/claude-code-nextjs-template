import { z } from 'zod'

// ============================================================
// Runtime Validation Schemas — Quiz
//
// Bu dosya SADECE runtime validation icin Zod schema'lari icerir.
// TypeScript type/interface tanimlari burada YAPILMAZ.
// Type'lar ilgili query/mutation dosyalarinda interface olarak yasir.
// ============================================================

// ---------- Shared Sub-Schemas ----------

const quizOptionSchema = z.object({
  index: z.number(),
  content: z.string(),
  is_correct: z.boolean().nullable(),
})

const answeredQuestionSchema = z.object({
  index: z.number(),
  is_correct: z.boolean().nullable(),
})

const questionRatesSchema = z.object({
  success_rates: z.array(z.number()),
  hint_rates: z.array(z.number()),
  skip_rates: z.array(z.number()),
})

// ---------- Response Validation Schemas ----------

/**
 * Quiz listesi ogesinin runtime validation schema'si
 *
 * @example
 * const parsed = quizListItemSchema.parse(apiData)
 */
export const quizListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.array(z.number()),
  difficulty: z.number(),
  duration: z.number(),
  thumbnail_url: z.string(),
  max_score: z.number(),
  retake_count: z.number(),
  retake_limit: z.number(),
  not_before: z.number(),
  expires: z.number(),
  question_count: z.number(),
  solve_question_count: z.number(),
  start_date: z.number(),
  tag: z.array(z.number()),
  is_public: z.boolean(),
  lang: z.string(),
  type: z.number(),
})

/**
 * Quiz listesi API response'unun runtime validation schema'si
 *
 * @example
 * const parsed = quizListResponseSchema.parse(apiResponse)
 */
export const quizListResponseSchema = z.object({
  current_quiz: quizListItemSchema.nullable(),
  quiz_list: z.array(quizListItemSchema),
  total_pages: z.number(),
  available_count: z.number(),
  assigned_count: z.number(),
  upcoming_count: z.number(),
  expired_count: z.number(),
  completed_count: z.number(),
})

/**
 * Quiz detay response'unun runtime validation schema'si
 *
 * @example
 * const parsed = quizDetailSchema.parse(apiResponse)
 */
export const quizDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  categories: z.array(z.number()),
  difficulty: z.number(),
  min_success_rate: z.number(),
  duration: z.number(),
  pass_limit: z.number(),
  allow_hint: z.boolean(),
  navigation: z.boolean(),
  last_question: z.number(),
  show_question_answer: z.boolean(),
  retake_limit: z.number(),
  retake_count: z.number(),
  question_count: z.number(),
  max_score: z.number(),
  end_date: z.number(),
  show_result_score: z.boolean(),
  start_date: z.number(),
  answered_questions: z.array(answeredQuestionSchema),
  skipped_questions: z.array(z.number()),
  scoring_algorithm: z.number().min(0).max(3),
})

/**
 * Soru verisi runtime validation schema'si
 *
 * @example
 * const parsed = quizQuestionSchema.parse(questionData)
 */
export const quizQuestionSchema = z.object({
  title: z.string(),
  description: z.string(),
  point: z.number(),
  multiple_answer: z.boolean(),
  hint: z.boolean(),
  is_hint_taken: z.boolean(),
  options: z.array(quizOptionSchema),
  selected_options: z.array(z.number()).nullable(),
})

/**
 * Cevap gonderme response'unun runtime validation schema'si
 *
 * @example
 * const parsed = submitAnswerResponseSchema.parse(response)
 */
export const submitAnswerResponseSchema = z.object({
  is_correct: z.boolean().nullable(),
})

/**
 * Quiz bitirme response'unun runtime validation schema'si
 *
 * @example
 * const parsed = endQuizResponseSchema.parse(response)
 */
export const endQuizResponseSchema = z.object({
  answered_question_count: z.number(),
  total_score: z.number().nullable(),
  success_rate: z.number().nullable(),
})

/**
 * Ipucu response'unun runtime validation schema'si
 *
 * @example
 * const parsed = getHintResponseSchema.parse(response)
 */
export const getHintResponseSchema = z.object({
  hint: z.string(),
})

/**
 * Rapor overview response'unun runtime validation schema'si
 *
 * @example
 * const parsed = quizReportOverviewSchema.parse(response)
 */
export const quizReportOverviewSchema = z.object({
  name: z.string(),
  categories: z.array(z.number()),
  difficulty: z.number(),
  duration: z.number(),
  average_duration: z.number(),
  question_count: z.number(),
  score: z.number(),
  min_success_rate: z.number(),
  retake_limit: z.number(),
  allow_hint: z.boolean(),
  thumbnail_url: z.string(),
  passed_user_count: z.number(),
  assigned_user_count: z.number(),
  completed_user_count: z.number(),
  single_answer_count: z.number(),
  multiple_answer_count: z.number(),
  question_distribution: z.array(z.number()),
  question_rates: questionRatesSchema,
  attempts_success_rates: z.array(z.number()),
  time_spent_in_attempts: z.array(z.number()),
})

/**
 * KPI rapor response'unun runtime validation schema'si
 *
 * @example
 * const parsed = quizKpiReportSchema.parse(response)
 */
export const quizKpiReportSchema = z.object({
  success_rate_value: z.number(),
  success_rate_result: z.number(),
  first_attempt_accuracy_value: z.number(),
  first_attempt_accuracy_result: z.number(),
  expected_attempts_value: z.number(),
  attempts_result: z.number(),
  expected_time_value: z.number(),
  time_result: z.number(),
})

/**
 * Kullanici rapor satirinin runtime validation schema'si
 *
 * @example
 * const parsed = quizReportUserSchema.parse(userData)
 */
export const quizReportUserSchema = z.object({
  user_id: z.string(),
  email: z.string(),
  score: z.number(),
  success_rate: z.number(),
  attempt_count: z.number(),
  taken_time: z.number(),
  correct_count: z.number(),
  incorrect_count: z.number(),
  skip_count: z.number(),
  hint_used_count: z.number(),
  completion_date: z.number(),
})

/**
 * Soru rapor satirinin runtime validation schema'si
 *
 * @example
 * const parsed = quizReportQuestionSchema.parse(questionData)
 */
export const quizReportQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  score: z.number(),
  success_rate: z.number(),
  multiple_answer: z.boolean(),
  category: z.array(z.number()),
  difficulty: z.number(),
  skip_rate: z.number(),
  hint_usage: z.number(),
})

// ---------- Input Validation Schemas ----------

/**
 * Quiz listesi filtrelerinin runtime validation schema'si
 *
 * @example
 * const parsed = quizListFiltersSchema.parse({ page: 1, limit: 12, group: 0 })
 */
export const quizListFiltersSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(12),
  group: z.number().min(0).max(4).optional().default(0),
  search: z.string().min(1).max(255).optional(),
  category: z.array(z.number()).optional(),
  difficulty: z.array(z.number()).optional(),
  tag: z.array(z.number()).optional(),
  lang: z.array(z.string()).optional(),
})

/**
 * Cevap gonderme input'unun runtime validation schema'si
 *
 * @example
 * const parsed = submitAnswerSchema.parse({ selected_answers: [0, 2] })
 */
export const submitAnswerSchema = z.object({
  selected_answers: z.array(z.number()),
})

/**
 * Quiz olusturma/guncelleme input'unun runtime validation schema'si
 *
 * @example
 * const parsed = quizFormSchema.parse(formData)
 */
export const quizFormSchema = z.object({
  name: z.string().min(1, 'Quiz name is required'),
  duration: z.number().min(1, 'Duration must be at least 1 second'),
  min_success_rate: z.number().min(0).max(100),
  navigation: z.boolean(),
  show_question_answers: z.boolean(),
  retake_limit: z.number().min(0),
  scoring_algorithm: z.number().min(0).max(3),
  show_result_score: z.boolean(),
  allow_hint: z.boolean(),
  pass_limit: z.number().min(0),
  questions: z.array(z.string()).min(1, 'At least one question must be added'),
  not_before: z.number().nullable(),
  expire: z.number().nullable(),
  assign_quiz: z.boolean(),
  is_public: z.boolean(),
  candidates: z.array(z.string()),
  randomized_questions: z.boolean(),
  question_display_mode: z.string(),
  question_count: z.number().min(1),
  shuffle_answer_options: z.boolean(),
  lang: z.string().min(1),
  tags: z.array(z.number()),
  thumbnail_url: z.string(),
  kpi_success_rate: z.number().min(0).max(100),
  kpi_first_attempt_accuracy: z.number().min(0).max(100),
  kpi_expected_attempts: z.number().min(0),
  kpi_expected_time: z.number().min(0),
})

/**
 * Quiz atama input'unun runtime validation schema'si
 *
 * @example
 * const parsed = assignQuizSchema.parse({
 *   candidates: [{ email: 'user@example.com', not_before: 0, expire: 0 }]
 * })
 */
export const assignQuizSchema = z.object({
  candidates: z.array(
    z.object({
      email: z.string().email('Gecerli bir email adresi giriniz'),
      not_before: z.number().min(0),
      expire: z.number().min(0),
    }),
  ),
})

// ❌ YAPMA — type'lari buradan export etme
// export type QuizListItem = z.infer<typeof quizListItemSchema>
//
// ✅ YAP — type'lar ilgili query/mutation dosyasinda tanimli
//
// Not: Quiz wizard schema'lari quizWizardSchemas.ts'e tasinmistir.
