import type { DataTableAlign, DataTableResponsive } from './types'

/**
 * Toplam kayıt sayısına göre sayfa boyutu seçeneklerini otomatik üretir.
 *
 * 5'er artımlı seçenekler üretir; son seçenek her zaman totalItems olur.
 * Çok fazla seçenek oluşmaması için 50 üzerindeyse [5,10,15,20,25,50,max] formatına düşer.
 *
 * @example
 * getPageSizeOptions(47)  // → [5, 10, 15, 20, 25, 47]
 * getPageSizeOptions(100) // → [5, 10, 15, 20, 25, 50, 100]
 * getPageSizeOptions(8)   // → [5, 8]
 */
export function getPageSizeOptions(totalItems: number): number[] {
  if (totalItems <= 0) return [5]
  const base = [5, 10, 15, 20, 25, 50]
  const filtered = base.filter((n) => n < totalItems)
  return [...filtered, totalItems]
}

/**
 * Responsive breakpoint'i Tailwind hidden class'ına çevirir.
 *
 * @example
 * getResponsiveClass('md') // → 'hidden md:table-cell'
 * getResponsiveClass(undefined) // → undefined
 */
export function getResponsiveClass(responsive?: DataTableResponsive): string | undefined {
  if (!responsive) return undefined
  const map: Record<DataTableResponsive, string> = {
    sm: 'hidden sm:table-cell',
    md: 'hidden md:table-cell',
    lg: 'hidden lg:table-cell',
    xl: 'hidden xl:table-cell',
    '2xl': 'hidden 2xl:table-cell',
  }
  return map[responsive]
}

/**
 * Hizalama değerini header ve cell için Tailwind class'ına çevirir.
 *
 * @example
 * getAlignClass('right') // → 'text-right'
 * getAlignClass(undefined) // → 'text-left'
 */
export function getAlignClass(align?: DataTableAlign): string {
  if (!align || align === 'left') return 'text-left'
  if (align === 'center') return 'text-center'
  return 'text-right'
}

/**
 * Sayfalama offseti dahil 1-tabanlı satır numarasını hesaplar.
 *
 * @param currentPage - Mevcut sayfa (1-tabanlı)
 * @param pageSize - Sayfa başına kayıt sayısı
 * @param rowIndex - Mevcut sayfadaki 0-tabanlı satır indeksi
 * @returns Görünür sıra numarası
 *
 * @example
 * getRowNumber(2, 20, 0) // → 21  (2. sayfa, ilk satır)
 * getRowNumber(1, 20, 4) // → 5   (1. sayfa, 5. satır)
 */
export function getRowNumber(
  currentPage: number,
  pageSize: number,
  rowIndex: number
): number {
  return (currentPage - 1) * pageSize + rowIndex + 1
}
