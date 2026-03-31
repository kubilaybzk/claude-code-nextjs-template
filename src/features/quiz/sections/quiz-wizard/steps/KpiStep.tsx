/**
 * Quiz wizard — KPI adimi
 *
 * 4 performans metrigi: basari orani, ilk deneme dogruluk,
 * beklenen deneme sayisi, beklenen tamamlama suresi.
 * Her metrik icin enable/disable toggle + deger input'u.
 *
 * @example
 * <KpiStep />
 */
'use client'

import { useFormContext, useWatch } from 'react-hook-form'

import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import type { QuizFormValues } from '@/features/quiz/utils/transforms'
import { QuizIcons } from '@/features/quiz/constants/icons'

// ── KPI Config ────────────────────────────────────────────

const KPI_ITEMS = [
  {
    enabledKey: 'kpiSuccessRateEnabled' as const,
    valueKey: 'kpiSuccessRate' as const,
    label: 'Success Rate Target',
    description: 'The minimum success rate users are expected to achieve.',
    icon: QuizIcons.wizard.kpi,
    suffix: '%',
    min: 0,
    max: 100,
  },
  {
    enabledKey: 'kpiFirstAttemptAccuracyEnabled' as const,
    valueKey: 'kpiFirstAttemptAccuracy' as const,
    label: 'First Attempt Accuracy Target',
    description: 'The expected accuracy on the first attempt.',
    icon: QuizIcons.solve.correct,
    suffix: '%',
    min: 0,
    max: 100,
  },
  {
    enabledKey: 'kpiExpectedAttemptsEnabled' as const,
    valueKey: 'kpiExpectedAttempts' as const,
    label: 'Expected Attempt Count',
    description: 'The expected average number of attempts to complete the quiz.',
    icon: QuizIcons.solve.retry,
    suffix: undefined,
    min: 0,
    max: 100,
  },
  {
    enabledKey: 'kpiExpectedTimeEnabled' as const,
    valueKey: 'kpiExpectedTime' as const,
    label: 'Expected Completion Time',
    description: 'The expected average time to complete the quiz.',
    icon: QuizIcons.meta.duration,
    suffix: 'dk',
    min: 0,
    max: 600,
  },
] as const

// ── Component ─────────────────────────────────────────────

export function KpiStep() {
  const { register, setValue, control } = useFormContext<QuizFormValues>()
  const watchedValues = useWatch({ control })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">KPI Targets</h2>
        <p className="text-sm text-muted-foreground">
          Measure user performance by defining performance metrics.
          Disabled metrics are sent to the API as 0.
        </p>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuizIcons.wizard.kpi data-icon className="text-cyber-quiz" />
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Set a target value for each metric. Inactive metrics are not tracked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            {KPI_ITEMS.map((kpi, idx) => {
              const isEnabled = watchedValues[kpi.enabledKey] as boolean
              const Icon = kpi.icon

              return (
                <div key={kpi.valueKey}>
                  {idx > 0 && <Separator className="my-2" />}
                  <div className="flex flex-col gap-3 rounded-md px-1 py-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          <Icon data-icon className="text-muted-foreground" />
                          {kpi.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {kpi.description}
                        </span>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) => {
                          setValue(kpi.enabledKey, !!checked, { shouldValidate: true })
                          if (!checked) setValue(kpi.valueKey, 0, { shouldValidate: true })
                        }}
                        size="sm"
                      />
                    </div>

                    {isEnabled && (
                      <div className="ml-6">
                        {kpi.suffix ? (
                          <InputGroup>
                            <InputGroupInput
                              type="number"
                              min={kpi.min}
                              max={kpi.max}
                              className="w-32"
                              {...register(kpi.valueKey, { valueAsNumber: true })}
                            />
                            <InputGroupAddon align="inline-end">
                              <InputGroupText>{kpi.suffix}</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        ) : (
                          <Input
                            type="number"
                            min={kpi.min}
                            max={kpi.max}
                            className="w-32"
                            {...register(kpi.valueKey, { valueAsNumber: true })}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
