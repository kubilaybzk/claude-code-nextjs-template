/**
 * Soru zorluk seviyeleri konfigürasyonu.
 */

export interface DifficultyLevel {
  id: number
  label: string
  color: string
  bgColor: string
}

export const DIFFICULTY_LABELS_TR: Record<number, string> = {
  1: 'Kolay',
  2: 'Orta',
  3: 'Zor',
  4: 'Cok Zor',
}

/**
 * Zorluk seviyelerinin arka plan renkleri.
 */
export const DIFFICULTY_BG_COLORS: Record<string, string> = {
  easy: 'bg-chart-2/10',
  medium: 'bg-chart-3/10',
  hard: 'bg-chart-4/10',
  veryHard: 'bg-chart-5/10',
}

/**
 * Tüm zorluk seviyeleri.
 *
 * @example
 * getDifficultyLevel(1.1) // Kolay
 */
export const DIFFICULTY_LEVELS: Record<string, DifficultyLevel> = {
  '1.1': { id: 1, label: 'Kolay', color: 'text-chart-2', bgColor: 'bg-chart-2/10' },
  '2.1': { id: 2, label: 'Orta', color: 'text-chart-3', bgColor: 'bg-chart-3/10' },
  '3.1': { id: 3, label: 'Zor', color: 'text-chart-4', bgColor: 'bg-chart-4/10' },
  '4.1': { id: 4, label: 'Çok Zor', color: 'text-chart-5', bgColor: 'bg-chart-5/10' },
}

/**
 * Geçerli zorluk seviyeleri array'i.
 *
 * @example
 * VALID_DIFFICULTIES // [1.1, 2.1, 3.1, 4.1]
 */
export const VALID_DIFFICULTIES = Object.keys(DIFFICULTY_LEVELS).map(Number)

/**
 * Zorluk seviyesi ID'sinden konfigürasyonu alır.
 *
 * @param difficulty - Zorluk seviyesi (1.1, 2.1, 3.1, 4.1)
 * @returns Zorluk konfigürasyonu veya default (Kolay)
 *
 * @example
 * const level = getDifficultyLevel(2.1) // Orta
 */
export function getDifficultyLevel(difficulty: number): DifficultyLevel {
  return DIFFICULTY_LEVELS[String(difficulty)] ?? DIFFICULTY_LEVELS['1.1']
}

/**
 * Gets the text color class for a difficulty level.
 *
 * @param level - Zorluk seviyesi konfigürasyonu
 * @returns Tailwind text color class
 *
 * @example
 * const color = getDifficultyTextColor(level) // text-chart-2
 */
export function getDifficultyTextColor(level: DifficultyLevel): string {
  return level.color
}

/**
 * Gets the gradient classes for a difficulty level.
 * Used for bg-gradient-to-br styling.
 *
 * @param difficulty - Zorluk seviyesi (1.1, 2.1, 3.1, 4.1)
 * @returns Tailwind gradient from/to classes
 *
 * @example
 * const gradient = getDifficultyGradient(3.1) // from-chart-4/15 to-chart-4/5
 */
export function getDifficultyGradient(difficulty: number): string {
  const level = getDifficultyLevel(difficulty)

  if (level.id === 1) return 'from-chart-2/15 to-chart-2/5'
  if (level.id === 2) return 'from-chart-3/15 to-chart-3/5'
  if (level.id === 3) return 'from-chart-4/15 to-chart-4/5'

  return 'from-chart-5/15 to-chart-5/5'
}

/**
 * Gets the gradient color for a difficulty level as a CSS variable.
 *
 * @param difficulty - Zorluk seviyesi (1.1, 2.1, 3.1, 4.1)
 * @returns CSS variable reference for the difficulty color
 *
 * @example
 * const color = getDifficultyGradientColor(2.1) // var(--color-chart-3)
 */
export function getDifficultyGradientColor(difficulty: number): string {
  const level = getDifficultyLevel(difficulty)

  if (level.id === 1) return 'var(--color-chart-2)'
  if (level.id === 2) return 'var(--color-chart-3)'
  if (level.id === 3) return 'var(--color-chart-4)'

  return 'var(--color-chart-5)'
}
