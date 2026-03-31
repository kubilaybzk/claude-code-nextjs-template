import { getCategoryConfig } from '@/constants/categories'

interface CategoryIconProps {
  category?: number
  index?: number
  size?: number
  className?: string
}

/**
 * Kategori icon'unu gösterir.
 */
export function CategoryIcon({ category, index, size = 16, className }: CategoryIconProps) {
  const catIndex = category ?? index ?? 0
  const config = getCategoryConfig(catIndex)
  const Icon = config.icon

  return <Icon size={size} className={className} />
}
