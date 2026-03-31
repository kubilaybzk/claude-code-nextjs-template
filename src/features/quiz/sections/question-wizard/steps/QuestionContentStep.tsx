/**
 * Soru wizard — Soru Bilgileri adimi
 *
 * Soru basligi, aciklama (rich text), dil secimi ve cevap secenekleri.
 * useFormContext ile form state'e erisir.
 *
 * @example
 * <QuestionContentStep />
 */
'use client'

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { RichTextEditor } from '@/components/shared/RichTextEditor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LANGUAGE_LABELS } from '@/constants/languages'
import type { QuestionFormValues } from '@/features/quiz/utils/transforms'
import { QuizIcons } from '@/features/quiz/constants/icons'
import { cn } from '@/lib/utils'

// ── Constants ─────────────────────────────────────────────

/** Secenek harfleri */
const OPTION_LETTERS = 'ABCDEFGHIJ'

// ── Component ─────────────────────────────────────────────

export function QuestionContentStep() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<QuestionFormValues>()
  const currentLang = useWatch({ control, name: 'lang' })
  const descriptionValue = useWatch({ control, name: 'description' })
  const watchedOptions = useWatch({ control, name: 'options' })

  const { fields, append, remove } = useFieldArray({ control, name: 'options' })

  const correctCount = watchedOptions?.filter((o) => o?.is_correct).length ?? 0

  const handleToggleCorrect = (index: number) => {
    const current = watchedOptions?.[index]?.is_correct ?? false

    // Doğru işaretlemeye çalışıyorsa: en fazla N-1 seçenek doğru olabilir
    if (!current) {
      const totalOptions = watchedOptions?.length ?? 0
      if (correctCount >= totalOptions - 1) return
    }

    setValue(`options.${index}.is_correct`, !current, { shouldValidate: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Question Details</h2>
        <p className="text-muted-foreground text-sm">
          Enter the question title, description, and answer options.
        </p>
      </div>

      {/* ── Baslik + Aciklama + Dil ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuizIcons.wizard.content data-icon className="text-cyber-quiz" />
            Question Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Question Title</FieldLabel>
              <FieldContent>
                <Input
                  id="title"
                  placeholder="For example: In the TCP/IP protocol..."
                  aria-invalid={!!errors.title}
                  {...register('title')}
                />
                <FieldError>{errors.title?.message}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldContent>
                <RichTextEditor
                  content={descriptionValue}
                  onChange={(html) => setValue('description', html, { shouldValidate: true })}
                  placeholder="Add extra description, code snippets, or visual content for the question..."
                />
                <FieldDescription>
                  Rich text formatting is supported. You can add code blocks, lists, and headings.
                </FieldDescription>
                <FieldError>{errors.description?.message}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Dil</FieldLabel>
              <FieldContent>
                <Select
                  value={currentLang ?? 'tr'}
                  onValueChange={(val) => setValue('lang', val, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                      <SelectItem key={code} value={code}>
                        {String(label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* ── Cevap Secenekleri ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <QuizIcons.solve.correct data-icon className="text-cyber-quiz" />
              Answer Options
            </span>
            <div className="flex items-center gap-2">
              {correctCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {correctCount} correct
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {fields.length} options
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => {
              const isCorrect = watchedOptions?.[index]?.is_correct ?? false
              const letter = OPTION_LETTERS[index] ?? '?'
              const totalOptions = watchedOptions?.length ?? 0
              const isMarkDisabled = !isCorrect && correctCount >= totalOptions - 1

              return (
                <div
                  key={field.id}
                  className={cn(
                    'group/option flex items-center gap-2 rounded-lg border-2 p-2 transition-all sm:gap-3 sm:p-3',
                    isCorrect
                      ? 'border-chart-2 bg-chart-2/10'
                      : 'border-border bg-card hover:border-border/80',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold',
                      isCorrect
                        ? 'bg-chart-2/20 text-chart-2'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {letter}
                  </span>

                  <Input
                    placeholder={`Option ${letter}`}
                    className="min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                    aria-invalid={!!errors.options?.[index]?.text}
                    {...register(`options.${index}.text`)}
                  />

                  <button
                    type="button"
                    disabled={isMarkDisabled}
                    onClick={() => handleToggleCorrect(index)}
                    className={cn(
                      'flex shrink-0 items-center gap-1 rounded-full p-1.5 text-xs font-semibold transition-all sm:gap-1.5 sm:px-3 sm:py-1.5',
                      isCorrect
                        ? 'bg-chart-2 text-primary-foreground shadow-sm'
                        : 'border-border text-muted-foreground hover:text-foreground border hover:border-chart-2/50',
                      isMarkDisabled && 'pointer-events-none opacity-40',
                    )}
                    aria-label={isCorrect ? 'Marked as correct' : 'Mark as correct'}
                  >
                    {isCorrect ? (
                      <QuizIcons.solve.correct className="size-4" />
                    ) : (
                      <QuizIcons.editor.radioOff className="size-4" />
                    )}
                    <span className="hidden sm:inline">{isCorrect ? 'Correct' : 'Mark'}</span>
                  </button>

                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive shrink-0 opacity-0 transition-opacity group-hover/option:opacity-100"
                      aria-label={`Delete option ${letter}`}
                    >
                      <QuizIcons.action.delete data-icon />
                    </Button>
                  )}
                </div>
              )
            })}

            {errors.options?.message && <FieldError>{errors.options.message}</FieldError>}
            {errors.options?.root?.message && (
              <FieldError>{errors.options.root.message}</FieldError>
            )}

            {fields.length < 10 && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => append({ text: '', is_correct: false })}
              >
                <QuizIcons.action.add data-icon="inline-start" />
                Secenek Ekle ({fields.length}/10)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
