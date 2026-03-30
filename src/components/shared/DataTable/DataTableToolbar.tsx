import type { ReactNode } from 'react'
import React from 'react'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DataTableToolbarSearch {
  /** Search input değeri */
  value: string
  /** Search input değişince çağrılır */
  onChange: (value: string) => void
  /** Input placeholder metni — varsayılan: 'Ara...' */
  placeholder?: string
}

interface DataTableToolbarProps {
  /**
   * Arama konfigürasyonu — verilirse sol tarafa arama input'u render edilir.
   * Debounce parent'ta uygulanmalıdır (`useDebounce` hook ile).
   */
  search?: DataTableToolbarSearch
  /**
   * Sağ tarafa render edilecek içerik (filtre select'leri, aksiyon butonları vb.)
   *
   * @example
   * children={
   *   <Select value={roleFilter} onValueChange={setRoleFilter}>
   *     ...
   *   </Select>
   * }
   */
  children?: ReactNode
  /**
   * Sağ tarafa, children'dan sonra eklenir — DataTable tarafından columns butonu inject edilir.
   * Dışarıdan doğrudan kullanılması gerekmez.
   */
  trailing?: ReactNode
  /** Ek className */
  className?: string
}

/**
 * DataTable için toolbar convenience component'i.
 *
 * Sol tarafa opsiyonel arama input'u, sağ tarafa slot render eder.
 * Filtreler, aksiyon butonları veya herhangi bir içerik `children` ile geçilir.
 *
 * Debounce parent component'te uygulanır:
 * ```ts
 * const debouncedSearch = useDebounce(search, 300)
 * // search → input value (her tuşta güncellenir)
 * // debouncedSearch → API query parametresi
 * ```
 *
 * @example
 * <DataTableToolbar
 *   search={{ value: search, onChange: setSearch, placeholder: 'Kullanıcı ara...' }}
 * >
 *   <Select value={statusFilter} onValueChange={setStatusFilter}>
 *     <SelectTrigger className="w-40">
 *       <SelectValue placeholder="Tüm Durumlar" />
 *     </SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value="all">Tüm Durumlar</SelectItem>
 *     </SelectContent>
 *   </Select>
 * </DataTableToolbar>
 */
export function DataTableToolbar({ search, children, trailing, className }: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4',
        className,
      )}
    >
      {/* Arama input'u — sol */}
      {search && (
        <div className="relative min-w-0 w-full max-w-xs">
          <SearchIcon
            data-icon
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
          />
          <Input
            placeholder={search.placeholder ?? 'Search...'}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Sağ slot — filter butonları + columns (trailing) birlikte */}
      {(children || trailing) && (
        <div className="flex shrink-0 items-center gap-1.5">
          {children}
          {trailing}
        </div>
      )}
    </div>
  )
}
