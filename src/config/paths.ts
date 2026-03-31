/**
 * Application route paths — merkezi path yönetimi.
 *
 * Tüm route link'lerini buradan kontrol et.
 */

export const paths = {
  // Public
  home: '/',

  // Auth
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },

  // Dashboard
  dashboard: {
    users: '/users',
    quiz: '/quiz',
    questions: '/questions',
  },

  // Quiz
  quiz: {
    root: '/quiz',
    list: '/quiz',
    form: '/quiz/new',
    create: '/quiz/new',
    detail: (id: string) => `/quiz/${id}`,
    edit: (id: string) => `/quiz/${id}/edit`,
    report: (id: string) => `/quiz/${id}/report`,
    solve: (id: string) => `/quiz/${id}/solve`,
    questions: '/questions',
    questionForm: '/questions/new',
    questionEdit: (id: string) => `/questions/${id}/edit`,
  },

  // Questions
  questions: {
    list: '/questions',
    create: '/questions/new',
    detail: (id: string) => `/questions/${id}`,
    edit: (id: string) => `/questions/${id}/edit`,
    questionEdit: (id: string) => `/questions/${id}/edit`,
  },
} as const
