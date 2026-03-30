'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { DatePickerFilter } from './DatePickerFilter'
import type { FilterGroup } from './filter-types'

interface DataTableFilterPanelProps {
  /** Filtre grupları konfigürasyonu */
  groups: FilterGroup[]
  /** Mevcut filtre değerleri */
  filterValues: Record<string, string | string[] | undefined>
  /** Filtre değiştiğinde çağrılır */
  onFilterChange: (field: string, value: string | string[] | undefined) => void
}

/** Checkbox filtre satırı */
function CheckboxFilterItem({
  groupField,
  option,
  multipleSelect,
  filterValues,
  onFilterChange,
}: {
  groupField: string
  option: { label: string; value: string }
  multipleSelect: boolean
  filterValues: Record<string, string | string[] | undefined>
  onFilterChange: (field: string, value: string | string[] | undefined) => void
}) {
  const currentValues = Array.isArray(filterValues[groupField])
    ? (filterValues[groupField] as string[])
    : filterValues[groupField]
      ? [filterValues[groupField] as string]
      : []

  const isChecked = currentValues.includes(option.value)

  function handleChange(checked: boolean) {
    if (multipleSelect) {
      const next = checked
        ? [...currentValues, option.value]
        : currentValues.filter((v) => v !== option.value)
      onFilterChange(groupField, next.length > 0 ? next : undefined)
    } else {
      onFilterChange(groupField, checked ? option.value : undefined)
    }
  }

  const id = `filter-checkbox-${groupField}-${option.value}`

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors',
        isChecked
          ? 'bg-primary/8 text-foreground'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
      )}
    >
      <Checkbox
        id={id}
        checked={isChecked}
        onCheckedChange={handleChange}
        className="shrink-0"
      />
      <span className="text-sm font-normal">{option.label}</span>
    </label>
  )
}

/** Input filtre inner — debounce içerir */
function InputFilterItemInner({
  groupField,
  placeholder,
  currentValue,
  onFilterChange,
}: {
  groupField: string
  placeholder: string
  currentValue: string
  onFilterChange: (field: string, value: string | string[] | undefined) => void
}) {
  const [localValue, setLocalValue] = useState(currentValue)
  const debouncedValue = useDebounce(localValue, 300)

  const [prevDebounced, setPrevDebounced] = useState(debouncedValue)
  if (prevDebounced !== debouncedValue) {
    setPrevDebounced(debouncedValue)
    onFilterChange(groupField, debouncedValue || undefined)
  }

  return (
    <Input
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      className="h-8 text-sm"
    />
  )
}

/**
 * DataTable filtre paneli — Popover içinde render edilir.
 *
 * Filtre gruplarını 3 sütunlu grid'de gösterir.
 * Her grup tipi için farklı UI kontrolü render eder:
 * - `checkbox` → Checkbox listesi (multi/single select)
 * - `radio` → RadioGroup
 * - `date` → Popover + Calendar date picker
 * - `input` → Debounced text input
 *
 * @example
 * <DataTableFilterPanel
 *   groups={MY_FILTERS}
 *   filterValues={filters.filterValues}
 *   onFilterChange={filters.setFilter}
 * />
 */
export function DataTableFilterPanel({
  groups,
  filterValues,
  onFilterChange,
}: DataTableFilterPanelProps) {
  if (groups.length === 0) return null

  return (
    <div className={cn(
      'grid gap-5',
      groups.length === 1 && 'grid-cols-1',
      groups.length === 2 && 'grid-cols-1 sm:grid-cols-2',
      groups.length >= 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    )}>
      {groups.map((group, i) => {
        const hasValue = (() => {
          const v = filterValues[group.field]
          if (!v) return false
          if (Array.isArray(v)) return v.length > 0
          return true
        })()

        return (
          <div
            key={group.field}
            className={cn(
              'flex flex-col gap-2',
              // Sütunlar arasına dikey çizgi
              groups.length >= 2 && i < groups.length - 1 && 'sm:border-r sm:border-border sm:pr-5',
            )}
          >
            {/* Grup başlığı */}
            <div className="flex items-center justify-between pb-0.5">
              <h4 className={cn(
                'text-[11px] font-semibold uppercase tracking-widest',
                hasValue ? 'text-primary' : 'text-muted-foreground/70',
              )}>
                {group.title}
              </h4>
              {hasValue && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
            </div>

            {/* Filtre kontrolleri */}
            <div className="flex flex-col gap-0.5">
              {group.type === 'checkbox' && group.options?.map((option) => (
                <CheckboxFilterItem
                  key={option.value}
                  groupField={group.field}
                  option={option}
                  multipleSelect={group.multipleSelect ?? true}
                  filterValues={filterValues}
                  onFilterChange={onFilterChange}
                />
              ))}

              {group.type === 'radio' && (
                <RadioGroup
                  value={(filterValues[group.field] as string | undefined) ?? ''}
                  onValueChange={(val) => {
                    const current = filterValues[group.field] as string | undefined
                    onFilterChange(group.field, current === val ? undefined : val)
                  }}
                  className="gap-0.5"
                >
                  {group.options?.map((option) => {
                    const id = `filter-radio-${group.field}-${option.value}`
                    const isSelected = filterValues[group.field] === option.value
                    return (
                      <label
                        key={option.value}
                        htmlFor={id}
                        className={cn(
                          'flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors',
                          isSelected
                            ? 'bg-primary/8 text-foreground'
                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                        )}
                      >
                        <RadioGroupItem id={id} value={option.value} className="shrink-0" />
                        <span className="text-sm font-normal">{option.label}</span>
                      </label>
                    )
                  })}
                </RadioGroup>
              )}

              {group.type === 'date' && (
                <DatePickerFilter
                  value={filterValues[group.field] as string | undefined}
                  onChange={(val) => onFilterChange(group.field, val)}
                  placeholder={group.placeholder}
                />
              )}

              {group.type === 'input' && (
                <InputFilterItemInner
                  groupField={group.field}
                  placeholder={group.placeholder ?? 'Search...'}
                  currentValue={(filterValues[group.field] as string | undefined) ?? ''}
                  onFilterChange={onFilterChange}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
