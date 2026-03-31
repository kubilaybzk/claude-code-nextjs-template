import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'


// ── Types ───────────────────────────────────────────────────

interface HoverButtonProps {
  /** Buton ikonu */
  icon: LucideIcon
  /** Buton label'i */
  label: string
  /** Tiklanma callback'i */
  onClick: (e: React.MouseEvent) => void
  /** Buton varyanti — primary (vurgulu) veya default (secondary) */
  variant?: 'default' | 'primary'
}

// ── Component ───────────────────────────────────────────────

/**
 * Kart hover overlay'inde gosterilen aksiyon butonu
 *
 * QuizCard ve ClassCard hover overlay'lerinde kullanilir.
 * Primary variant CTA butonu, default variant ise ikincil aksiyon icin.
 *
 * @example
 * <HoverButton
 *   icon={Play}
 *   label="Devam Et"
 *   variant="primary"
 *   onClick={(e) => { e.stopPropagation(); onContinue?.() }}
 * />
 */
export function HoverButton({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
}: HoverButtonProps) {
  return (
    <Button
      variant={variant === 'primary' ? 'default' : 'outline'}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium shadow-md backdrop-blur-md transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]',
        variant === 'primary'
          ? 'shadow-primary/25'
          : 'border-border/60 bg-card/95 shadow-black/5',
      )}
    >
      <Icon
        data-icon
        className={cn(variant === 'primary' ? 'text-primary-foreground' : 'text-primary')}
      />
      {label}
    </Button>
  )
}
