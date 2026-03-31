/**
 * Filtre sidebar bileşenlerinde (Academy, Quiz vb.) paylaşılan zorluk grupları ve yardımcılar.
 * Tek kaynak — feature içi filterTypes dosyaları buradan re-export eder.
 */
import {
  DIFFICULTY_LEVELS,
  getDifficultyLevel,
} from '@/constants/difficulty'

/** Zorluk grubu tanımı */
export interface DifficultyGroup {
  /** Seviye numarası (1-4) */
  level: number
  /** Grup başlık metni */
  label: string
  /** Renk göstergesi için Tailwind class'ı */
  color: string
}

/** Zorluk seviyesi grup tanımları — merkezi label'lardan türetilir */
export const DIFFICULTY_FILTER_GROUPS: DifficultyGroup[] = [1, 2, 3, 4].map((level) => ({
  level,
  label: `${getDifficultyLevel(level + 0.1).label} (Seviye ${level})`,
  color: getDifficultyLevel(level + 0.1).bgColor,
}))

/**
 * Zorluk seviyesini "1.1 · Başlangıç" formatında döndürür
 */
export function formatDifficultyLabel(difficulty: number): string {
  const level = getDifficultyLevel(difficulty)
  return `${difficulty} · ${level.label}`
}

/**
 * Zorluk seviyesine göre renk göstergesi class'ını döndürür
 */
export function getDifficultyIndicatorColor(difficulty: number): string {
  const level = getDifficultyLevel(difficulty)
  return level.bgColor ?? 'bg-muted-foreground'
}
