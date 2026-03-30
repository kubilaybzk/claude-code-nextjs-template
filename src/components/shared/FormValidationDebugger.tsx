'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BugIcon, ChevronDownIcon, ChevronUpIcon, PlayIcon, DeleteIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDebugMode, DEBUG_STORAGE_KEY } from '@/hooks/useDebugMode'

import type { FieldErrors, UseFormReturn } from 'react-hook-form'

// --- Props type ---
interface FormValidationDebuggerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: UseFormReturn<any>
  showFormValues?: boolean
  label?: string
}

/**
 * Form Validation Debugger
 *
 * Development modunda form state'ini, hataları ve field değerlerini görselleştirir.
 * Production'da varsayılan olarak gizlidir.
 *
 * Kullanım:
 *   <FormValidationDebugger methods={methods} />
 *   <FormValidationDebugger methods={methods} showFormValues={false} />
 *   <FormValidationDebugger methods={methods} label="Kullanıcı Formu" />
 *
 * Debug açma yöntemleri:
 *   1. Development modunda otomatik açık
 *   2. localStorage.setItem('APP_DEBUG_FORMS', 'true')
 *   3. URL'e ?debug=forms ekleyerek
 *   4. Klavye kısayolu: Ctrl+Shift+D (3 kez üst üste)
 */
export function FormValidationDebugger({
  methods,
  showFormValues = true,
  label = 'Form',
}: FormValidationDebuggerProps) {
  const isDebugMode = useDebugMode()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isValuesExpanded, setIsValuesExpanded] = useState(false)

  const { formState, getValues, trigger, reset } = methods
  const { isValid, errors, isDirty, isSubmitting, isSubmitted, touchedFields, dirtyFields } =
    formState

  // Debug modu kapalıysa render etme
  if (!isDebugMode) return null

  const formValues = getValues()
  const formFields = extractFields(formValues)
  const errorCount = countErrors(errors)
  const touchedCount = Object.keys(flattenObject(touchedFields)).length
  const dirtyCount = Object.keys(flattenObject(dirtyFields)).length

  return (
    <div className="mt-6 rounded-lg border-2 border-accent/40 bg-accent/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-sm font-semibold text-accent-foreground hover:bg-accent/20"
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <BugIcon data-icon="inline-start" />
          {label} Debugger
          {isCollapsed ? (
            <ChevronDownIcon data-icon="inline-end" />
          ) : (
            <ChevronUpIcon data-icon="inline-end" />
          )}
        </Button>

        <div className="flex items-center gap-2">
          {/* Status badges */}
          <Badge variant={isValid ? 'default' : 'destructive'} className="text-xs">
            {isValid ? 'Valid' : `${errorCount} Error`}
          </Badge>
          {isDirty && (
            <Badge variant="secondary" className="text-xs">
              Dirty ({dirtyCount})
            </Badge>
          )}
          {isSubmitting && (
            <Badge variant="outline" className="text-xs animate-pulse">
              Submitting...
            </Badge>
          )}

          {/* Env badge */}
          <Badge variant="outline" className="text-xs text-accent-foreground">
            {process.env.NODE_ENV === 'development' ? 'DEV' : 'DEBUG'}
          </Badge>
        </div>
      </div>

      {/* Collapsed ise sadece header göster */}
      {isCollapsed ? null : (
        <div className="flex flex-col gap-3 px-4 pb-4">
          <Separator className="bg-accent/40" />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              className="h-7 text-xs"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => {
                // eslint-disable-next-line no-console
                console.group(`🔍 ${label} Debug`)
                // eslint-disable-next-line no-console
                console.log('Form State:', formState)
                // eslint-disable-next-line no-console
                console.log('Values:', formValues)
                // eslint-disable-next-line no-console
                console.log('Errors:', errors)
                // eslint-disable-next-line no-console
                console.groupEnd()
              }}
            >
              Console Log
            </Button>
            <Button
              className="h-7 text-xs"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => trigger()}
            >
              <PlayIcon data-icon="inline-start" />
              Validate All
            </Button>
            <Button
              className="h-7 text-xs"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => reset()}
            >
              <DeleteIcon data-icon="inline-start" />
              Reset Form
            </Button>
            <Button
              className="ml-auto h-7 text-xs text-destructive"
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => {
                localStorage.removeItem(DEBUG_STORAGE_KEY)
                window.location.reload()
              }}
            >
              <XIcon data-icon="inline-start" />
              Debug Kapat
            </Button>
          </div>

          {/* Form meta info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Fields: {formFields.length}</span>
            <span>Touched: {touchedCount}</span>
            <span>Dirty: {dirtyCount}</span>
            <span>Submitted: {isSubmitted ? 'Yes' : 'No'}</span>
          </div>

          {/* Field list */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-muted-foreground">
              Fields ({formFields.length}):
            </p>
            <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto rounded-md bg-card p-2">
              {formFields.map((fieldName) => {
                const fieldError = getNestedError(errors, fieldName)
                const fieldValue = getNestedValue(formValues, fieldName)
                const hasError = fieldError !== null

                return (
                  <div
                    key={fieldName}
                    className={cn(
                      'flex items-center gap-2 rounded px-2 py-1 text-xs',
                      hasError && 'bg-destructive/10',
                    )}
                  >
                    {/* Status dot */}
                    <span
                      className={cn(
                        'size-2 shrink-0 rounded-full',
                        hasError ? 'bg-destructive' : 'bg-chart-2',
                      )}
                    />

                    {/* Field name */}
                    <span className="min-w-[140px] font-mono font-medium">{fieldName}</span>

                    {/* Error or valid */}
                    <span className={cn('flex-1', hasError ? 'text-destructive' : 'text-chart-2')}>
                      {hasError ? fieldError?.message || 'Invalid' : 'OK'}
                    </span>

                    {/* Value */}
                    {showFormValues && (
                      <span className="ml-auto max-w-[200px] truncate font-mono text-muted-foreground">
                        {formatFieldValue(fieldValue)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Full form values (collapsible) */}
          {showFormValues && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs font-semibold text-muted-foreground"
                type="button"
                onClick={() => setIsValuesExpanded((prev) => !prev)}
              >
                Form Values (JSON)
                {isValuesExpanded ? (
                  <ChevronUpIcon data-icon="inline-end" />
                ) : (
                  <ChevronDownIcon data-icon="inline-end" />
                )}
              </Button>
              {isValuesExpanded && (
                <pre className="mt-1 max-h-48 overflow-auto rounded-md bg-card p-3 font-mono text-xs">
                  {JSON.stringify(formValues, null, 2)}
                </pre>
              )}
            </div>
          )}

          {/* Debug mode help */}
          <div className="rounded bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-semibold">Kısayollar: </span>
            {'Ctrl+Shift+D (3x) toggle · '}
            {`localStorage: ${DEBUG_STORAGE_KEY} · `}
            {'URL: ?debug=forms'}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Helper functions
// ============================================================

/** Form values objesinden tüm field path'lerini çıkarır */
function extractFields(obj: Record<string, unknown>, prefix = ''): string[] {
  const fields: string[] = []

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    const fieldPath = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      fields.push(...extractFields(value as Record<string, unknown>, fieldPath))
    } else {
      fields.push(fieldPath)
    }
  }

  return fields
}

/** Nested error objesinden belirli bir field'ın hatasını alır */
function getNestedError(
  errors: FieldErrors,
  fieldPath: string,
): { message?: string } | null {
  const parts = fieldPath.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = errors

  for (const part of parts) {
    if (current?.[part]) {
      current = current[part]
    } else {
      return null
    }
  }

  return current
}

/** Nested objedeki bir field'ın değerini alır */
function getNestedValue(obj: Record<string, unknown>, fieldPath: string): unknown {
  const parts = fieldPath.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj

  for (const part of parts) {
    if (current?.[part] !== undefined) {
      current = current[part]
    } else {
      return undefined
    }
  }

  return current
}

/** Nested objeyi düz key-value'ya çevirir */
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    const fieldPath = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fieldPath))
    } else {
      result[fieldPath] = value
    }
  }

  return result
}

/** Hata sayısını hesaplar (nested dahil) */
function countErrors(errors: FieldErrors): number {
  let count = 0

  for (const key in errors) {
    if (!Object.prototype.hasOwnProperty.call(errors, key)) continue

    const error = errors[key]

    if (error?.message) {
      count += 1
    } else if (error && typeof error === 'object') {
      count += countErrors(error as FieldErrors)
    }
  }

  return count
}

/** Field değerini görüntülenebilir formata çevirir */
function formatFieldValue(value: unknown): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (value === '') return '""'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (Array.isArray(value)) return `[${value.length} items]`
  if (typeof value === 'object') return JSON.stringify(value).slice(0, 50)
  return String(value)
}
