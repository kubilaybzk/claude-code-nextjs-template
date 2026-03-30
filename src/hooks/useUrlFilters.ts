'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

/**
 * URL-based filtre yonetimi hook'u
 *
 * URL search parametrelerini okur ve gunceller.
 * Sayfa parametresi guncellenmediginde otomatik olarak 1'e resetlenir.
 *
 * @returns searchParams ve updateFilters fonksiyonu
 *
 * @example
 * const { searchParams, updateFilters } = useUrlFilters()
 *
 * // Tek filtre guncelle
 * updateFilters({ search: 'test' })
 *
 * // Birden fazla filtre guncelle
 * updateFilters({ difficulty: [1.1, 2.1], categories: [0, 2] })
 *
 * // Filtre temizle
 * updateFilters({ search: undefined })
 *
 * // Sayfa degistir (page reset yapilmaz)
 * updateFilters({ page: 3 })
 */
export function useUrlFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilters = useCallback(
    (updates: Record<string, unknown>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key)
        if (value === undefined || value === null || value === '') return

        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)))
        } else {
          params.set(key, String(value))
        }
      })

      const hasPageKey = Object.keys(updates).some(
        (k) => k === 'page' || k.endsWith('_page'),
      )
      if (!hasPageKey) {
        params.set('page', '1')
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  return { searchParams, updateFilters }
}
