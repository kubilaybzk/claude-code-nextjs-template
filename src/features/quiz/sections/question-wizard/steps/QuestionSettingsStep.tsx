/**
 * Soru wizard — Kategori, Zorluk ve Ipucu adimi
 *
 * Kategori secimi (checkbox dropdown, max 3), zorluk seviyesi,
 * ve opsiyonel ipucu metni. Tum sabitler @/constants/ altindan gelir.
 *
 * @example
 * <QuestionSettingsStep />
 */
'use client'

import { useFormContext, useWatch } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldError,
} from '@/components/ui/field'
import { CategoryDropdown } from '@/components/shared/CategoryDropdown'
import {
  VALID_DIFFICULTIES,
  DIFFICULTY_LABELS_TR,
  DIFFICULTY_BG_COLORS,
  getDifficultyTextColor,
  getDifficultyLevel,
} from '@/constants/difficulty'
import type { QuestionFormValues } from '@/features/quiz/utils/transforms'
import { QuizIcons } from '@/features/quiz/constants/icons'

// ── Component ─────────────────────────────────────────────

export function QuestionSettingsStep() {
  const { register, setValue, control, formState: { errors } } = useFormContext<QuestionFormValues>()
  const currentDifficulty = useWatch({ control, name: 'difficulty' })
  const watchedCategories = useWatch({ control, name: 'categories' }) ?? []

  const handleCategoryToggle = (categoryId: number) => {
    const current = watchedCategories ?? []
    if (current.includes(categoryId)) {
      setValue('categories', current.filter((c) => c !== categoryId), { shouldValidate: true })
    } else if (current.length < 3) {
      setValue('categories', [...current, categoryId], { shouldValidate: true })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Category, Difficulty, and Hint</h2>
        <p className="text-muted-foreground text-sm">
          Choose the category and difficulty level, and add a hint.
        </p>
      </div>

      {/* ── Kategori Secimi ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuizIcons.wizard.tags data-icon className="text-cyber-quiz" />
            Category Selection
          </CardTitle>
          <CardDescription>Select at least 1 and at most 3 categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <CategoryDropdown
              selectedIds={watchedCategories}
              onToggle={handleCategoryToggle}
              maxSelection={3}
            />

            {errors.categories?.message && <FieldError>{errors.categories.message}</FieldError>}
          </div>
        </CardContent>
      </Card>

      {/* ── Zorluk Seviyesi ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-block size-3 rounded-full',
                  getDifficultyLevel(currentDifficulty).bgColor,
                )}
              />
            Difficulty Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldContent>
              <Select
                value={String(currentDifficulty)}
                onValueChange={(val) =>
                  setValue('difficulty', parseFloat(val), { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {VALID_DIFFICULTIES.map((diff) => {
                    const level = getDifficultyLevel(diff)
                    return (
                      <SelectItem key={diff} value={String(diff)}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              'inline-block size-2 rounded-full',
                              level.bgColor,
                            )}
                          />
                          <span className={getDifficultyTextColor(level)}>
                            {diff} · {DIFFICULTY_LABELS_TR[level.id]}
                          </span>
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <FieldError>{errors.difficulty?.message}</FieldError>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

      {/* ── Ipucu ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuizIcons.solve.hint data-icon className="text-cyber-quiz" />
            Hint
          </CardTitle>
          <CardDescription>
            This text is shown when the user uses a hint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldContent>
              <Textarea
                placeholder="Write a hint that will help solve the question (optional)"
                className="min-h-24"
                {...register('hint')}
              />
              <FieldError>{errors.hint?.message}</FieldError>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>
    </div>
  )
}
