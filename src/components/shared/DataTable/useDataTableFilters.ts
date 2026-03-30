'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { useDebounce } from '@/hooks/useDebounce'
import type { DataTableSortingState } from './types'
import type { FilterGroup, ActiveFilter } from './filter-types'

/** useDataTableFilters konfigürasyon seçenekleri */
export interface UseDataTableFiltersOptions {
  /** Varsayılan sıralama durumu */
  defaultSort?: DataTableSortingState
  /** Varsayılan sayfa boyutu — default: 10 */
  defaultLimit?: number
  /**
   * Arama parametresinin hem URL'deki hem de API'ye gönderilecek key adı.
   * URL'de ve backend sorgusunda aynı key kullanılır.
   * @default 'search'
   * @example 'username', 'name', 'query'
   */
  searchField?: string
  /**
   * Arama input'u için placeholder metni
   * @default 'Ara...'
   */
  searchPlaceholder?: string
  /**
   * Her DataTable instance için zorunlu URL namespace.
   * Tüm URL key'leri `${prefix}_${key}` formatında olur — aynı sayfadaki tablolar birbirini ezmez.
   * @example 'tenant' → tenant_page, tenant_search, tenant_limit
   * @example 'machine' → machine_page, machine_search, machine_limit
   */
  prefix: string
}

/** useDataTableFilters hook dönüş tipi */
export interface UseDataTableFiltersReturn {
  // ── Filtre ──────────────────────────────────────────────
  /** Mevcut filtre değerleri — API query'ye doğrudan spread edilebilir */
  filterValues: Record<string, string | string[] | undefined>
  /** Chip olarak gösterilen aktif filtreler */
  activeFilters: ActiveFilter[]
  /** Aktif filtre sayısı (buton badge için) */
  activeFilterCount: number
  /** Bir filtrenin değerini günceller — sayfa otomatik 1'e döner */
  setFilter: (field: string, value: string | string[] | undefined) => void
  /**
   * Aktif filtreyi kaldırır
   * @param field - Kaldırılacak filtre field adı
   * @param value - Multi-select'te sadece bu değeri kaldırır; verilmezse tüm grubu temizler
   */
  removeFilter: (field: string, value?: string) => void
  /** Tüm filtreleri temizler — sayfa 1'e döner */
  clearAllFilters: () => void

  // ── Arama ───────────────────────────────────────────────
  /** Arama input'unun anlık değeri */
  search: string
  /** Arama değerini günceller */
  setSearch: (value: string) => void
  /** 300ms debounce uygulanmış arama değeri — API query'de kullan */
  debouncedSearch: string
  /** API'ye gönderilecek arama key'i */
  searchField: string
  /** Arama input placeholder */
  searchPlaceholder: string

  // ── Sayfalama ────────────────────────────────────────────
  /** Mevcut sayfa (1-tabanlı) */
  page: number
  /** Sayfa boyutu */
  limit: number
  /** Sayfayı değiştirir */
  setPage: (page: number) => void
  /** Sayfa boyutunu değiştirir — sayfa 1'e döner */
  setLimit: (limit: number) => void

  // ── Sıralama ─────────────────────────────────────────────
  /** Mevcut sıralama durumu */
  sorting: DataTableSortingState | undefined
  /** Sıralamayı değiştirir — sayfa 1'e döner */
  setSorting: (sorting: DataTableSortingState) => void
}

/**
 * DataTable için URL-tabanlı filtre, arama, sayfalama ve sıralama state yönetimi.
 *
 * Tüm state URL search parametrelerinde tutulur — sayfa yenilendiğinde korunur,
 * paylaşılabilir ve browser geçmişiyle uyumludur.
 *
 * Filtre değerleri `filterValues` objesinde, her grup kendi field adıyla erişilebilir.
 * Multi-select filtreler `string[]`, single-select filtreler `string | undefined` döner.
 *
 * @param groups - Tablo için tanımlanan filtre grupları
 * @param options - Opsiyonel konfigürasyon
 *
 * @example
 * const filters = useDataTableFilters(MY_FILTERS, {
 *   defaultSort: { field: 'created_at', order: 'desc' },
 *   defaultLimit: 20,
 *   searchField: 'username',
 *   searchPlaceholder: 'Kullanıcı ara...',
 * })
 *
 * // API query
 * const { data } = MyService.useGetList({
 *   page: filters.page,
 *   limit: filters.limit,
 *   [filters.searchField]: filters.debouncedSearch || undefined,
 *   status: filters.filterValues.status,   // string | undefined
 *   role: filters.filterValues.role,       // string[] | undefined
 * })
 */
export function useDataTableFilters(
  groups: FilterGroup[],
  options: UseDataTableFiltersOptions,
): UseDataTableFiltersReturn {
  const {
    defaultSort,
    defaultLimit = 10,
    searchField: searchFieldOption = 'search',
    searchPlaceholder = 'Search...',
    prefix,
  } = options

  /** Tüm URL key'lerini prefix ile namespace'ler. */
  const pk = useCallback((k: string) => `${prefix}_${k}`, [prefix])

  const searchParams = useSearchParams()
  const { updateFilters } = useUrlFilters()

  // ── Arama ─────────────────────────────────────────────────────────────────
  const urlSearch = searchParams.get(pk(searchFieldOption)) ?? ''
  const [search, setSearchState] = useState(urlSearch)
  const debouncedSearch = useDebounce(search, 300)

  // URL'deki search değiştiğinde local state'i senkronize et (geri/ileri nav)
  useEffect(() => {
    setSearchState(searchParams.get(pk(searchFieldOption)) ?? '')
  }, [searchParams, searchFieldOption, pk])

  // Debounced search URL'e yaz — page'i de açıkça 1'e resetle
  useEffect(() => {
    const currentUrlSearch = searchParams.get(pk(searchFieldOption)) ?? ''
    if (debouncedSearch !== currentUrlSearch) {
      updateFilters({
        [pk(searchFieldOption)]: debouncedSearch || undefined,
        [pk('page')]: 1,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const setSearch = useCallback((value: string) => {
    setSearchState(value)
  }, [])

  // ── Sayfalama ─────────────────────────────────────────────────────────────
  const page = Number(searchParams.get(pk('page')) ?? '1')
  const limit = Number(searchParams.get(pk('limit')) ?? String(defaultLimit))

  const setPage = useCallback(
    (newPage: number) => updateFilters({ [pk('page')]: newPage }),
    [updateFilters, pk],
  )

  const setLimit = useCallback(
    (newLimit: number) => updateFilters({ [pk('limit')]: newLimit, [pk('page')]: 1 }),
    [updateFilters, pk],
  )

  // ── Sıralama ──────────────────────────────────────────────────────────────
  const sortField = searchParams.get(pk('sort'))
  const sortOrder = searchParams.get(pk('order')) as 'asc' | 'desc' | null

  const sorting: DataTableSortingState | undefined = useMemo(() => {
    if (sortField && sortOrder) return { field: sortField, order: sortOrder }
    if (defaultSort) return defaultSort
    return undefined
  }, [sortField, sortOrder, defaultSort])

  const setSorting = useCallback(
    (newSorting: DataTableSortingState) => {
      updateFilters({ [pk('sort')]: newSorting.field, [pk('order')]: newSorting.order, [pk('page')]: 1 })
    },
    [updateFilters, pk],
  )

  // ── Filtre Değerleri ───────────────────────────────────────────────────────
  const filterValues = useMemo<Record<string, string | string[] | undefined>>(() => {
    const result: Record<string, string | string[] | undefined> = {}

    for (const group of groups) {
      const isMulti = group.multipleSelect ?? group.type === 'checkbox'
      const urlKey = pk(group.field)

      if (isMulti) {
        const values = searchParams.getAll(urlKey)
        result[group.field] = values.length > 0 ? values : undefined
      } else {
        const value = searchParams.get(urlKey)
        result[group.field] = value ?? undefined
      }
    }

    return result
  }, [groups, searchParams, pk])

  // ── Aktif Filtreler (Chip verisi) ─────────────────────────────────────────
  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const chips: ActiveFilter[] = []

    for (const group of groups) {
      const isMulti = group.multipleSelect ?? group.type === 'checkbox'
      const urlKey = pk(group.field)

      if (group.type === 'checkbox' || group.type === 'radio') {
        const values = isMulti
          ? searchParams.getAll(urlKey)
          : [searchParams.get(urlKey)].filter(Boolean) as string[]

        for (const val of values) {
          const option = group.options?.find((o) => o.value === val)
          if (option) {
            chips.push({
              field: group.field,
              groupTitle: group.title,
              label: option.label,
              value: val,
            })
          }
        }
      } else if (group.type === 'date' || group.type === 'input') {
        const value = searchParams.get(urlKey)
        if (value) {
          chips.push({
            field: group.field,
            groupTitle: group.title,
            label: value,
            value,
          })
        }
      }
    }

    return chips
  }, [groups, searchParams, pk])

  const activeFilterCount = activeFilters.length

  // ── Filtre Handler'ları ───────────────────────────────────────────────────
  const setFilter = useCallback(
    (field: string, value: string | string[] | undefined) => {
      updateFilters({ [pk(field)]: value, [pk('page')]: 1 })
    },
    [updateFilters, pk],
  )

  const removeFilter = useCallback(
    (field: string, value?: string) => {
      const group = groups.find((g) => g.field === field)
      const isMulti = group ? (group.multipleSelect ?? group.type === 'checkbox') : false
      const urlKey = pk(field)

      if (isMulti && value !== undefined) {
        const current = searchParams.getAll(urlKey)
        const next = current.filter((v) => v !== value)
        updateFilters({ [urlKey]: next.length > 0 ? next : undefined, [pk('page')]: 1 })
      } else {
        updateFilters({ [urlKey]: undefined, [pk('page')]: 1 })
      }
    },
    [groups, searchParams, updateFilters, pk],
  )

  const clearAllFilters = useCallback(() => {
    const reset: Record<string, undefined> = {}
    for (const group of groups) {
      reset[pk(group.field)] = undefined
    }
    updateFilters({ ...reset, [pk(searchFieldOption)]: undefined, [pk('page')]: 1 })
    setSearchState('')
  }, [groups, searchFieldOption, updateFilters, pk])

  return {
    filterValues,
    activeFilters,
    activeFilterCount,
    setFilter,
    removeFilter,
    clearAllFilters,
    search,
    setSearch,
    debouncedSearch,
    searchField: searchFieldOption,
    searchPlaceholder,
    page,
    limit,
    setPage,
    setLimit,
    sorting,
    setSorting,
  }
}
