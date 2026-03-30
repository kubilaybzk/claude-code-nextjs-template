'use client'

import { format, parseISO, isValid } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerFilterProps {
  /** Mevcut değer — 'YYYY-MM-DD' formatında string veya undefined */
  value: string | undefined
  /** Değer değiştiğinde çağrılır — 'YYYY-MM-DD' formatında string veya undefined */
  onChange: (value: string | undefined) => void
  /** Placeholder metni */
  placeholder?: string
}

/**
 * DataTable filtre paneli için date picker bileşeni.
 *
 * Popover + Calendar kombinasyonuyla tarih seçimi sağlar.
 * Değer URL'de `YYYY-MM-DD` formatında saklanır ve API'ye bu formatta gönderilir.
 * Aynı tarihe tekrar tıklamak seçimi temizler.
 *
 * @example
 * <DatePickerFilter
 *   value={filterValues.created_after as string | undefined}
 *   onChange={(val) => setFilter('created_after', val)}
 *   placeholder="Tarih seçin..."
 * />
 */
export function DatePickerFilter({
  value,
  onChange,
  placeholder = 'Select date...',
}: DatePickerFilterProps) {
  const selectedDate = value && isValid(parseISO(value)) ? parseISO(value) : undefined

  function handleSelect(date: Date | undefined) {
    if (!date) {
      onChange(undefined)
      return
    }
    // Aynı tarih seçilirse temizle (toggle davranışı)
    if (selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) {
      onChange(undefined)
      return
    }
    onChange(format(date, 'yyyy-MM-dd'))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-left font-normal"
        >
          {selectedDate ? (
            <span className="text-foreground">
              {format(selectedDate, 'dd.MM.yyyy', { locale: tr })}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
