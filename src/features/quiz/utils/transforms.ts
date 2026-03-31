/**
 * Quiz ve soru form degerleri ile API payload'lari arasindaki donusum fonksiyonlari.
 *
 * Form verisi → API istegi ve API response → form default degerleri
 * donusumleri burada yapilir. Component'ler bu mapping logic'i icermez.
 *
 * @module features/quiz/utils/transforms
 */
import type {
  CreateQuestionRequest,
  QuestionDetail,
  OptionItem,
  QuizFormData,
} from '@/services/QuizService'

// ── Question Form Values (local type — validation schema'dan turkiyor) ──

/** Soru form degerleri */
export interface QuestionFormValues {
  /** Soru basligi */
  title: string
  /** Soru aciklamasi */
  description: string
  /** Dil kodu (LANGUAGE_LABELS key'lerinden biri) */
  lang: string
  /** Secenekler */
  options: Array<{
    /** Secenek ID (edit modunda) */
    id?: string
    /** Secenek metni */
    text: string
    /** Dogru mu */
    is_correct: boolean
  }>
  /** Kategori index dizisi */
  categories: number[]
  /** Zorluk seviyesi */
  difficulty: number
  /** Ipucu metni */
  hint: string
}

/** Quiz form degerleri (UI tarafinda — wizard tum adimlarini kapsar) */
export interface QuizFormValues {
  // ── Settings Step ──
  /** Quiz adi */
  name: string
  /** Sure — saat kismi */
  durationHours: number
  /** Sure — dakika kismi */
  durationMinutes: number
  /** Minimum basari orani */
  minSuccessRate: number
  /** Public mi */
  isPublic: boolean
  /** Sureli mi */
  limitedTime: boolean
  /** Dil kodu (LANGUAGE_LABELS key'lerinden biri) */
  lang: string
  /** Baslangic tarihi */
  notBefore?: Date
  /** Bitis tarihi */
  expire?: Date
  /** Kucuk resim URL */
  image: string

  // ── Configurations Step ──
  /** Full navigation mi */
  navigation: boolean
  /** Pas hakki var mi */
  allowPass: boolean
  /** Pas hakki sayisi */
  passLimit: number
  /** Cevap sonrasi dogru/yanlis goster */
  showQuestionAnswer: boolean
  /** Tekrar hakki var mi */
  retakeAllowed: boolean
  /** Toplam tekrar hakki */
  retakeLimit: number
  /** Skorlama algoritmasi (0=First, 1=Average, 2=Highest, 3=Last) */
  scoringAlgorithm: number
  /** Sonucta puan goster */
  showResultScore: boolean
  /** Ipucu aktif */
  allowHint: boolean
  /** Sorular rastgele mi */
  randomizedQuestions: boolean

  // ── Questions Step ──
  /** Secili soru ID'leri */
  selectedQuestions: string[]
  /** Soru gosterim modu */
  questionDisplayMode: 'all_selected' | 'random_shuffle'
  /** Random modda gosterilecek soru sayisi */
  displayQuestionCount: number
  /** Cevap seceneklerini karistir */
  shuffleAnswerOptions: boolean

  // ── KPI Step ──
  /** Basari orani hedefi */
  kpiSuccessRate: number
  /** Basari orani KPI aktif mi */
  kpiSuccessRateEnabled: boolean
  /** Ilk deneme dogruluk hedefi */
  kpiFirstAttemptAccuracy: number
  /** Ilk deneme KPI aktif mi */
  kpiFirstAttemptAccuracyEnabled: boolean
  /** Beklenen deneme sayisi */
  kpiExpectedAttempts: number
  /** Deneme sayisi KPI aktif mi */
  kpiExpectedAttemptsEnabled: boolean
  /** Beklenen tamamlama suresi (dakika) */
  kpiExpectedTime: number
  /** Tamamlama suresi KPI aktif mi */
  kpiExpectedTimeEnabled: boolean
}

/** Quiz form initial data (edit modunda API'den gelen veri) */
export interface QuizFormInitialData {
  /** Quiz adi */
  name: string
  /** Sure (saniye) */
  duration: number
  /** Minimum basari orani */
  min_success_rate: number
  /** Public mi */
  is_public: boolean
  /** Dil */
  lang: string
  /** Pas hakki */
  pass_limit: number
  /** Cevap goster */
  show_question_answer: boolean
  /** Sonuc goster */
  show_result_score: boolean
  /** Navigation modu */
  navigation: boolean
  /** Resim */
  image: string
  /** Ipucu */
  allow_hint: boolean
  /** Tekrar hakki */
  retake_limit: number
  /** Skorlama */
  scoring_algorithm: number
  /** Rastgele */
  randomized_questions: boolean
  /** Baslangic timestamp */
  not_before: number
  /** Bitis timestamp */
  expire: number
  /** Tag'ler */
  tags: number[]
  /** Soru ID'leri */
  questions: string[]
  /** Soru sayisi */
  question_count: number
}

// ── Question Transforms ─────────────────────────────────────

/**
 * Soru form degerlerini API istek payload'ina donusturur
 *
 * @param values - Form degerleri
 * @returns API istek nesnesi
 *
 * @example
 * const request = questionFormToRequest(formValues)
 * createQuestion(request)
 */
export function questionFormToRequest(values: QuestionFormValues): CreateQuestionRequest {
  const options: OptionItem[] = values.options.map((opt, i) => ({
    id: opt.id,
    text: opt.text,
    is_correct: opt.is_correct,
    index: i,
  }))

  return {
    title: values.title.trim(),
    description: values.description.trim(),
    difficulty: values.difficulty,
    hint: values.hint.trim(),
    lang: values.lang,
    categories: values.categories,
    options,
  }
}

/**
 * API soru response'unu form default degerlerine donusturur (edit modu)
 *
 * @param data - API response verisi
 * @returns Form default degerleri
 *
 * @example
 * const defaults = questionResponseToForm(apiData)
 * <QuestionForm initialData={defaults} />
 */
export function questionResponseToForm(data: QuestionDetail): QuestionFormValues {
  return {
    title: data.title,
    description: data.description,
    lang: data.lang,
    options: data.options.map((o) => ({
      id: o.id,
      text: o.text,
      is_correct: o.is_correct,
    })),
    categories: data.category,
    difficulty: data.difficulty,
    hint: data.hint ?? '',
  }
}

// ── Quiz Transforms ─────────────────────────────────────────

/**
 * Quiz form degerlerini API istek payload'ina donusturur
 *
 * @param values - Form degerleri
 * @returns API istek nesnesi
 *
 * @example
 * const request = quizFormToRequest(formValues)
 * createQuiz(request)
 */
export function quizFormToRequest(values: QuizFormValues): QuizFormData {
  const isRandomShuffle = values.questionDisplayMode === 'random_shuffle'
  const selectedCount = values.selectedQuestions.length
  const displayCount = isRandomShuffle
    ? Math.min(values.displayQuestionCount || selectedCount, selectedCount)
    : selectedCount

  return {
    name: values.name.trim(),
    duration: (values.durationHours * 60 + values.durationMinutes) * 60,
    min_success_rate: values.minSuccessRate,
    is_public: values.isPublic,
    lang: values.lang,
    pass_limit: !values.navigation && values.allowPass ? values.passLimit : 0,
    show_question_answers: values.showQuestionAnswer,
    show_result_score: values.showResultScore,
    navigation: values.navigation,
    allow_hint: values.allowHint,
    retake_limit: values.retakeAllowed ? values.retakeLimit : 1,
    scoring_algorithm: values.retakeAllowed ? values.scoringAlgorithm : 0,
    randomized_questions: isRandomShuffle,
    not_before:
      values.limitedTime && values.notBefore
        ? Math.floor(values.notBefore.getTime() / 1000)
        : 0,
    expire:
      values.limitedTime && values.expire
        ? Math.floor(values.expire.getTime() / 1000)
        : 0,
    tags: [],
    questions: values.selectedQuestions,
    question_count: isRandomShuffle ? displayCount : 0,
    thumbnail_url: values.image,
    assign_quiz: false,
    candidates: [],
    question_display_mode: values.questionDisplayMode,
    shuffle_answer_options: isRandomShuffle ? values.shuffleAnswerOptions : false,
    kpi_success_rate: values.kpiSuccessRateEnabled ? values.kpiSuccessRate : 0,
    kpi_first_attempt_accuracy: values.kpiFirstAttemptAccuracyEnabled ? values.kpiFirstAttemptAccuracy : 0,
    kpi_expected_attempts: values.kpiExpectedAttemptsEnabled ? values.kpiExpectedAttempts : 0,
    kpi_expected_time: values.kpiExpectedTimeEnabled ? values.kpiExpectedTime : 0,
  }
}

/**
 * API quiz detay response'unu form initial data'ya donusturur (edit modu)
 *
 * @param data - API quiz detay response
 * @returns Form initial data
 *
 * @example
 * const initialData = quizResponseToForm(apiData)
 * <QuizForm initialData={initialData} />
 */
export function quizResponseToForm(data: Record<string, unknown>): QuizFormInitialData {
  return {
    name: data.name as string,
    duration: data.duration as number,
    min_success_rate: data.min_success_rate as number,
    is_public: data.is_public as boolean,
    lang: data.lang as string,
    pass_limit: data.pass_limit as number,
    show_question_answer: data.show_question_answer as boolean,
    show_result_score: data.show_result_score as boolean,
    navigation: data.navigation as boolean,
    image: '',
    allow_hint: data.allow_hint as boolean,
    retake_limit: data.retake_limit as number,
    scoring_algorithm: data.scoring_algorithm as number,
    randomized_questions: data.randomized_questions as boolean,
    not_before: data.not_before as number,
    expire: data.expire as number,
    tags: (data.tag as number[]) ?? [],
    questions: ((data.questions as Array<{ id: string }>) ?? []).map((q) => q.id),
    question_count: data.question_count as number,
  }
}
