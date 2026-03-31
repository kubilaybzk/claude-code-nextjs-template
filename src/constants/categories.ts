import type { LucideIcon } from 'lucide-react'
import {
  Calculator,
  Beaker,
  BookOpen,
  PenTool,
  Globe,
  Cpu,
} from 'lucide-react'

/**
 * Kategori konfigürasyonu — Quiz sorularının kategorileri.
 *
 * Her kategori bir index'e sahip ve color/icon/bgColor property'leri var.
 */

export interface CategoryConfig {
  id: number
  name: string
  label: string
  color: string
  bgColor: string
  icon: LucideIcon
  colors: {
    text: string
    bg: string
  }
}

/**
 * Tüm kategoriler — her biri bir index ile temsil edilir.
 *
 * @example
 * CATEGORY_CONFIG.map((_, index) => getCategoryConfig(index))
 */
export const CATEGORY_CONFIG: CategoryConfig[] = [
  { id: 0, name: 'Matematik', label: 'Matematik', color: 'text-primary', bgColor: 'bg-primary/10', icon: Calculator, colors: { text: 'text-primary', bg: 'bg-primary/10' } },
  { id: 1, name: 'Fen', label: 'Fen', color: 'text-chart-2', bgColor: 'bg-chart-2/10', icon: Beaker, colors: { text: 'text-chart-2', bg: 'bg-chart-2/10' } },
  { id: 2, name: 'İngilizce', label: 'İngilizce', color: 'text-chart-3', bgColor: 'bg-chart-3/10', icon: BookOpen, colors: { text: 'text-chart-3', bg: 'bg-chart-3/10' } },
  { id: 3, name: 'Türkçe', label: 'Türkçe', color: 'text-accent', bgColor: 'bg-accent/10', icon: PenTool, colors: { text: 'text-accent', bg: 'bg-accent/10' } },
  { id: 4, name: 'Sosyal Bilgiler', label: 'Sosyal Bilgiler', color: 'text-chart-4', bgColor: 'bg-chart-4/10', icon: Globe, colors: { text: 'text-chart-4', bg: 'bg-chart-4/10' } },
  { id: 5, name: 'Teknoloji', label: 'Teknoloji', color: 'text-chart-5', bgColor: 'bg-chart-5/10', icon: Cpu, colors: { text: 'text-chart-5', bg: 'bg-chart-5/10' } },
]

/**
 * Kategori index'inden kategori konfigürasyonunu alır.
 *
 * @param index - Kategori index'i
 * @returns Kategori konfigürasyonu veya default
 *
 * @example
 * const config = getCategoryConfig(0) // Matematik
 */
export function getCategoryConfig(index: number): CategoryConfig {
  return CATEGORY_CONFIG[index] ?? CATEGORY_CONFIG[0]
}
