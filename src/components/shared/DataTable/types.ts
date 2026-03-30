import type { ReactNode } from 'react'
import type { ColumnDef, RowData } from '@tanstack/react-table'

/** Kolon responsive görünürlük breakpoint'i — bu breakpoint'in altında kolon gizlenir */
export type DataTableResponsive = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/** Kolon metin hizalaması */
export type DataTableAlign = 'left' | 'center' | 'right'

/**
 * TanStack ColumnMeta augmentation — custom kolon özellikleri.
 *
 * Tüm DataTable kolonlarında `meta` prop'u ile kullanılır:
 * ```tsx
 * {
 *   id: 'email',
 *   header: 'E-posta',
 *   cell: ({ row }) => row.original.email,
 *   meta: { responsive: 'md', align: 'right' },
 * }
 * ```
 */
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Bu breakpoint'in altında kolon gizlenir */
    responsive?: DataTableResponsive
    /** Metin hizalaması — varsayılan: 'left' */
    align?: DataTableAlign
    /** Kolon genişliği için Tailwind class — örn: `'w-12'`, `'w-[180px]'` */
    width?: string
    /** Header `<th>` için ek className */
    headerClassName?: string
    /** Hücre `<td>` için ek className */
    cellClassName?: string
    /**
     * API'ye gönderilecek sort field adı — varsayılan olarak kolon `id`'si kullanılır.
     * Örn: kolon id'si `'user'` fakat API `'name'` bekliyorsa `sortField: 'name'` girin.
     */
    sortField?: string
  }
}

/**
 * Tek kolon tanımı — TanStack React Table'ın `ColumnDef` tipi.
 *
 * Custom özellikler `meta` içinde tanımlanır.
 * Sıralanabilir kolonlar için `enableSorting: true` kullan.
 *
 * @typeParam TRow - Satır veri tipi
 *
 * @example
 * const columns: DataTableColumn<User>[] = [
 *   {
 *     id: 'username',
 *     header: 'Kullanıcı Adı',
 *     cell: ({ row }) => <span className="font-mono">{row.original.username}</span>,
 *   },
 *   {
 *     id: 'email',
 *     header: 'E-posta',
 *     cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
 *     meta: { responsive: 'md' },
 *   },
 *   {
 *     id: 'score',
 *     header: 'Skor',
 *     enableSorting: true,
 *     meta: { align: 'right', sortField: 'score' },
 *     cell: ({ row }) => row.original.score,
 *   },
 * ]
 */
export type DataTableColumn<TRow> = ColumnDef<TRow>

/** Sıralama durumu */
export interface DataTableSortingState {
  /** Sıralanan API alanı */
  field: string
  /** Sıralama yönü */
  order: 'asc' | 'desc'
}

/**
 * Sayfalama konfigürasyonu
 *
 * @example
 * const paginationConfig: DataTablePaginationConfig = {
 *   currentPage: page,
 *   totalItems: total,
 *   pageSize: limit,
 *   onPageChange: setPage,
 *   onPageSizeChange: (size) => { setLimit(size); setPage(1) },
 * }
 */
export interface DataTablePaginationConfig {
  /** Mevcut sayfa (1-tabanlı) */
  currentPage: number
  /** Toplam kayıt sayısı */
  totalItems: number
  /** Sayfa başına kayıt sayısı */
  pageSize: number
  /** Sayfa değişince çağrılır */
  onPageChange: (page: number) => void
  /** Sayfa boyutu değişince çağrılır — opsiyonel, verilmezse selector gizlenir */
  onPageSizeChange?: (size: number) => void
}

/**
 * Satır seçim konfigürasyonu
 *
 * @example
 * const selectionConfig: DataTableSelectionConfig<Quiz> = {
 *   selectedIds: selectedQuizIds,
 *   getRowId: (row) => String(row.id),
 *   onToggle: (id) => dispatch(toggleQuizSelection(id)),
 *   onToggleAll: (ids) => dispatch(selectAllQuizzes(ids)),
 * }
 */
export interface DataTableSelectionConfig<TRow> {
  /** Seçili satır ID'leri */
  selectedIds: string[]
  /** Satırdan benzersiz ID üret */
  getRowId: (row: TRow) => string
  /** Tek satır seçimini toggle et */
  onToggle: (id: string) => void
  /** Tüm satırları toggle et — verilmezse "hepsini seç" checkbox gizlenir */
  onToggleAll?: (allIds: string[]) => void
}

/**
 * DataTable ana props interface'i
 *
 * @typeParam TRow - Satır veri tipi
 *
 * @example
 * <DataTable<AccountListItem>
 *   columns={columns}
 *   data={users}
 *   isLoading={isLoading}
 *   toolbar={<UserTableToolbar ... />}
 *   pagination={{ currentPage: page, totalItems: total, pageSize: limit, onPageChange: setPage }}
 *   showRowNumbers
 *   enableRowHover
 * />
 */
export interface DataTableProps<TRow> {
  // ── Core ───────────────────────────────────────────────────
  /** Kolon tanımları — `DataTableColumn<TRow>[]` ile tam type güvenliği sağlanır */
  columns: DataTableColumn<TRow>[]

  /** Tablo verisi */
  data: TRow[]

  /** Loading durumu — skeleton gösterir */
  isLoading?: boolean

  /** Loading sırasında kaç skeleton satırı gösterileceği — varsayılan: 5 */
  skeletonRows?: number

  // ── Pagination ─────────────────────────────────────────────
  /** Sayfalama konfigürasyonu — verilmezse pagination gizlenir */
  pagination?: DataTablePaginationConfig

  // ── Sorting ────────────────────────────────────────────────
  /** Mevcut sıralama durumu — dışarıdan kontrol edilir */
  sorting?: DataTableSortingState

  /**
   * Sıralama değişince çağrılır.
   * Aynı kolona tekrar tıklanırsa 'asc' → 'desc' → 'asc' döngüsü yapılır.
   */
  onSortChange?: (sorting: DataTableSortingState) => void

  // ── Selection ──────────────────────────────────────────────
  /** Satır seçim konfigürasyonu — verilmezse checkbox kolonu gizlenir */
  selection?: DataTableSelectionConfig<TRow>

  // ── Empty state ────────────────────────────────────────────
  /** Boş durum başlığı — varsayılan: 'Kayıt bulunamadı' */
  emptyTitle?: string

  /** Boş durum açıklaması */
  emptyDescription?: string

  /** Boş durum ikonu (ReactNode) */
  emptyIcon?: ReactNode

  // ── Slots ──────────────────────────────────────────────────
  /** Toolbar slot — tablo üzerinde render edilir */
  toolbar?: ReactNode

  /**
   * Aktif filtre chip satırı — toolbar ile tablo arasında render edilir.
   * `DataTableFilterChips` component'ini buraya verin.
   */
  filterChips?: ReactNode

  // ── Row ────────────────────────────────────────────────────
  /**
   * Her satır için benzersiz key üret.
   * Mümkünse ID tabanlı key verin (React reconciliation için daha iyi).
   */
  getRowKey?: (row: TRow, index: number) => string | number

  /** Satıra eklenecek ek className — koşullu satır renklendirmesi için */
  rowClassName?: (row: TRow) => string

  /** Satıra tıklandığında çağrılır */
  onRowClick?: (row: TRow) => void

  /**
   * Hover group aktifleştir — aksiyon butonları için `group-hover:opacity-100` pattern'i.
   * `true` iken satırlara `group` class eklenir.
   */
  enableRowHover?: boolean

  /**
   * İlk kolona sıra numarası ekle.
   * Sayfalama ile birlikte kullanıldığında offset hesaplanır.
   */
  showRowNumbers?: boolean

  /**
   * Sağ üstte kolon görünürlük dropdown'ı göster.
   * Tıklanınca hangi kolonların gözükeceği seçilebilir.
   */
  showColumnVisibility?: boolean

  // ── Styling ────────────────────────────────────────────────
  /** Root container için ek className */
  className?: string

  /**
   * Tablo wrapper görünümü:
   * - `'default'`: `rounded-lg border border-border overflow-hidden` (varsayılan)
   * - `'card'`: `cyber-panel overflow-hidden`
   */
  variant?: 'default' | 'card'
}
