// ============================================================
// Quiz Modülü Sabitleri
//
// Thumbnail yollari, tarih formatlari ve yardimci fonksiyonlar.
// ============================================================

import { QuizIcons } from './icons'

/**
 * Quiz durum gruplari
 *
 * API'ye gonderilen `group` parametresi ve layout tab'larinda kullanilir.
 *
 * @example
 * QuizGroup.Available  // → 0
 * QuizGroup.Completed  // → 4
 */
export enum QuizGroup {
  Available = 0,
  Assigned = 1,
  Upcoming = 2,
  Expired = 3,
  Completed = 4,
}

type IconComponent = React.ComponentType<{ className?: string }>

/** Tab konfigurasyonu icin label-icon-value eslesmesi */
export const QUIZ_GROUP_OPTIONS: readonly { label: string; value: QuizGroup; icon: IconComponent }[] = [
  { label: 'Available', value: QuizGroup.Available, icon: QuizIcons.status.available },
  { label: 'Assigned', value: QuizGroup.Assigned, icon: QuizIcons.status.assigned },
  { label: 'Upcoming', value: QuizGroup.Upcoming, icon: QuizIcons.status.upcoming },
  { label: 'Expired', value: QuizGroup.Expired, icon: QuizIcons.status.expired },
  { label: 'Completed', value: QuizGroup.Completed, icon: QuizIcons.status.completed },
] as const

/** Quiz thumbnail varsayilan dosya yollari */
export const THUMBNAIL_PATHS = {
  NEW: '/ThumbNails/quiz/new-quiz-thumbnail.svg',
  ONGOING: '/ThumbNails/quiz/ongoing-quiz-thumbnail.svg',
  COMPLETED: '/ThumbNails/quiz/completed-quiz-thumbnail.svg',
} as const

/** Tarih gosterim formati (upcoming overlay'de kullanilir) */
export const DATE_DISPLAY_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

/**
 * Baslangic tarihi ve sureye gore bitis zamanini hesaplar
 *
 * @param startDateSeconds - Baslangic timestamp (saniye)
 * @param durationSeconds - Toplam sure (saniye)
 * @returns Bitis zamani (milliseconds timestamp)
 *
 * @example
 * calculateEndTime(1711234567, 3600) // → 1711238167000
 */
export function calculateEndTime(startDateSeconds: number, durationSeconds: number): number {
  return (startDateSeconds + durationSeconds) * 1000
}

// formatDuration → @/features/quiz/utils/quizHelpers dosyasindan import edilmeli

/** Maksimum gosterilecek kategori ikon sayisi */
export const MAX_CATEGORY_ICONS = 3

/** Yeni badge gosterilecek gun sayisi */
export const NEW_BADGE_DAYS = 7
