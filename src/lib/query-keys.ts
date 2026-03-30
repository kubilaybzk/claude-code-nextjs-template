// ============================================================
// Merkezi Query Key Yönetimi
//
// Tüm API sorgularının cache key'leri burada tanımlanır.
// Her yeni servis (feature) için buraya bir bölüm eklenir.
//
// Key hierarchy: [domain, scope, ...params]
// Invalidation: üst seviye key invalidate edildiğinde alt key'ler de invalidate olur.
// ============================================================

/**
 * Merkezi query key factory
 *
 * Her service dosyası bu key'leri kullanır.
 * Cache invalidation bu key hierarchy üzerinden yapılır.
 *
 * @example
 * // Tüm employee query'lerini invalidate et
 * queryClient.invalidateQueries({ queryKey: queryKeys.employee.all })
 *
 * @example
 * // Sadece employee listesini invalidate et
 * queryClient.invalidateQueries({ queryKey: queryKeys.employee.lists() })
 *
 * @example
 * // Belirli bir employee detayını invalidate et
 * queryClient.invalidateQueries({ queryKey: queryKeys.employee.detail('abc-123') })
 */
export const queryKeys = {
  // ============================================================
  // Quiz
  // ============================================================
  quiz: {
    /** Tum quiz query'leri icin root key */
    all: ['quiz'] as const,

    // --- Quiz List ---
    lists: () => [...queryKeys.quiz.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.quiz.lists(), filters] as const,

    // --- Quiz Detail ---
    details: () => [...queryKeys.quiz.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.quiz.details(), id] as const,

    // --- Current (Active Quiz Session) ---
    current: () => [...queryKeys.quiz.all, 'current'] as const,
    currentQuestion: (index: number) => [...queryKeys.quiz.current(), 'question', index] as const,

    // --- Report ---
    report: {
      all: ['quiz', 'report'] as const,
      overview: (quizId: string) => [...queryKeys.quiz.report.all, 'overview', quizId] as const,
      kpi: (quizId: string) => [...queryKeys.quiz.report.all, 'kpi', quizId] as const,
      users: (quizId: string, filters: Record<string, unknown>) => [...queryKeys.quiz.report.all, 'users', quizId, filters] as const,
      userAttempt: (quizId: string, attemptNo: number) => [...queryKeys.quiz.report.all, 'user-attempt', quizId, attemptNo] as const,
      userAttemptDetail: (quizId: string, userId: string, attemptNo: number) => [...queryKeys.quiz.report.all, 'user-attempt-detail', quizId, userId, attemptNo] as const,
      questions: (quizId: string) => [...queryKeys.quiz.report.all, 'questions', quizId] as const,
    },

    // --- Questions (Question Bank) ---
    questions: {
      all: ['quiz', 'questions'] as const,
      lists: () => [...queryKeys.quiz.questions.all, 'list'] as const,
      list: (params: Record<string, unknown>) => [...queryKeys.quiz.questions.lists(), params] as const,
      details: () => [...queryKeys.quiz.questions.all, 'detail'] as const,
      detail: (id: string) => [...queryKeys.quiz.questions.details(), id] as const,
    },

    // --- Assignment ---
    assignments: (quizId: string) => [...queryKeys.quiz.all, 'assignments', quizId] as const,

    // --- Stats ---
    stats: {
      all: ['quiz', 'stats'] as const,
      category: () => [...queryKeys.quiz.stats.all, 'category'] as const,
      difficulty: () => [...queryKeys.quiz.stats.all, 'difficulty'] as const,
      popularity: (filters: Record<string, unknown>) => [...queryKeys.quiz.stats.all, 'popularity', filters] as const,
      reportStat: (filters: Record<string, unknown>) => [...queryKeys.quiz.stats.all, 'report-stat', filters] as const,
    },
  },

  // ============================================================
  // Yeni feature eklerken bu pattern'i takip et:
  // ============================================================
  // featureName: {
  //   all: ['featureName'] as const,
  //   lists: () => [...queryKeys.featureName.all, 'list'] as const,
  //   list: (params: string) => [...queryKeys.featureName.lists(), params] as const,
  //   details: () => [...queryKeys.featureName.all, 'detail'] as const,
  //   detail: (id: string) => [...queryKeys.featureName.details(), id] as const,
  // },
};
