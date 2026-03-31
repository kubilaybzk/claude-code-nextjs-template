/**
 * Quiz wizard — Onizleme adimi
 *
 * Tum quiz ayarlarinin ozeti + submit butonu.
 * Submit durumu `useQuizWizard()` ile QuizWizardProvider'dan gelir.
 *
 * @example
 * // Adim bileşeni Provider icinde kullanilir; props gerekmez.
 * <PreviewStep />
 */
'use client'

import { useFormContext, useWatch } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LANGUAGE_LABELS } from '@/constants/languages'
import type { QuizFormValues } from '@/features/quiz/utils/transforms'
import { QuizIcons } from '@/features/quiz/constants/icons'
import { useQuizWizard } from '../QuizWizardContext'

// ── Component ─────────────────────────────────────────────

export function PreviewStep() {
  const { isSubmitting, onFinalSubmit } = useQuizWizard()
  const { control } = useFormContext<QuizFormValues>()
  const values = useWatch({ control })

  const questionCount = values.selectedQuestions?.length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Preview</h2>
        <p className="text-sm text-muted-foreground">Review the quiz settings and create it.</p>
      </div>

      {/* ── Temel Bilgiler ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <QuizIcons.wizard.settings data-icon className="text-cyber-quiz" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <PreviewRow label="Quiz Name" value={values.name || '—'} />
            <PreviewRow
              label="Duration"
              value={`${values.durationHours ?? 0} hour${(values.durationHours ?? 0) === 1 ? '' : 's'} ${values.durationMinutes ?? 0} min`}
              icon={<QuizIcons.meta.duration data-icon className="text-muted-foreground" />}
            />
            <PreviewRow
              label="Language"
              value={LANGUAGE_LABELS[(values.lang ?? 'tr') as keyof typeof LANGUAGE_LABELS]}
              icon={<QuizIcons.meta.globe data-icon className="text-muted-foreground" />}
            />
            <PreviewRow label="Min. Success" value={`%${values.minSuccessRate ?? 50}`} />
            <PreviewRow
              label="Access"
              value={values.isPublic ? 'Public' : 'Private'}
              icon={
                values.isPublic ? (
                  <QuizIcons.wizard.users data-icon className="text-muted-foreground" />
                ) : (
                  <QuizIcons.wizard.lock data-icon className="text-muted-foreground" />
                )
              }
            />
            {values.limitedTime && (
              <>
                <PreviewRow label="Start" value={values.notBefore ? values.notBefore.toLocaleString('en-US') : '—'} />
                <PreviewRow label="End" value={values.expire ? values.expire.toLocaleString('en-US') : '—'} />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Yapilandirma ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <QuizIcons.wizard.configurations data-icon className="text-cyber-quiz" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <PreviewRow label="Navigation" value={values.navigation ? 'Free Navigation' : 'Sequential Progress' } />
            {!values.navigation && values.allowPass && (
              <PreviewRow label="Pass Limit" value={String(values.passLimit ?? 0)} />
            )}
            <PreviewBool label="Correct/Incorrect Feedback" value={values.showQuestionAnswer} />
            <PreviewBool label="Show Result Score" value={values.showResultScore} />
            {values.retakeAllowed && (
              <>
                <PreviewRow
                  label="Retry Limit"
                  value={values.retakeLimit === 0 ? 'Unlimited' : String(values.retakeLimit)}
                  icon={<QuizIcons.solve.retry data-icon className="text-muted-foreground" />}
                />
                <PreviewRow label="Applied Score" value={['First', 'Average', 'Highest', 'Last'][values.scoringAlgorithm ?? 0]} />
              </>
            )}
            <PreviewBool label="Hint" value={values.allowHint} icon={<QuizIcons.solve.hint data-icon className="text-muted-foreground" />} />
            <PreviewBool label="Randomized Questions" value={values.randomizedQuestions} icon={<QuizIcons.wizard.shuffle data-icon className="text-muted-foreground" />} />
          </div>
        </CardContent>
      </Card>

      {/* ── Sorular ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <QuizIcons.wizard.questions data-icon className="text-cyber-quiz" />
            Questions
            <Badge variant="secondary">{questionCount}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <PreviewRow label="Question Count" value={String(questionCount)} />
            <PreviewRow label="Display Mode" value={values.questionDisplayMode === 'random_shuffle' ? 'Random' : 'All'} />
            {values.questionDisplayMode === 'random_shuffle' && (
              <>
                <PreviewRow label="Displayed" value={String(values.displayQuestionCount ?? 0)} />
                <PreviewBool label="Shuffle Answers" value={values.shuffleAnswerOptions} />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── KPI ── */}
      {(values.kpiSuccessRateEnabled || values.kpiFirstAttemptAccuracyEnabled || values.kpiExpectedAttemptsEnabled || values.kpiExpectedTimeEnabled) && (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <QuizIcons.wizard.kpi data-icon className="text-cyber-quiz" />
              KPI Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              {values.kpiSuccessRateEnabled && <PreviewRow label="Success Rate" value={`%${values.kpiSuccessRate ?? 0}`} />}
              {values.kpiFirstAttemptAccuracyEnabled && <PreviewRow label="First Attempt" value={`%${values.kpiFirstAttemptAccuracy ?? 0}`} />}
              {values.kpiExpectedAttemptsEnabled && <PreviewRow label="Attempt Count" value={String(values.kpiExpectedAttempts ?? 0)} />}
              {values.kpiExpectedTimeEnabled && <PreviewRow label="Completion Time" value={`${values.kpiExpectedTime ?? 0} min`} />}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Submit ── */}
      <Separator />
      <div className="flex justify-end">
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={onFinalSubmit}
          className="bg-cyber-quiz text-primary-foreground hover:bg-cyber-quiz/90"
        >
          {isSubmitting ? 'Creating...' : 'Create Quiz'}
        </Button>
      </div>
    </div>
  )
}

// ── Helper Components ───────────────────────────────────────

function PreviewRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function PreviewBool({ label, value, icon }: { label: string; value?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-muted-foreground">{label}:</span>
      {value ? (
        <QuizIcons.solve.correct data-icon className="text-primary" />
      ) : (
        <QuizIcons.solve.wrong data-icon className="text-muted-foreground/50" />
      )}
    </div>
  )
}
