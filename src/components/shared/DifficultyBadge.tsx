import { Badge } from '@/components/ui/badge'
import { getDifficultyLevel } from '@/constants/difficulty'

interface DifficultyBadgeProps {
  difficulty: number
  locale?: string
  showValue?: boolean
}

/**
 * Zorluk seviyesi badge'i.
 */
export function DifficultyBadge({ difficulty, showValue = false }: DifficultyBadgeProps) {
  const config = getDifficultyLevel(difficulty)

  return (
    <Badge className={`${config.bgColor} ${config.color}`}>
      {showValue ? `${difficulty} · ${config.label}` : config.label}
    </Badge>
  )
}
