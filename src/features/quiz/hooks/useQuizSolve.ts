/**
 * Quiz cozme surecinin tum state ve logic'ini yoneten custom hook.
 *
 * State yonetimi, API cagrilari, soru navigasyonu, ipucu sistemi
 * ve sonuc gosterimi tek bir hook'ta kapsullenmistir.
 *
 * Imperatif sirali kontrol icin dogrudan API client kullanilir (React Query degil).
 *
 * @module features/quiz/hooks/useQuizSolve
 *
 * @example
 * const quiz = useQuizSolve(quizId)
 * if (quiz.loading) return <Spinner />
 * return <QuestionCard question={quiz.quizQuestion} />
 */
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { quizClient } from '@/lib/quiz-client'
import { queryKeys } from '@/lib/query-keys'
import type {
  QuizDetail,
  QuizQuestion,
  EndQuizResponse,
  GetHintResponse,
  SubmitAnswerResponse,
} from '@/services/QuizService'

// ── Types ─────────────────────────────────────────────────────

/** Soru cozum durumu */
export interface QuestionStatusItem {
  /** Soru index'i */
  index: number
  /** Dogru mu (null = pas gecildi veya henuz cevaplanmadi) */
  is_correct: boolean | null
}

/** Quiz sonuc verisi */
export interface ResultData {
  /** Cevaplanan soru sayisi */
  answered_question_count: number
  /** Toplam puan */
  total_score: number | null
  /** Basari orani (%) */
  success_rate: number | null
}

/** Hook tarafindan kullanilan soru verisi */
export interface QuestionData {
  /** Soru basligi */
  title: string
  /** Soru aciklamasi (markdown destekli) */
  description: string
  /** Soru puani */
  point: number
  /** Coklu cevap mi */
  multiple_answer: boolean
  /** Ipucu mevcut mu */
  hint: boolean
  /** Ipucu alindi mi */
  is_hint_taken: boolean
  /** Secenekler */
  options: Array<{ index: number; content: string; is_correct: boolean | null }>
  /** Onceden secilmis cevaplar (resume durumunda) */
  selected_options: number[] | null
}

// ── Helpers ───────────────────────────────────────────────────

/**
 * Cevaplanmis ve pas gecilmis sorulari birlestirerek durum listesi olusturur
 *
 * @param answeredQuestions - Cevaplanmis sorular
 * @param skippedQuestions - Pas gecilen soru index'leri
 * @returns Soru durum listesi
 */
function buildQuestionStatus(
  answeredQuestions: Array<{ index: number; is_correct: boolean | null }>,
  skippedQuestions: number[],
): QuestionStatusItem[] {
  const statusMap = new Map<number, QuestionStatusItem>()

  for (const aq of answeredQuestions) {
    statusMap.set(aq.index, { index: aq.index, is_correct: aq.is_correct })
  }

  for (const skipped of skippedQuestions) {
    if (!statusMap.has(skipped)) {
      statusMap.set(skipped, { index: skipped, is_correct: null })
    }
  }

  return Array.from(statusMap.values())
}

/** Belirli sure bekler (cevap feedback animasyonu icin) */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── Hook ──────────────────────────────────────────────────────

/**
 * Quiz cozme surecinin tum state ve logic'ini yoneten hook
 *
 * @param quizId - Cozulecek quiz'in ID'si
 * @returns Quiz durumu, soru verisi ve handler fonksiyonlari
 *
 * @example
 * const quiz = useQuizSolve('quiz-123')
 * // quiz.loading, quiz.quizDetails, quiz.handleSubmit vb.
 */
export function useQuizSolve(quizId: string) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // ── State ─────────────────────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [questionLoading, setQuestionLoading] = useState(false)
  const [transitionLoading, setTransitionLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [quizDetails, setQuizDetails] = useState<QuizDetail | null>(null)
  const [quizQuestion, setQuizQuestion] = useState<QuestionData | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [questionStatus, setQuestionStatus] = useState<QuestionStatusItem[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [checkAnswer, setCheckAnswer] = useState<'correct' | 'incorrect' | ''>('')
  const [passCount, setPassCount] = useState(0)
  const [isQuizFinished, setIsQuizFinished] = useState(false)
  const [showEndModal, setShowEndModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [showHintModal, setShowHintModal] = useState(false)
  const [hintText, setHintText] = useState('')
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showRulesModal, setShowRulesModal] = useState(false)

  // Refs
  const startTimeRef = useRef<number>(Date.now())
  const fetchedRef = useRef(false)
  const prevIndexRef = useRef<number | null>(null)

  // ── Derived state ─────────────────────────────────────────

  const isQuestionAnswered = (index: number): boolean => {
    return questionStatus.some((s) => s.index === index)
  }

  const isQuestionPassed =
    quizDetails?.skipped_questions?.includes(questionIndex) ?? false

  const isSolvedQuestion =
    quizQuestion?.selected_options !== null &&
    quizQuestion?.selected_options !== undefined &&
    quizQuestion.selected_options.length > 0

  const allQuestionsAnswered =
    quizDetails !== null &&
    questionStatus.length >= quizDetails.question_count

  const unansweredQuestions: QuestionStatusItem[] = quizDetails
    ? Array.from({ length: quizDetails.question_count }, (_, i) => i + 1)
        .filter((i) => !isQuestionAnswered(i))
        .map((i) => ({ index: i, is_correct: null }))
    : []

  const progressValue = quizDetails
    ? (questionStatus.length / quizDetails.question_count) * 100
    : 0

  const showNavigation = quizDetails?.navigation ?? false
  const showPassNavigation =
    quizDetails !== null &&
    !quizDetails.navigation &&
    quizDetails.pass_limit > 0 &&
    unansweredQuestions.length > 0 &&
    unansweredQuestions.length < quizDetails.question_count

  // ── Navigation helpers ────────────────────────────────────

  const findNextUnansweredIndex = (fromIndex: number): number | null => {
    if (!quizDetails) return null
    const total = quizDetails.question_count
    for (let i = fromIndex + 1; i <= total; i++) {
      if (!isQuestionAnswered(i)) return i
    }
    for (let i = 1; i < fromIndex; i++) {
      if (!isQuestionAnswered(i)) return i
    }
    return null
  }

  const findNextUnansweredOrSkippedIndex = (fromIndex: number): number | null => {
    if (!quizDetails) return null
    const total = quizDetails.question_count
    for (let i = fromIndex + 1; i <= total; i++) {
      if (!isQuestionAnswered(i) && !(quizDetails.skipped_questions ?? []).includes(i)) {
        return i
      }
    }
    for (const skipped of quizDetails.skipped_questions ?? []) {
      if (!isQuestionAnswered(skipped)) {
        return skipped
      }
    }
    return null
  }

  // ── End Quiz ──────────────────────────────────────────────

  const saveQuiz = async () => {
    try {
      setIsQuizFinished(true)
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setTimeSpent(elapsed)

      const data = await quizClient.get<EndQuizResponse>('/current/end')
      setResultData({
        answered_question_count: data.answered_question_count,
        total_score: data.total_score,
        success_rate: data.success_rate,
      })
      setShowEndModal(false)
      setShowResultModal(true)
      void queryClient.invalidateQueries({ queryKey: queryKeys.quiz.all })
    } catch {
      toast.error('Quiz could not be finished. Please try again.')
      setIsQuizFinished(false)
    }
  }

  // ── Navigation ────────────────────────────────────────────

  const navigateToNext = () => {
    if (!quizDetails) return

    if (quizDetails.navigation) {
      const nextIndex = findNextUnansweredIndex(questionIndex)
      if (nextIndex !== null) {
        setQuestionIndex(nextIndex)
      }
    } else {
      if (questionIndex < quizDetails.question_count) {
        setQuestionIndex(questionIndex + 1)
      }
    }
  }

  const navigateAfterSubmit = async (type: 'submit' | 'pass') => {
    if (!quizDetails) return

    const isNav = quizDetails.navigation
    const hasPassLimit = quizDetails.pass_limit > 0
    const totalQuestions = quizDetails.question_count

    const currentAnsweredCount = questionStatus.length + 1
    if (currentAnsweredCount >= totalQuestions) {
      await saveQuiz()
      return
    }

    if (isNav) {
      const nextIndex = findNextUnansweredIndex(questionIndex)
      if (nextIndex !== null) {
        setQuestionIndex(nextIndex)
      } else {
        await saveQuiz()
      }
    } else if (hasPassLimit && type === 'pass') {
      if (questionIndex + 1 <= totalQuestions) {
        setQuestionIndex(questionIndex + 1)
      } else {
        const nextUnanswered = findNextUnansweredOrSkippedIndex(0)
        if (nextUnanswered !== null) {
          setQuestionIndex(nextUnanswered)
        } else {
          await saveQuiz()
        }
      }
    } else if (hasPassLimit) {
      if (questionIndex + 1 <= totalQuestions) {
        if (isQuestionAnswered(questionIndex + 1)) {
          const nextUnanswered = findNextUnansweredOrSkippedIndex(questionIndex)
          if (nextUnanswered !== null) {
            setQuestionIndex(nextUnanswered)
          } else {
            await saveQuiz()
          }
        } else {
          setQuestionIndex(questionIndex + 1)
        }
      } else {
        const nextUnanswered = findNextUnansweredOrSkippedIndex(0)
        if (nextUnanswered !== null) {
          setQuestionIndex(nextUnanswered)
        } else {
          await saveQuiz()
        }
      }
    } else {
      if (questionIndex < totalQuestions) {
        setQuestionIndex(questionIndex + 1)
      } else {
        await saveQuiz()
      }
    }
  }

  // ── Fetch Quiz Details ────────────────────────────────────

  const fetchQuizDetails = useCallback(async (force = false) => {
    if (fetchedRef.current && !force) return
    fetchedRef.current = true
    try {
      setLoading(true)
      const data = await quizClient.get<QuizDetail>('/current')

      const details: QuizDetail = {
        id: data.id,
        name: data.name,
        categories: data.categories,
        difficulty: data.difficulty,
        min_success_rate: data.min_success_rate,
        duration: data.duration,
        pass_limit: data.pass_limit,
        allow_hint: data.allow_hint,
        navigation: data.navigation,
        last_question: data.last_question,
        show_question_answer: data.show_question_answer,
        retake_limit: data.retake_limit,
        retake_count: data.retake_count,
        question_count: data.question_count,
        max_score: data.max_score,
        end_date: data.end_date * 1000,
        show_result_score: data.show_result_score,
        start_date: data.start_date * 1000,
        answered_questions: data.answered_questions ?? [],
        skipped_questions: data.skipped_questions ?? [],
        scoring_algorithm: data.scoring_algorithm,
      }

      setQuizDetails(details)

      const status = buildQuestionStatus(
        data.answered_questions ?? [],
        data.skipped_questions ?? [],
      )
      setQuestionStatus(status)
      setPassCount((data.skipped_questions ?? []).length)

      const lastQ = data.last_question
      const qCount = data.question_count
      const skipped = data.skipped_questions ?? []

      let initialIndex: number
      if (lastQ === 0 || !lastQ) {
        initialIndex = 1
      } else if (lastQ <= qCount && lastQ > 0) {
        initialIndex = lastQ
      } else if (data.pass_limit > 0 && lastQ > qCount && skipped.length > 0) {
        initialIndex = skipped[0]
      } else {
        initialIndex = qCount
      }
      setQuestionIndex(initialIndex)

      startTimeRef.current = Date.now()
    } catch {
      toast.error('Quiz could not be loaded.')
      router.push('/quiz')
    } finally {
      setLoading(false)
    }
  }, [router])

  // ── Fetch Question ────────────────────────────────────────

  const getQuestion = useCallback(async (index: number) => {
    try {
      setQuestionLoading(true)
      setCheckAnswer('')
      const data = await quizClient.get<QuizQuestion>(`/current/question/${index}`)

      const questionData: QuestionData = {
        title: data.title,
        description: data.description,
        point: data.point,
        multiple_answer: data.multiple_answer,
        hint: data.hint,
        is_hint_taken: data.is_hint_taken,
        options: data.options,
        selected_options: data.selected_options,
      }

      setQuizQuestion(questionData)

      if (data.selected_options && data.selected_options.length > 0) {
        setSelectedAnswers(data.selected_options)
      } else {
        setSelectedAnswers([])
      }
    } catch {
      toast.error('Question could not be loaded.')
    } finally {
      setQuestionLoading(false)
    }
  }, [])

  // ── Effects ───────────────────────────────────────────────

  useEffect(() => {
    fetchQuizDetails()
  }, [fetchQuizDetails])

  useEffect(() => {
    if (!quizDetails) return
    if (loading) return
    if (prevIndexRef.current !== questionIndex) {
      prevIndexRef.current = questionIndex
      getQuestion(questionIndex)
    }
  }, [questionIndex, quizDetails, loading, getQuestion])

  // ── Handlers ──────────────────────────────────────────────

  const handleSubmit = async (type: 'submit' | 'pass') => {
    if (!quizDetails || !quizQuestion) return

    if (type === 'submit' && selectedAnswers.length === 0 && !isSolvedQuestion) {
      toast.error('Please select an answer.')
      return
    }

    if (isSolvedQuestion) {
      navigateToNext()
      return
    }

    try {
      setSubmitLoading(true)

      const answersToSubmit = type === 'pass' ? [] : selectedAnswers

      const response = await quizClient.post<SubmitAnswerResponse>(
        `/current/question/${questionIndex}/answer`,
        { selected_answers: answersToSubmit },
      )

      const newStatus: QuestionStatusItem = {
        index: questionIndex,
        is_correct: response.is_correct,
      }

      setQuestionStatus((prev) => {
        const existing = prev.findIndex((s) => s.index === questionIndex)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = newStatus
          return updated
        }
        return [...prev, newStatus]
      })

      if (type === 'pass') {
        setPassCount((prev) => prev + 1)
      }

      if (quizDetails.show_question_answer && type !== 'pass') {
        setCheckAnswer(response.is_correct ? 'correct' : 'incorrect')
        setSubmitLoading(false)
        setTransitionLoading(true)
        await sleep(1200)
        setCheckAnswer('')
        setTransitionLoading(false)
      } else {
        setSubmitLoading(false)
      }

      await navigateAfterSubmit(type)
    } catch {
      toast.error('Answer could not be submitted.')
      setSubmitLoading(false)
      setTransitionLoading(false)
    }
  }

  const handlePrevious = () => {
    if (questionIndex > 1) {
      setQuestionIndex(questionIndex - 1)
    }
  }

  const handleNavigate = (index: number) => {
    setQuestionIndex(index)
  }

  const handleTimerComplete = useCallback(() => {
    toast.error('Time is up!')
    saveQuiz()
  }, [])

  const handleEndQuiz = () => {
    setShowEndModal(true)
  }

  const handleConfirmEnd = async () => {
    await saveQuiz()
  }

  const handleTakeHintClick = () => {
    setShowHintModal(true)
  }

  const handleTakeHint = async () => {
    try {
      const data = await quizClient.get<GetHintResponse>(
        `/current/question/${questionIndex}/hint`,
      )
      setHintText(data.hint)
      setQuizQuestion((prev) => (prev ? { ...prev, is_hint_taken: true } : prev))
    } catch {
      toast.error('Hint could not be retrieved.')
    }
  }

  const handleRetry = async () => {
    try {
      await quizClient.get<QuizDetail>(`/quiz/${quizId}/start`)
      setShowResultModal(false)
      setIsQuizFinished(false)
      setQuestionStatus([])
      setPassCount(0)
      setSelectedAnswers([])
      setCheckAnswer('')
      setResultData(null)
      setQuestionIndex(1)
      startTimeRef.current = Date.now()
      await fetchQuizDetails(true)
    } catch {
      toast.error('Quiz could not be restarted.')
    }
  }

  const handleFinish = () => {
    router.push('/quiz')
  }

  // ── Return ────────────────────────────────────────────────

  return {
    // State
    loading,
    questionLoading,
    transitionLoading,
    submitLoading,
    quizDetails,
    quizQuestion,
    questionIndex,
    questionStatus,
    selectedAnswers,
    checkAnswer,
    passCount,
    isQuizFinished,
    // Modal state
    showEndModal,
    setShowEndModal,
    showResultModal,
    showHintModal,
    setShowHintModal,
    showRulesModal,
    setShowRulesModal,
    hintText,
    resultData,
    timeSpent,
    // Derived
    isQuestionPassed,
    isSolvedQuestion,
    allQuestionsAnswered,
    unansweredQuestions,
    progressValue,
    showNavigation,
    showPassNavigation,
    // Handlers
    handleSubmit,
    handlePrevious,
    handleNavigate,
    handleTimerComplete,
    handleEndQuiz,
    handleConfirmEnd,
    handleTakeHintClick,
    handleTakeHint,
    handleRetry,
    handleFinish,
    setSelectedAnswers,
  }
}
