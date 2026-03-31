/**
 * Quiz yardımcı fonksiyonları
 *
 * Süre formatlama, kalan süre hesaplama ve scoring algorithm label'ları.
 */

/** Scoring algoritması label'ları */
const SCORING_LABELS: Record<number, string> = {
  0: 'First Score',
  1: 'Average Score',
  2: 'Best Score',
  3: 'Last Score',
}

/**
 * Saniyeyi HH:MM:SS formatına çevirir
 *
 * @param seconds - Saniye cinsinden süre
 * @returns Formatlanmış süre string'i
 *
 * @example
 * formatDuration(3661) // → '01:01:01'
 * formatDuration(120)  // → '00:02:00'
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

/**
 * Saniyeyi dakika cinsinden gösterir
 *
 * @param seconds - Saniye
 * @returns Dakika string'i (örn: "5 min")
 *
 * @example
 * formatDurationMinutes(300) // → '5 min'
 */
export function formatDurationMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  return `${minutes} min`
}

/**
 * Quiz başlangıç ve süresine göre kalan süreyi hesaplar
 *
 * @param startDateSeconds - Başlangıç timestamp (saniye)
 * @param durationSeconds - Toplam süre (saniye)
 * @returns Kalan saniye (0'dan küçükse 0)
 *
 * @example
 * calculateRemainingTime(1711234567, 3600)
 */
export function calculateRemainingTime(startDateSeconds: number, durationSeconds: number): number {
  const now = Math.floor(Date.now() / 1000)
  const endTime = startDateSeconds + durationSeconds
  return Math.max(0, endTime - now)
}

/**
 * Scoring algoritması numarasından label döndürür
 *
 * @param algorithm - Algoritma numarası (0-3)
 * @returns Label string'i
 *
 * @example
 * getScoringLabel(2) // → 'Best Score'
 */
export function getScoringLabel(algorithm: number): string {
  return SCORING_LABELS[algorithm] ?? 'Unknown'
}

/**
 * Unix timestamp'i (saniye) okunabilir tarih formatına çevirir
 *
 * @param timestamp - Unix timestamp (saniye)
 * @returns Formatlanmış tarih string'i
 *
 * @example
 * formatTimestamp(1711234567) // → 'Mar 23, 2024'
 */
export function formatTimestamp(timestamp: number): string {
  if (!timestamp) return '-'
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Quiz'in devam edip etmediğini kontrol eder
 *
 * @param startDate - Başlangıç timestamp (saniye)
 * @param duration - Süre (saniye)
 * @returns Süre dolmamışsa true
 *
 * @example
 * isQuizOngoing(1711234567, 3600) // → true/false
 */
export function isQuizOngoing(startDate: number, duration: number): boolean {
  if (!startDate || !duration) return false
  return calculateRemainingTime(startDate, duration) > 0
}

// ─────────────────────────────────────────────
// Kart Durum Yardimcilari
// ─────────────────────────────────────────────

/** Quiz kart durum tipleri */
export type CardStatus = 'ongoing' | 'completed' | 'expired' | 'upcoming' | 'available'

/** QuizCard'da kullanilan quiz verisi tipi */
interface QuizStatusData {
  /** Devam eden quiz mi */
  is_current?: boolean
  /** Tekrar hakki limiti (0 = sinirsiz) */
  retake_limit?: number
  /** Kullanilan tekrar hakki */
  retake_count?: number
  /** Bitis tarihi (ms timestamp) */
  expires: number
  /** Baslangic kisitlamasi (ms timestamp) */
  not_before: number
}

/**
 * Quiz'in mevcut durumunu belirler
 *
 * @param quiz - Quiz verisi
 * @returns Durum string'i
 *
 * @example
 * getCardStatus(quiz) // → 'available'
 */
export function getCardStatus(quiz: QuizStatusData): CardStatus {
  const now = Date.now()
  if (quiz.is_current) return 'ongoing'

  const retakeLimit = quiz.retake_limit ?? 0
  const retakeCount = quiz.retake_count ?? 0
  if (retakeLimit > 0 && retakeCount >= retakeLimit) return 'completed'
  if (quiz.expires > 0 && quiz.expires < now) return 'expired'
  if (quiz.not_before > 0 && quiz.not_before > now) return 'upcoming'
  return 'available'
}

/**
 * Quiz'in yeni olup olmadigini kontrol eder
 *
 * @param createdAt - Olusturma tarihi (ms timestamp)
 * @param days - Yeni sayilacak gun sayisi
 * @returns Yeni ise true
 *
 * @example
 * isNewQuiz(Date.now() - 86400000) // → true (1 gun once)
 */
export function isNewQuiz(createdAt?: number, days = 7): boolean {
  if (!createdAt) return false
  return createdAt > Date.now() - days * 86400000
}
