/**
 * DataTable Filtre Sistemi — Tip Tanımları
 *
 * Her tablo kendi `FilterGroup[]` dizisini tanımlayarak generic filtre
 * panelini, chip satırını ve URL state yönetimini kullanır.
 *
 * @example
 * const MY_FILTERS: FilterGroup[] = [
 *   {
 *     field: 'status',
 *     title: 'Durum',
 *     type: 'radio',
 *     options: [
 *       { label: 'Aktif', value: 'active' },
 *       { label: 'Pasif', value: 'inactive' },
 *     ],
 *   },
 *   {
 *     field: 'role',
 *     title: 'Rol',
 *     type: 'checkbox',
 *     multipleSelect: true,
 *     options: [
 *       { label: 'Admin', value: 'admin' },
 *       { label: 'User', value: 'user' },
 *     ],
 *   },
 *   {
 *     field: 'created_after',
 *     title: 'Kayıt Tarihi',
 *     type: 'date',
 *     placeholder: 'Tarih seçin...',
 *   },
 *   {
 *     field: 'tag',
 *     title: 'Etiket',
 *     type: 'input',
 *     placeholder: 'Etiket girin...',
 *   },
 * ]
 */

/** Filtre UI kontrol tipi */
export type FilterType = 'checkbox' | 'radio' | 'date' | 'input'

/**
 * Tek filtre seçeneği — checkbox ve radio grupları için kullanılır
 *
 * @example
 * { label: 'Aktif', value: 'active' }
 * { label: 'Range Admin', value: 'Range Admin' }
 */
export interface FilterOption {
  /** Kullanıcıya gösterilen metin */
  label: string
  /** API'ye gönderilecek değer (URL'de string olarak saklanır) */
  value: string
}

/**
 * Tek filtre grubunu tanımlar — bir API parametresine karşılık gelir
 *
 * @example
 * {
 *   field: 'difficulty',
 *   title: 'Zorluk',
 *   type: 'checkbox',
 *   multipleSelect: true,
 *   options: [
 *     { label: 'Kolay', value: '1' },
 *     { label: 'Orta', value: '2' },
 *     { label: 'Zor', value: '3' },
 *   ],
 * }
 */
export interface FilterGroup {
  /**
   * API parametre adı — URL'de key olarak kullanılır
   * @example 'status', 'role', 'difficulty', 'created_after'
   */
  field: string

  /** Filtre panelinde gösterilen başlık */
  title: string

  /** UI kontrol tipi */
  type: FilterType

  /**
   * Seçenekler listesi — `checkbox` ve `radio` tipleri için zorunlu,
   * `date` ve `input` tipleri için kullanılmaz
   */
  options?: FilterOption[]

  /**
   * Çoklu seçim modu
   * - `true` (checkbox default): birden fazla seçenek seçilebilir → URL'de `?field=a&field=b`
   * - `false` (radio default): tek seçenek → URL'de `?field=a`
   */
  multipleSelect?: boolean

  /**
   * Input ve date tipleri için placeholder metni
   * @default 'Ara...' veya 'Tarih seçin...'
   */
  placeholder?: string
}

/**
 * Aktif filtre chip verisi — toolbar altında gösterilen her chip için bir kayıt
 *
 * Multi-select filtrelerde her seçili değer için ayrı bir `ActiveFilter` oluşturulur.
 * Bu sayede her chip bağımsız olarak silinebilir.
 */
export interface ActiveFilter {
  /** Filtre grup field adı (API parametresi) */
  field: string
  /** Chip'te gösterilen grup başlığı (ör: 'Durum', 'Rol') */
  groupTitle: string
  /** Chip'te gösterilen değer etiketi (ör: 'Aktif', 'Admin') */
  label: string
  /** Chip silinirken kullanılan ham değer */
  value: string
}
