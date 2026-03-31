/**
 * Quiz wizard — Ayarlar adimi
 *
 * Quiz adi, sure, dil, tip, thumbnail, public/private, zaman ayarlari.
 * Conditional logic: Private secilince limitedTime kapanir.
 *
 * @example
 * // WizardProvider icinde kullanilir (useFormContext ile erisir)
 * <SettingsStep />
 */
'use client'

import { useCallback, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { LANGUAGE_LABELS } from '@/constants/languages'
import type { QuizFormValues } from '@/features/quiz/utils/transforms'
import { QuizIcons } from '@/features/quiz/constants/icons'
import { cn } from '@/lib/utils'

// ── Constants ─────────────────────────────────────────────

// ── Helpers ───────────────────────────────────────────────

/** Date nesnesini datetime-local input formatina cevirir */
function toDatetimeLocal(date: Date | undefined): string {
  if (!date) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// ── Component ─────────────────────────────────────────────

export function SettingsStep() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<QuizFormValues>()
  const currentLang = useWatch({ control, name: 'lang' })
  const isPublic = useWatch({ control, name: 'isPublic' })
  const limitedTime = useWatch({ control, name: 'limitedTime' })
  const notBefore = useWatch({ control, name: 'notBefore' })
  const expire = useWatch({ control, name: 'expire' })
  const currentImage = useWatch({ control, name: 'image' })
  const minSuccessRate = useWatch({ control, name: 'minSuccessRate' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Dosya seçim handler'ı.
   * SVG dosyalarını yükler ve data URL'ye dönüştürür.
   * Dosya tipi ve boyutu validasyonu yapılır.
   */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Dosya tipi validasyonu - sadece SVG
      if (file.type !== 'image/svg+xml') {
        toast.error('Only SVG files are supported')
        return
      }

      // Dosya boyutu validasyonu - max 5MB
      const MAX_SIZE = 5 * 1024 * 1024
      if (file.size > MAX_SIZE) {
        toast.error('File size must be less than 5MB')
        return
      }

      const reader = new FileReader()

      // Başarılı okuma
      reader.onloadend = () => {
        setValue('image', reader.result as string, { shouldValidate: true })
      }

      // Hata durumu
      reader.onerror = () => {
        toast.error('Failed to read file. Please try again.')
      }

      // İptal durumu
      reader.onabort = () => {
        toast.error('File reading was aborted')
      }

      reader.readAsDataURL(file)
    },
    [setValue],
  )

  const handleRemoveImage = useCallback(() => {
    setValue('image', '', { shouldValidate: true })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [setValue])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-muted-foreground text-sm">Configure the basic details of the quiz.</p>
      </div>

      {/* ── Temel Bilgiler ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuizIcons.wizard.dashboard data-icon className="text-cyber-quiz" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="quiz-name">Quiz Name</FieldLabel>
              <FieldContent>
                <Input
                  id="quiz-name"
                  placeholder="For example: Network Fundamentals Exam"
                  aria-invalid={!!errors.name}
                  {...register('name')}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="quiz-duration-hours">Duration (hours)</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      id="quiz-duration-hours"
                      type="number"
                      min={0}
                      aria-invalid={!!errors.durationHours}
                      {...register('durationHours', { valueAsNumber: true })}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>
                        <QuizIcons.meta.duration data-icon />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError>{errors.durationHours?.message}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="quiz-duration-minutes">Duration (min)</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      id="quiz-duration-minutes"
                      type="number"
                      min={0}
                      max={59}
                      aria-invalid={!!errors.durationMinutes}
                      {...register('durationMinutes', { valueAsNumber: true })}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>
                        <QuizIcons.meta.duration data-icon />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError>{errors.durationMinutes?.message}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Dil</FieldLabel>
                <FieldContent>
                  <Select
                    value={currentLang}
                    onValueChange={(val) => setValue('lang', val, { shouldValidate: true })}
                  >
                    <SelectTrigger className="w-full">
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
            </div>

            {/* Minimum Basari Orani */}
            <Field>
              <FieldLabel>Minimum Success Rate</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[minSuccessRate ?? 50]}
                    onValueChange={([val]) =>
                      setValue('minSuccessRate', val, { shouldValidate: true })
                    }
                    min={0}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-primary w-12 text-right font-mono text-sm font-semibold">
                    %{minSuccessRate ?? 50}
                  </span>
                </div>
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* ── Public / Private + Zaman ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isPublic ? (
              <QuizIcons.wizard.users data-icon className="text-cyber-quiz" />
            ) : (
              <QuizIcons.wizard.lock data-icon className="text-cyber-quiz" />
            )}
            Access and Timing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Public/Private Toggle */}
            <div className="flex items-center justify-between rounded-md px-1 py-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {isPublic ? 'Public Access' : 'Private Access'}
                </span>
                <span className="text-muted-foreground text-xs">
                  {isPublic
                    ? 'All users can access this quiz.'
                    : 'Only assigned users can access this quiz.'}
                </span>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    // Private secilince limitedTime kapanir
                    setValue('isPublic', false, { shouldValidate: true })
                    setValue('limitedTime', false, { shouldValidate: true })
                  } else {
                    setValue('isPublic', true, { shouldValidate: true })
                  }
                }}
                size="sm"
              />
            </div>

            {/* Limited Time — sadece Public iken gorunur */}
            {isPublic && (
              <>
                <Separator />
                <div className="flex items-center justify-between rounded-md px-1 py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Timed Quiz</span>
                    <span className="text-muted-foreground text-xs">
                      Set a start and end date for the quiz.
                    </span>
                  </div>
                  <Switch
                    checked={limitedTime}
                    onCheckedChange={(checked) =>
                      setValue('limitedTime', !!checked, { shouldValidate: true })
                    }
                    size="sm"
                  />
                </div>

                {limitedTime && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="not-before">
                        <QuizIcons.wizard.calendar data-icon className="text-muted-foreground" />
                        Start Date
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="not-before"
                          type="datetime-local"
                          value={toDatetimeLocal(notBefore)}
                          onChange={(e) => {
                            const val = e.target.value
                            setValue('notBefore', val ? new Date(val) : undefined, {
                              shouldValidate: true,
                            })
                          }}
                        />
                        <FieldError>{errors.notBefore?.message}</FieldError>
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="expire">
                        <QuizIcons.wizard.calendar data-icon className="text-muted-foreground" />
                        End Date
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="expire"
                          type="datetime-local"
                          value={toDatetimeLocal(expire)}
                          onChange={(e) => {
                            const val = e.target.value
                            setValue('expire', val ? new Date(val) : undefined, {
                              shouldValidate: true,
                            })
                          }}
                        />
                        <FieldError>{errors.expire?.message}</FieldError>
                      </FieldContent>
                    </Field>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Kapak Gorseli ── */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuizIcons.wizard.image data-icon className="text-cyber-quiz" />
            Kapak Gorseli
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Kapak gorseli sec"
          />

          {currentImage ? (
            <div className="border-border relative overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt="Quiz cover image"
                className="aspect-video w-full object-cover"
              />
              <div className="bg-background/60 absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity hover:opacity-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Degistir
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={handleRemoveImage}>
                  <QuizIcons.action.delete data-icon="inline-start" />
                  Kaldir
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-border flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                'hover:border-primary/40 hover:bg-primary/5',
              )}
            >
              <QuizIcons.action.upload className="text-muted-foreground/50 size-8" />
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-sm font-medium">Gorsel Yukle</span>
                <span className="text-muted-foreground/70 text-xs">Sadece SVG formati kabul edilir.kal</span>
              </div>
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
