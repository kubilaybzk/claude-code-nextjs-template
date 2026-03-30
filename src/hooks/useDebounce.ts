import { useEffect, useState } from "react"

/**
 * Değeri belirtilen süre kadar geciktirir.
 * Text search/filter input'larında API çağrısını optimize etmek için kullanılır.
 *
 * @param value - Geciktirilecek değer
 * @param delay - Gecikme süresi (ms)
 * @returns Geciktirilmiş değer
 *
 * @example
 * const [search, setSearch] = useState("")
 * const debouncedSearch = useDebounce(search, 300)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
