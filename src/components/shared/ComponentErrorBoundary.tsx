'use client'

import { Component } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShieldAlertIcon, RefreshCwIcon, TerminalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// --- Props & State types ---
interface ComponentErrorBoundaryProps {
  /** Sarılacak child component'ler */
  children: React.ReactNode
  /** Hata durumunda gösterilecek custom fallback (opsiyonel) */
  fallback?: React.ReactNode
  /** Hata loglamak için callback */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Ek CSS class'ları */
  className?: string
  /** Compact mod — küçük alanda gösterim için */
  compact?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Component seviyesi Error Boundary
 *
 * Bir component hata verdiğinde (render crash, undefined property access,
 * yanlış formatta veri vs.) SADECE o component'i error state'e düşürür.
 * Sayfanın geri kalanı etkilenmez.
 *
 * @example
 * // Temel kullanım — riskli component'i sar
 * <ComponentErrorBoundary>
 *   <UserProfile userId={userId} />
 * </ComponentErrorBoundary>
 *
 * @example
 * // Custom fallback ile
 * <ComponentErrorBoundary fallback={<p>Profil yüklenemedi</p>}>
 *   <UserProfile userId={userId} />
 * </ComponentErrorBoundary>
 *
 * @example
 * // Compact mod (sidebar, card içi gibi dar alanlar)
 * <ComponentErrorBoundary compact>
 *   <MiniChart data={data} />
 * </ComponentErrorBoundary>
 *
 * @example
 * // Error logging ile
 * <ComponentErrorBoundary onError={(err) => logToSentry(err)}>
 *   <PaymentSummary />
 * </ComponentErrorBoundary>
 */
export class ComponentErrorBoundary extends Component<
  ComponentErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ComponentErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo)

    if (process.env.NODE_ENV === 'development') {
      console.error('[ComponentErrorBoundary]', error, errorInfo)
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback varsa onu göster
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Compact mod — dar alanlar (card, sidebar, tablo hücresi)
      if (this.props.compact) {
        return (
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2',
              this.props.className,
            )}
          >
            <div className="flex size-5 shrink-0 items-center justify-center rounded bg-destructive/10">
              <ShieldAlertIcon className="size-3 text-destructive" />
            </div>
            <span className="font-mono text-xs text-destructive">FAULT</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-auto gap-1 px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
              type="button"
              onClick={this.handleReset}
            >
              <RefreshCwIcon className="size-3" />
              Yeniden
            </Button>
          </div>
        )
      }

      // Varsayılan fallback — terminal/cyber estetik
      return (
        <div
          className={cn(
            'cyber-panel overflow-hidden border-destructive/20',
            this.props.className,
          )}
        >
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 border-b border-border/50 bg-muted/50 px-4 py-2">
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-destructive/70" />
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              <span className="size-2 rounded-full bg-muted-foreground/30" />
            </div>
            <Separator orientation="vertical" className="mx-1 h-3" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              error_boundary
            </span>
            <Badge variant="destructive" className="ml-auto">
              CRASH
            </Badge>
          </div>

          {/* Error content */}
          <div className="flex flex-col items-center gap-4 px-6 py-8">
            {/* Icon with subtle glow ring */}
            <div className="relative flex size-14 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5">
              <ShieldAlertIcon className="size-7 text-destructive" />
              <div className="absolute -inset-px rounded-xl opacity-50 blur-sm shadow-[0_0_16px_hsl(var(--destructive)/0.2)]" />
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-sm font-semibold text-foreground">
                Bu bölüm yüklenemedi
              </p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Beklenmeyen bir hata oluştu. Bileşen izole edildi, sayfa çalışmaya devam ediyor.
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="border-destructive/30 hover:border-destructive/50 hover:bg-destructive/5"
              onClick={this.handleReset}
            >
              <RefreshCwIcon data-icon="inline-start" />
              Tekrar Dene
            </Button>
          </div>

          {/* Dev-only error detail — terminal style */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="border-t border-border/50 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <TerminalIcon className="size-3 text-muted-foreground" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  stack trace
                </span>
              </div>
              <pre className="mt-2 max-h-28 overflow-auto font-mono text-[11px] leading-relaxed text-destructive/80">
                {this.state.error.message}
              </pre>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
