// ─────────────────────────────────────────────
// Filter sidebar shared types & constants
//
// Zorluk ve kategori sabitleri @/constants/ altindaki
// merkezi tanimlardan turetilir. Burada sadece filtre
// UI'ina ozgu tipler ve yardimci fonksiyonlar bulunur.
// ─────────────────────────────────────────────

export {
  type DifficultyGroup,
  DIFFICULTY_FILTER_GROUPS  ,
  formatDifficultyLabel,
  getDifficultyIndicatorColor,
} from '@/features/quiz/utils/filterSidebarDifficulty'

/** Filtre degerleri objesi */
export interface QuizFilterValues {
  /** Secili kategori index'leri */
  categories: number[]
  /** Secili zorluk degerleri (1.1, 2.3 vb.) */
  difficulty: number[]
}
