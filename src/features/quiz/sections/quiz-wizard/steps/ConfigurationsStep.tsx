/**
 * Quiz wizard — Yapilandirma adimi
 *
 * Navigation modu, pas hakki, cevap gosterimi, tekrar ayarlari,
 * skorlama, puan gosterimi, ipucu ayarlari.
 *
 * Conditional logic:
 * - navigation:true → pass limit gizli
 * - showQuestionAnswer:true → retake kapali, showResultScore zorla true
 * - retakeAllowed:true → showQuestionAnswer kapali, attempt+scoring gorunur
 *
 * @example
 * <ConfigurationsStep />
 */
'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import type { QuizFormValues } from '@/features/quiz/utils/transforms'
import { QuizIcons } from '@/features/quiz/constants/icons'
import { cn } from '@/lib/utils'

// ── Constants ─────────────────────────────────────────────

/** Navigation secenekleri */
const NAVIGATION_OPTIONS = [
  { value: 'true', label: 'Free Navigation', description: 'Move forward and backward between questions' },
  { value: 'false', label: 'Sequential Progress', description: 'Questions are answered in order' },
] as const

/** Pas hakki secenekleri */
const PASS_LIMIT_OPTIONS = [1, 2, 3, 4, 5] as const

/** Tekrar sayisi secenekleri */
const RETAKE_LIMIT_OPTIONS = [
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 0, label: 'Unlimited' },
] as const

/** Skorlama algoritma secenekleri */
const SCORING_ALGORITHMS = [
  { value: '0', label: 'First Score' },
  { value: '1', label: 'Average Score' },
  { value: '2', label: 'Highest Score' },
  { value: '3', label: 'Last Score' },
] as const

// ── Helpers ───────────────────────────────────────────────

/** Toggle satiri — tutarli gorunum icin yeniden kullanilabilir */
interface ToggleRowProps {
  /** Satir ikonu */
  icon?: React.ReactNode
  /** Baslik */
  label: string
  /** Aciklama metni */
  description: string
  /** Switch durumu */
  checked: boolean
  /** Switch degisim handler'i */
  onCheckedChange: (checked: boolean) => void
  /** Switch devre disi mi */
  disabled?: boolean
}

function ToggleRow({ icon, label, description, checked, onCheckedChange, disabled }: ToggleRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border px-3 py-3 transition-colors',
        checked
          ? 'border-cyber-quiz/30 bg-cyber-quiz/5'
          : 'border-transparent hover:bg-muted/50',
      )}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className={cn(
            'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md',
            checked ? 'bg-cyber-quiz/20 text-cyber-quiz' : 'bg-muted/80 text-muted-foreground',
          )}>
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        size="sm"
      />
    </div>
  )
}

// ── Component ─────────────────────────────────────────────

export function ConfigurationsStep() {
  const { setValue, control, formState: { errors } } = useFormContext<QuizFormValues>()
  const navigation = useWatch({ control, name: 'navigation' })
  const allowPass = useWatch({ control, name: 'allowPass' })
  const passLimit = useWatch({ control, name: 'passLimit' })
  const showQuestionAnswer = useWatch({ control, name: 'showQuestionAnswer' })
  const retakeAllowed = useWatch({ control, name: 'retakeAllowed' })
  const retakeLimit = useWatch({ control, name: 'retakeLimit' })
  const scoringAlgorithm = useWatch({ control, name: 'scoringAlgorithm' })
  const showResultScore = useWatch({ control, name: 'showResultScore' })
  const allowHint = useWatch({ control, name: 'allowHint' })
  const randomizedQuestions = useWatch({ control, name: 'randomizedQuestions' })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Configuration</h2>
        <p className="text-sm text-muted-foreground">Configure quiz behavior and rules.</p>
      </div>

      {/* ── Navigation + Pas Hakki ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuizIcons.wizard.navigation data-icon className="text-cyber-quiz" />
            Question Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Navigation Mode</FieldLabel>
              <FieldContent>
                <Select
                  value={String(navigation)}
                  onValueChange={(val) => {
                    const isFullNav = val === 'true'
                    setValue('navigation', isFullNav, { shouldValidate: true })
                    if (isFullNav) {
                      setValue('allowPass', false, { shouldValidate: true })
                      setValue('passLimit', 0, { shouldValidate: true })
                    } else {
                      setValue('allowPass', true, { shouldValidate: true })
                      setValue('passLimit', 1, { shouldValidate: true })
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NAVIGATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription className="flex items-center gap-1.5">
                  <QuizIcons.meta.info className="size-3.5 shrink-0 text-muted-foreground" />
                  <span>
                    {navigation
                      ? 'Users can move freely between questions.'
                      : 'Users will answer questions in sequence.'}
                  </span>
                </FieldDescription>
              </FieldContent>
            </Field>

            {/* Pas Hakki — sadece Sequential modda */}
            {!navigation && (
              <>
                <Separator />
                <ToggleRow
                  icon={<QuizIcons.wizard.pass className="size-3.5" />}
                  label="Question Pass Limit"
                  description="Users can skip a limited number of questions."
                  checked={allowPass}
                  onCheckedChange={(checked) => {
                    setValue('allowPass', !!checked, { shouldValidate: true })
                    if (!checked) setValue('passLimit', 0, { shouldValidate: true })
                    else setValue('passLimit', 1, { shouldValidate: true })
                  }}
                />

                {allowPass && (
                  <div className="ml-3 border-l-2 border-cyber-quiz/40 pl-4">
                    <Field>
                      <FieldLabel>Pass Count</FieldLabel>
                      <FieldContent>
                        <Select
                          value={String(allowPass ? (passLimit ?? 1) : 0)}
                          onValueChange={(val) => setValue('passLimit', parseInt(val, 10), { shouldValidate: true })}
                        >
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PASS_LIMIT_OPTIONS.map((n) => (
                              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError>{errors.passLimit?.message}</FieldError>
                      </FieldContent>
                    </Field>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Cevap Gosterimi + Tekrar Hakki ── */}
      <Card size="sm">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <QuizIcons.wizard.preview data-icon className="text-cyber-quiz" />
              Answers and Retry
            </CardTitle>
            <Badge variant="outline" className="w-fit text-[10px] text-muted-foreground">
              Only one can be active at a time
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {/* Show Question Answers */}
            <ToggleRow
              icon={<QuizIcons.wizard.preview className="size-3.5" />}
              label="Correct/Incorrect Feedback"
              description="Shows correct/incorrect feedback after each answer."
              checked={showQuestionAnswer}
              disabled={retakeAllowed}
              onCheckedChange={(checked) => {
                setValue('showQuestionAnswer', !!checked, { shouldValidate: true })
                if (checked) {
                  setValue('retakeAllowed', false, { shouldValidate: true })
                  setValue('retakeLimit', 2, { shouldValidate: true })
                  setValue('showResultScore', true, { shouldValidate: true })
                }
              }}
            />

            <Separator />

            {/* Retake */}
            <ToggleRow
              icon={<QuizIcons.solve.retry className="size-3.5" />}
              label={retakeLimit === 0 ? 'Unlimited Retry' : 'Retry Limit'}
              description="Users can take the quiz more than once."
              checked={retakeAllowed}
              disabled={showQuestionAnswer}
              onCheckedChange={(checked) => {
                setValue('retakeAllowed', !!checked, { shouldValidate: true })
                if (checked) {
                  setValue('showQuestionAnswer', false, { shouldValidate: true })
                } else {
                  setValue('retakeLimit', 2, { shouldValidate: true })
                  setValue('scoringAlgorithm', 0, { shouldValidate: true })
                }
              }}
            />

            {retakeAllowed && (
              <div className="ml-3 border-l-2 border-cyber-quiz/40 pl-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Retry Count</FieldLabel>
                    <FieldContent>
                      <Select
                        value={String(retakeLimit)}
                        onValueChange={(val) => {
                          const num = parseInt(val, 10)
                          setValue('retakeLimit', num, { shouldValidate: true })
                          if (num === 0) setValue('scoringAlgorithm', 0, { shouldValidate: true })
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RETAKE_LIMIT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Applied Score</FieldLabel>
                    <FieldContent>
                      <Select
                        value={String(scoringAlgorithm)}
                        onValueChange={(val) => setValue('scoringAlgorithm', parseInt(val, 10), { shouldValidate: true })}
                        disabled={retakeLimit === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SCORING_ALGORITHMS.map((alg) => (
                            <SelectItem key={alg.value} value={alg.value}>{alg.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Skor, Ipucu ve Karistirma ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuizIcons.solve.trophy data-icon className="text-cyber-quiz" />
            Score and Assistance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <ToggleRow
              icon={<QuizIcons.solve.trophy className="size-3.5" />}
              label="Show Result"
              description="Show the total score at the end."
              checked={showResultScore}
              disabled={showQuestionAnswer}
              onCheckedChange={(checked) => {
                if (showQuestionAnswer) {
                  toast.error('Result display cannot be disabled while correct/incorrect feedback is enabled.')
                  return
                }
                setValue('showResultScore', !!checked, { shouldValidate: true })
              }}
            />

            <ToggleRow
              icon={<QuizIcons.solve.hint className="size-3.5" />}
              label="Enable Hint"
              description="Users can use hints."
              checked={allowHint}
              onCheckedChange={(checked) => setValue('allowHint', !!checked, { shouldValidate: true })}
            />

            <ToggleRow
              icon={<QuizIcons.wizard.shuffle className="size-3.5" />}
              label="Randomize Questions"
              description="Shuffle the question order."
              checked={randomizedQuestions}
              onCheckedChange={(checked) => setValue('randomizedQuestions', !!checked, { shouldValidate: true })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
