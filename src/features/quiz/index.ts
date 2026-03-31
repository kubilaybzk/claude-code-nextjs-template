// ============================================================
// Barrel Exports — Quiz Feature Public API
//
// Query/Mutation hook'ları ve interface'ler:
// → import * as QuizService from '@/services/QuizService'
//
// Query key'ler:
// → import { queryKeys } from '@/lib/query-keys'
// → queryKeys.quiz.list(filters), queryKeys.quiz.detail(id), vb.
// ============================================================

// --- Constants ---
export {
  QuizGroup,
  QUIZ_GROUP_OPTIONS,
  THUMBNAIL_PATHS,
  DATE_DISPLAY_FORMAT,
  MAX_CATEGORY_ICONS,
  NEW_BADGE_DAYS,
  calculateEndTime,
} from './constants'

export { QuizIcons } from './constants'
export type { QuizIconsType } from './constants'

// --- Utils ---
export {
  formatDuration,
  formatDurationMinutes,
  calculateRemainingTime,
  getScoringLabel,
  formatTimestamp,
  isQuizOngoing,
  getCardStatus,
  isNewQuiz,
} from './utils'
export type { CardStatus } from './utils'

// --- Hooks ---
export * from './hooks'

// Route kökü *Page bileşenleri
export * from './sections'

// --- Validation Schemas ---
export {
  quizListItemSchema,
  quizListResponseSchema,
  quizDetailSchema,
  quizQuestionSchema,
  submitAnswerResponseSchema,
  endQuizResponseSchema,
  getHintResponseSchema,
  quizReportOverviewSchema,
  quizKpiReportSchema,
  quizReportUserSchema,
  quizReportQuestionSchema,
  quizListFiltersSchema,
  submitAnswerSchema,
  quizFormSchema,
  assignQuizSchema,
  quizSettingsStepSchema,
  quizConfigurationsStepSchema,
  quizQuestionsStepSchema,
  quizKpiStepSchema,
  quizWizardFullSchema,
  questionContentStepSchema,
  questionSettingsStepSchema,
  questionWizardFullSchema,
  questionFormSchema,
} from './validations'

