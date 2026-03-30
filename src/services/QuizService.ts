/**
 * Quiz Service — Quiz API hook'ları ve interface tanımları
 *
 * Quiz modülü özel bir API client (quizClient) kullanır ve response'lar
 * ApiResponse<T> wrapper'ı içermez.
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
  return useQuery<QuestionListResponse, Error>({
    queryKey: queryKeys.quiz.questions.list(filters as unknown as Record<string, unknown>),
    queryFn: () =>
      quizClient.get<QuestionListResponse>('/question', {
        params: filters as Record<string, unknown>,
      }),
  });
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
  return useQuery<QuestionDetail, Error>({
    queryKey: queryKeys.quiz.questions.detail(questionId),
    queryFn: () => quizClient.get<QuestionDetail>(`/question/${questionId}`),
    enabled: options?.enabled ?? !!questionId,
  });
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
