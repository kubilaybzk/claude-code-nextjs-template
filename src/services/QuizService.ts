/**
 * Quiz Service — Quiz API hook'ları ve interface tanımları
 *
 * Quiz modülü özel bir API client (quizClient) kullanır ve response'lar
 * ApiResponse<T> wrapper'ı içermez. Hook'lar doğrudan TanStack Query ile çalışır.
 *
 * Kullanım: import * as QuizService from '@/services/QuizService'
 *
 * @example
 * // Query
 * const { data, isLoading } = QuizService.useGetQuizList({ page: 1, group: 0 })
 *
 * @example
 * // Mutation
 * const { deleteQuiz, isPending } = QuizService.useDeleteQuiz({
 *   onSuccess: () => toast.success('Silindi'),
 * })
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { quizClient } from '@/lib/quiz-client';

// ============================================================
// INTERFACES — Quiz List
// ============================================================

/** Quiz listesi filtre parametreleri */
export interface QuizListFilters {
  /** Sayfa numarası */
  page?: number;
  /** Tab grubu (0=available, 1=assigned, 2=upcoming, 3=expired, 4=completed) */
  group?: number;
  /** Kategori filtresi (index dizisi) */
  category?: number[];
  /** Zorluk filtresi */
  difficulty?: number[];
  /** Arama metni */
  search?: string;
  /** Tag filtresi */
  tag?: number[];
  /** Dil filtresi */
  lang?: string[];
  /** Sayfa başına kayıt */
  limit?: number;
}

/** Quiz listesi response */
export interface QuizListResponse {
  /** Devam eden quiz (varsa) */
  current_quiz: QuizListItem | null;
  /** Quiz dizisi */
  quiz_list: QuizListItem[];
  /** Toplam sayfa sayısı */
  total_pages: number;
  /** Available tab sayacı */
  available_count: number;
  /** Assigned tab sayacı */
  assigned_count: number;
  /** Upcoming tab sayacı */
  upcoming_count: number;
  /** Expired tab sayacı */
  expired_count: number;
  /** Completed tab sayacı */
  completed_count: number;
}

/** Tekil quiz listesi öğesi */
export interface QuizListItem {
  /** Quiz ID */
  id: string;
  /** Quiz adı */
  name: string;
  /** Kategori index dizisi */
  category: number[];
  /** Zorluk seviyesi (1.1 - 4.3) */
  difficulty: number;
  /** Süre (saniye) */
  duration: number;
  /** Küçük resim URL'i */
  thumbnail_url: string;
  /** Maksimum puan */
  max_score: number;
  /** Kullanılan deneme sayısı */
  retake_count: number;
  /** Toplam deneme hakkı (0=sınırsız) */
  retake_limit: number;
  /** Başlangıç tarihi (unix timestamp saniye) */
  not_before: number;
  /** Bitiş tarihi (unix timestamp saniye) */
  expires: number;
  /** Soru sayısı */
  question_count: number;
  /** Çözülen soru sayısı (current quiz'de) */
  solve_question_count: number;
  /** Başlangıç tarihi (current quiz'de, unix timestamp saniye) */
  start_date: number;
  /** Tag dizisi */
  tag: number[];
  /** Public mi */
  is_public: boolean;
  /** Dil */
  lang: string;
  /** Quiz tipi (0=normal, 1=personalization) */
  type: number;
}

// ============================================================
// INTERFACES — Quiz Detail / Rules
// ============================================================

/** Quiz detay (rules modal ve solve sayfa) */
export interface QuizDetail {
  /** Quiz ID */
  id: string;
  /** Quiz adı */
  name: string;
  /** Kategori index dizisi */
  categories: number[];
  /** Zorluk seviyesi */
  difficulty: number;
  /** Minimum başarı oranı (%) */
  min_success_rate: number;
  /** Süre (saniye) */
  duration: number;
  /** Pas geçme hakkı (0=yok) */
  pass_limit: number;
  /** İpucu aktif mi */
  allow_hint: boolean;
  /** true = full navigation, false = sequential */
  navigation: boolean;
  /** Son görülen soru index'i */
  last_question: number;
  /** Cevap sonrası doğru/yanlış gösterilsin mi */
  show_question_answer: boolean;
  /** Toplam deneme hakkı */
  retake_limit: number;
  /** Kullanılan deneme sayısı */
  retake_count: number;
  /** Toplam soru sayısı */
  question_count: number;
  /** Maksimum puan */
  max_score: number;
  /** Bitiş tarihi (unix timestamp) */
  end_date: number;
  /** Sonuçta puan gösterilsin mi */
  show_result_score: boolean;
  /** Başlangıç (unix timestamp saniye) */
  start_date: number;
  /** Cevaplanmış sorular */
  answered_questions: Array<{ index: number; is_correct: boolean | null }>;
  /** Pas geçilen soru index'leri */
  skipped_questions: number[];
  /** Skorlama algoritması (0-3) */
  scoring_algorithm: number;
}

// ============================================================
// INTERFACES — Question
// ============================================================

/** Soru verisi */
export interface QuizQuestion {
  /** Soru başlığı */
  title: string;
  /** Soru açıklaması (markdown destekli) */
  description: string;
  /** Soru puanı */
  point: number;
  /** Çoklu cevap mı */
  multiple_answer: boolean;
  /** İpucu mevcut mu */
  hint: boolean;
  /** İpucu alındı mı */
  is_hint_taken: boolean;
  /** Seçenekler */
  options: QuizOption[];
  /** Önceden seçilmiş cevaplar (resume durumunda) */
  selected_options: number[] | null;
}

/** Soru seçeneği */
export interface QuizOption {
  /** Seçenek index'i */
  index: number;
  /** Seçenek metni */
  content: string;
  /** Doğru mu (çözülmeden null) */
  is_correct: boolean | null;
}

// ============================================================
// INTERFACES — Answer / End
// ============================================================

/** Cevap gönderme isteği */
export interface SubmitAnswerRequest {
  /** Seçilen seçenek index'leri (pas = []) */
  selected_answers: number[];
}

/** Cevap gönderme response */
export interface SubmitAnswerResponse {
  /** null = pas geçildi */
  is_correct: boolean | null;
}

/** Quiz bitirme response */
export interface EndQuizResponse {
  /** Cevaplanan soru sayısı */
  answered_question_count: number;
  /** Toplam puan */
  total_score: number | null;
  /** Başarı oranı (%) */
  success_rate: number | null;
}

/** İpucu response */
export interface GetHintResponse {
  /** İpucu metni */
  hint: string;
}

// ============================================================
// INTERFACES — Report
// ============================================================

/** Rapor overview response */
export interface QuizReportOverview {
  /** Quiz adı */
  name: string;
  /** Kategoriler */
  categories: number[];
  /** Zorluk */
  difficulty: number;
  /** Süre (saniye) */
  duration: number;
  /** Ortalama tamamlanma süresi */
  average_duration: number;
  /** Soru sayısı */
  question_count: number;
  /** Maksimum puan */
  score: number;
  /** Minimum başarı oranı */
  min_success_rate: number;
  /** Deneme hakkı */
  retake_limit: number;
  /** İpucu aktif mi */
  allow_hint: boolean;
  /** Küçük resim */
  thumbnail_url: string;
  /** Geçen kullanıcı sayısı */
  passed_user_count: number;
  /** Atanan kullanıcı sayısı */
  assigned_user_count: number;
  /** Tamamlayan kullanıcı sayısı */
  completed_user_count: number;
  /** Tekli cevaplı soru sayısı */
  single_answer_count: number;
  /** Çoklu cevaplı soru sayısı */
  multiple_answer_count: number;
  /** Soru dağılımı [easy%, medium%, hard%, expert%] */
  question_distribution: number[];
  /** Soru bazlı oranlar */
  question_rates: {
    /** Soru başına başarı oranı */
    success_rates: number[];
    /** Soru başına ipucu oranı */
    hint_rates: number[];
    /** Soru başına pas oranı */
    skip_rates: number[];
  };
  /** Deneme başına başarı oranı */
  attempts_success_rates: number[];
  /** Deneme başına harcanan süre */
  time_spent_in_attempts: number[];
}

/** KPI rapor response */
export interface QuizKpiReport {
  /** Başarı oranı hedefi */
  success_rate_value: number;
  /** Başarı oranı gerçekleşeni */
  success_rate_result: number;
  /** İlk deneme doğruluk hedefi */
  first_attempt_accuracy_value: number;
  /** İlk deneme doğruluk gerçekleşeni */
  first_attempt_accuracy_result: number;
  /** Beklenen deneme sayısı hedefi */
  expected_attempts_value: number;
  /** Deneme sayısı gerçekleşeni */
  attempts_result: number;
  /** Beklenen süre hedefi (saniye) */
  expected_time_value: number;
  /** Süre gerçekleşeni (saniye) */
  time_result: number;
}

/** Kullanıcı rapor satırı */
export interface QuizReportUser {
  /** Kullanıcı ID */
  user_id: string;
  /** Kullanıcı email */
  email: string;
  /** Puan */
  score: number;
  /** Başarı oranı (%) */
  success_rate: number;
  /** Deneme sayısı */
  attempt_count: number;
  /** Harcanan süre (saniye) */
  taken_time: number;
  /** Doğru cevap sayısı */
  correct_count: number;
  /** Yanlış cevap sayısı */
  incorrect_count: number;
  /** Pas geçilen soru sayısı */
  skip_count: number;
  /** İpucu kullanım sayısı */
  hint_used_count: number;
  /** Tamamlanma tarihi */
  completion_date: number;
}

/** Soru rapor satırı */
export interface QuizReportQuestion {
  /** Soru ID */
  id: string;
  /** Soru başlığı */
  title: string;
  /** Soru puanı */
  score: number;
  /** Başarı oranı (%) */
  success_rate: number;
  /** Çoklu cevap mı */
  multiple_answer: boolean;
  /** Kategoriler */
  category: number[];
  /** Zorluk */
  difficulty: number;
  /** Pas oranı (%) */
  skip_rate: number;
  /** İpucu kullanım oranı (%) */
  hint_usage: number;
}

// ============================================================
// INTERFACES — Quiz Create/Update
// ============================================================

/** Quiz oluşturma/güncelleme isteği */
export interface QuizFormData {
  /** Quiz adı */
  name: string;
  /** Süre (saniye) */
  duration: number;
  /** Minimum başarı oranı (0-100) */
  min_success_rate: number;
  /** true = full navigation */
  navigation: boolean;
  /** Cevap sonrası doğru/yanlış göster */
  show_question_answers: boolean;
  /** Deneme hakkı (0=sınırsız) */
  retake_limit: number;
  /** Skorlama algoritması (0-3) */
  scoring_algorithm: number;
  /** Sonuçta puanı göster */
  show_result_score: boolean;
  /** İpucu aktif */
  allow_hint: boolean;
  /** Pas hakkı (0=yok) */
  pass_limit: number;
  /** Soru ID listesi */
  questions: string[];
  /** Başlangıç (unix timestamp saniye) */
  not_before: number | null;
  /** Bitiş (unix timestamp saniye) */
  expire: number | null;
  /** Atama yapılsın mı */
  assign_quiz: boolean;
  /** Public mi */
  is_public: boolean;
  /** Aday email listesi */
  candidates: string[];
  /** Sorular rastgele mi */
  randomized_questions: boolean;
  /** Soru gösterim modu */
  question_display_mode: string;
  /** Gösterilecek soru sayısı */
  question_count: number;
  /** Cevap seçeneklerini karıştır */
  shuffle_answer_options: boolean;
  /** Dil */
  lang: string;
  /** Tag'ler */
  tags: number[];
  /** Küçük resim URL */
  thumbnail_url: string;
  /** KPI hedefleri */
  kpi_success_rate: number;
  /** KPI: İlk deneme doğruluğu */
  kpi_first_attempt_accuracy: number;
  /** KPI: Beklenen deneme sayısı */
  kpi_expected_attempts: number;
  /** KPI: Beklenen süre */
  kpi_expected_time: number;
}

// ============================================================
// INTERFACES — Question Bank
// ============================================================

/** Soru listesi filtre parametreleri */
export interface QuestionListFilters {
  /** Arama metni */
  search?: string;
  /** Sayfa numarası */
  page?: number;
  /** Sayfa başına kayıt */
  limit?: number;
  /** Kategori filtresi (index dizisi) */
  categories?: number[];
  /** Zorluk filtresi (1.1 - 4.3 degerleri) */
  difficulty?: number[];
}

/** Soru listesi response */
export interface QuestionListResponse {
  /** Soru dizisi */
  questions: QuestionListItem[];
  /** Toplam soru sayısı */
  total: number;
}

/** Tekil soru listesi öğesi */
export interface QuestionListItem {
  /** Soru ID */
  id: string;
  /** Soru başlığı */
  title: string;
  /** Soru açıklaması */
  description: string;
  /** Soru puanı */
  score: number;
  /** Başarı oranı (%) */
  success_rate: number | null;
  /** Çoklu cevap mı (true=multiple, false=single) */
  type: boolean;
  /** Kategori index dizisi */
  category: number[];
  /** Zorluk seviyesi (1.1 - 4.3) */
  difficulty: number;
  /** İpucu var mı */
  hint: boolean;
}

/** Soru detay response (form edit için) */
export interface QuestionDetail {
  /** Soru ID */
  id: string;
  /** Soru başlığı */
  title: string;
  /** Soru açıklaması */
  description: string;
  /** Dil */
  lang: string;
  /** Seçenekler */
  options: OptionItem[];
  /** Kategori index dizisi */
  category: number[];
  /** Zorluk seviyesi */
  difficulty: number;
  /** İpucu metni */
  hint: string | null;
  /** Soru puanı */
  score: number;
}

/** Soru seçeneği (form ve API) */
export interface OptionItem {
  /** Seçenek ID (edit modunda) */
  id?: string;
  /** Seçenek metni */
  text: string;
  /** Doğru mu */
  is_correct: boolean;
  /** Sıra index'i */
  index: number;
}

/** Soru oluşturma/güncelleme isteği */
export interface CreateQuestionRequest {
  /** Soru başlığı */
  title: string;
  /** Soru açıklaması */
  description: string;
  /** Dil */
  lang: string;
  /** Seçenekler */
  options: OptionItem[];
  /** Kategori index dizisi */
  categories: number[];
  /** Zorluk seviyesi */
  difficulty: number;
  /** İpucu metni */
  hint: string;
}

/** Atama isteği */
export interface AssignQuizRequest {
  /** Aday listesi */
  candidates: Array<{
    /** Email */
    email: string;
    /** Başlangıç */
    not_before: number;
    /** Bitiş */
    expire: number;
  }>;
}

// ============================================================
// QUERY HOOKS
// ============================================================

/**
 * Quiz listesini getirir
 *
 * @param filters - Filtre parametreleri
 * @returns Quiz listesi response
 *
 * @example
 * const { data, isLoading } = QuizService.useGetQuizList({ page: 1, group: 0 })
 * const quizzes = data?.quiz_list ?? []
 */
export function useGetQuizList(filters: QuizListFilters) {
  return useQuery<QuizListResponse>(
    queryKeys.quiz.list(filters as unknown as Record<string, unknown>),
    () => quizClient.get<QuizListResponse>('/quiz', { params: filters as Record<string, unknown> }),
  );
}

/**
 * Quiz detayını getirir
 *
 * @param quizId - Quiz ID
 * @param options - Opsiyonel ayarlar
 * @returns Quiz detay
 *
 * @example
 * const { data } = QuizService.useGetQuizDetail(quizId, { enabled: !!quizId })
 */
export function useGetQuizDetail(quizId: string, options?: { enabled?: boolean; isRefId?: boolean }) {
  return useQuery<QuizDetail>(
    queryKeys.quiz.detail(quizId),
    () =>
      quizClient.get<QuizDetail>(`/quiz/${quizId}`, {
        params: options?.isRefId ? { is_ref_id: true } : undefined,
      }),
    {
      enabled: options?.enabled ?? !!quizId,
    },
  );
}

/**
 * Aktif quiz oturumunu getirir
 *
 * @returns Aktif quiz detayları
 *
 * @example
 * const { data: currentQuiz } = QuizService.useGetCurrentQuiz()
 */
export function useGetCurrentQuiz(options?: { enabled?: boolean }) {
  return useQuery<QuizDetail>(queryKeys.quiz.current(), () => quizClient.get<QuizDetail>('/current'), {
    enabled: options?.enabled,
  });
}

/**
 * Aktif quizden soru getirir
 *
 * @param questionIndex - Soru index'i
 * @returns Soru verisi
 *
 * @example
 * const { data: question } = QuizService.useGetCurrentQuestion(1)
 */
export function useGetCurrentQuestion(questionIndex: number, options?: { enabled?: boolean }) {
  return useQuery<QuizQuestion>(
    queryKeys.quiz.currentQuestion(questionIndex),
    () => quizClient.get<QuizQuestion>(`/current/question/${questionIndex}`),
    {
      enabled: options?.enabled ?? questionIndex > 0,
    },
  );
}

/**
 * Quiz rapor overview getirir
 *
 * @param quizId - Quiz ID
 * @returns Rapor overview
 */
export function useGetReportOverview(quizId: string) {
  return useQuery<QuizReportOverview>(
    queryKeys.quiz.report.overview(quizId),
    () => quizClient.get<QuizReportOverview>(`/${quizId}/report/overview`),
    {
      enabled: !!quizId,
    },
  );
}

/**
 * Quiz KPI raporu getirir
 *
 * @param quizId - Quiz ID
 * @returns KPI rapor
 */
export function useGetReportKpi(quizId: string) {
  return useQuery<QuizKpiReport>(
    queryKeys.quiz.report.kpi(quizId),
    () => quizClient.get<QuizKpiReport>(`/${quizId}/report/kpi`),
    {
      enabled: !!quizId,
    },
  );
}

/**
 * Quiz kullanıcı istatistikleri getirir
 *
 * @param quizId - Quiz ID
 * @param filters - Filtre parametreleri
 * @returns Kullanıcı istatistikleri
 */
export function useGetReportUsers(quizId: string, filters: Record<string, unknown> = {}) {
  return useQuery<QuizReportUser[]>(
    queryKeys.quiz.report.users(quizId, filters),
    () => quizClient.get<QuizReportUser[]>(`/${quizId}/report/user`, { params: filters }),
    {
      enabled: !!quizId,
    },
  );
}

/**
 * Belirli deneme istatistikleri getirir
 *
 * @param quizId - Quiz ID
 * @param attemptNo - Deneme numarası
 * @returns Kullanıcı istatistikleri
 */
export function useGetReportUserAttempt(quizId: string, attemptNo: number) {
  return useQuery<QuizReportUser[]>(
    queryKeys.quiz.report.userAttempt(quizId, attemptNo),
    () => quizClient.get<QuizReportUser[]>(`/${quizId}/report/user/attempt/${attemptNo}`),
    {
      enabled: !!quizId && attemptNo > 0,
    },
  );
}

/**
 * Kullanıcı deneme detayı getirir
 *
 * @param quizId - Quiz ID
 * @param userId - Kullanıcı ID
 * @param attemptNo - Deneme numarası
 */
export function useGetReportUserAttemptDetail(quizId: string, userId: string, attemptNo: number) {
  return useQuery<unknown>(
    queryKeys.quiz.report.userAttemptDetail(quizId, userId, attemptNo),
    () => quizClient.get<unknown>(`/${quizId}/report/user/${userId}/attempt/${attemptNo}`),
    {
      enabled: !!quizId && !!userId && attemptNo > 0,
    },
  );
}

/**
 * Soru istatistikleri getirir
 *
 * @param quizId - Quiz ID
 */
export function useGetReportQuestions(quizId: string) {
  return useQuery<QuizReportQuestion[]>(
    queryKeys.quiz.report.questions(quizId),
    () => quizClient.get<QuizReportQuestion[]>(`/${quizId}/report/questions`),
    {
      enabled: !!quizId,
    },
  );
}

// ============================================================
// MUTATION HOOKS
// ============================================================

/**
 * Quiz oluşturur
 *
 * @example
 * const { createQuiz, isPending } = QuizService.useCreateQuiz({
 *   onSuccess: () => toast.success('Quiz oluşturuldu'),
 * })
 * createQuiz(formData)
 */
export function useCreateQuiz(options?: { onSuccess?: () => void; onError?: (err: Error) => void }) {
  const queryClient = useQueryClient();
  const mutation = useMutation<{ id: string }, Error, QuizFormData>({
    mutationFn: (data) => quizClient.post<{ id: string }>('/quiz', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });

  return {
    ...mutation,
    createQuiz: (data: QuizFormData) => mutation.mutate(data),
  };
}

/**
 * Quiz günceller
 *
 * @example
 * const { updateQuiz, isPending } = QuizService.useUpdateQuiz(quizId, {
 *   onSuccess: () => toast.success('Güncellendi'),
 * })
 */
export function useUpdateQuiz(quizId: string, options?: { onSuccess?: () => void; onError?: (err: Error) => void }) {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, QuizFormData>({
    mutationFn: (data) => quizClient.put<void>(`/quiz/${quizId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });

  return {
    ...mutation,
    updateQuiz: (data: QuizFormData) => mutation.mutate(data),
  };
}

/**
 * Quiz siler
 *
 * @example
 * const { deleteQuiz, isPending } = QuizService.useDeleteQuiz({
 *   onSuccess: () => toast.success('Silindi'),
 * })
 */
export function useDeleteQuiz(options?: { onSuccess?: () => void; onError?: (err: Error) => void }) {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, string>({
    mutationFn: (quizId) => quizClient.delete<void>(`/quiz/${quizId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });

  return {
    ...mutation,
    deleteQuiz: (quizId: string) => mutation.mutate(quizId),
  };
}

/**
 * Quiz başlatır
 *
 * GET-based mutation olduğu için quizClient.get kullanılır.
 *
 * @example
 * const { startQuiz } = QuizService.useStartQuiz()
 * await startQuiz(quizId)
 */
export function useStartQuiz() {
  const queryClient = useQueryClient();

  const start = async (quizId: string, isRefId?: boolean) => {
    const params = isRefId ? { is_ref_id: true } : undefined;
    const result = await quizClient.get<QuizDetail>(`/quiz/${quizId}/start`, { params });
    queryClient.invalidateQueries({ queryKey: queryKeys.quiz.lists() });
    queryClient.invalidateQueries({ queryKey: queryKeys.quiz.current() });
    return result;
  };

  return { startQuiz: start };
}

/**
 * Cevap gönderir
 *
 * @example
 * const { submitAnswer } = QuizService.useSubmitAnswer()
 * const result = await submitAnswer(1, { selected_answers: [0, 2] })
 */
export function useSubmitAnswer() {
  const submit = async (questionIndex: number, data: SubmitAnswerRequest) => {
    return quizClient.post<SubmitAnswerResponse>(`/current/question/${questionIndex}/answer`, data);
  };

  return { submitAnswer: submit };
}

/**
 * Quiz'i bitirir
 *
 * @example
 * const { endQuiz } = QuizService.useEndQuiz()
 * const result = await endQuiz()
 */
export function useEndQuiz() {
  const queryClient = useQueryClient();

  const end = async () => {
    const result = await quizClient.get<EndQuizResponse>('/current/end');
    queryClient.invalidateQueries({ queryKey: queryKeys.quiz.all });
    return result;
  };

  return { endQuiz: end };
}

/**
 * İpucu alır
 *
 * @example
 * const { getHint } = QuizService.useGetHint()
 * const result = await getHint(1)
 */
export function useGetHint() {
  const get = async (questionIndex: number) => {
    return quizClient.get<GetHintResponse>(`/current/question/${questionIndex}/hint`);
  };

  return { getHint: get };
}

/**
 * Quiz atar
 *
 * @example
 * const { assignQuiz, isPending } = QuizService.useAssignQuiz(quizId)
 */
export function useAssignQuiz(quizId: string, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, AssignQuizRequest>({
    mutationFn: (data) => quizClient.post<void>(`/quiz/${quizId}/assign`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.assignments(quizId) });
      options?.onSuccess?.();
    },
  });

  return {
    ...mutation,
    assignQuiz: (data: AssignQuizRequest) => mutation.mutate(data),
  };
}

/**
 * Quiz atamasını kaldırır
 *
 * @example
 * const { deleteAssignment } = QuizService.useDeleteAssignment(quizId)
 */
export function useDeleteAssignment(quizId: string, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, { candidates: string[] }>({
    mutationFn: (data) => quizClient.delete<void>(`/quiz/${quizId}/assign`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.assignments(quizId) });
      options?.onSuccess?.();
    },
  });

  return {
    ...mutation,
    deleteAssignment: (candidates: string[]) => mutation.mutate({ candidates }),
  };
}

// ============================================================
// QUESTION BANK HOOKS
// ============================================================

/**
 * Soru listesini getirir (Question Bank)
 *
 * @param filters - Filtre parametreleri (search, page, limit)
 * @returns Soru listesi response
 *
 * @example
 * const { data, isLoading } = QuizService.useGetQuestionList({ page: 1, limit: 10 })
 * const questions = data?.questions ?? []
 */
export function useGetQuestionList(filters: QuestionListFilters) {
  return useQuery<QuestionListResponse>(
    queryKeys.quiz.questions.list(filters as unknown as Record<string, unknown>),
    () => quizClient.get<QuestionListResponse>('/question', { params: filters as Record<string, unknown> }),
  );
}

/**
 * Soru detayını getirir (edit modu için)
 *
 * @param questionId - Soru ID
 * @returns Soru detayı
 *
 * @example
 * const { data } = QuizService.useGetQuestionDetail(questionId)
 */
export function useGetQuestionDetail(questionId: string, options?: { enabled?: boolean }) {
  return useQuery<QuestionDetail>(
    queryKeys.quiz.questions.detail(questionId),
    () => quizClient.get<QuestionDetail>(`/question/${questionId}`),
    {
      enabled: options?.enabled ?? !!questionId,
    },
  );
}

/**
 * Yeni soru oluşturur
 *
 * @example
 * const { createQuestion, isPending } = QuizService.useCreateQuestion({
 *   onSuccess: () => toast.success('Soru oluşturuldu'),
 * })
 * createQuestion(formData)
 */
export function useCreateQuestion(options?: { onSuccess?: () => void; onError?: (err: Error) => void }) {
  const queryClient = useQueryClient();
  const mutation = useMutation<{ id: string }, Error, CreateQuestionRequest>({
    mutationFn: (data) => quizClient.post<{ id: string }>('/question', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.questions.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });

  return {
    ...mutation,
    createQuestion: (data: CreateQuestionRequest) => mutation.mutate(data),
  };
}

/**
 * Soruyu günceller
 *
 * @param questionId - Soru ID
 * @example
 * const { updateQuestion, isPending } = QuizService.useUpdateQuestion(questionId, {
 *   onSuccess: () => toast.success('Güncellendi'),
 * })
 */
export function useUpdateQuestion(questionId: string, options?: { onSuccess?: () => void; onError?: (err: Error) => void }) {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, CreateQuestionRequest>({
    mutationFn: (data) => quizClient.put<void>(`/question/${questionId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.questions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.questions.detail(questionId) });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });

  return {
    ...mutation,
    updateQuestion: (data: CreateQuestionRequest) => mutation.mutate(data),
  };
}

/**
 * Soruyu siler
 *
 * @example
 * const { deleteQuestion, isPending } = QuizService.useDeleteQuestion({
 *   onSuccess: () => toast.success('Silindi'),
 * })
 * deleteQuestion(questionId)
 */
export function useDeleteQuestion(options?: { onSuccess?: () => void; onError?: (err: Error) => void }) {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, string>({
    mutationFn: (questionId) => quizClient.delete<void>(`/question/${questionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.questions.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });

  return {
    ...mutation,
    deleteQuestion: (questionId: string) => mutation.mutate(questionId),
  };
}
