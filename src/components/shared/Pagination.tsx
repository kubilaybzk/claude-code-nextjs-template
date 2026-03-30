import { ChevronsLeftIcon, ChevronsRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface PaginationProps {
  /** Şu anki sayfa numarası (1-based) */
  currentPage: number
  /** Toplam sayfa sayısı */
  totalPages: number
  /** Sayfa değiştiğinde çağrılır */
  onPageChange: (page: number) => void
  /** Sayfa başına kayıt sayısı (opsiyonel — gösterilecekse) */
  pageSize?: number
  /** Sayfa başına kayıt değiştiğinde çağrılır */
  onPageSizeChange?: (pageSize: number) => void
  /** Toplam kayıt sayısı (opsiyonel — bilgi amaçlı gösterilir) */
  totalItems?: number
  /** Sayfa boyutu seçenekleri */
  pageSizeOptions?: number[]
  /** Ek CSS class'ları */
  className?: string
}

/**
 * Server-side pagination component'i
 *
 * URL-based pagination ile kullanılmak üzere tasarlanmıştır.
 * React Query + searchParams ile birlikte çalışır.
 *
 * @example
 * // Temel kullanım
 * <Pagination
 *   currentPage={page}
 *   totalPages={data?.meta.totalPages ?? 1}
 *   onPageChange={(p) => router.push(`?page=${p}`)}
 * />
 *
 * @example
 * // Page size seçimi ile
 * <Pagination
 *   currentPage={page}
 *   totalPages={data?.meta.totalPages ?? 1}
 *   totalItems={data?.meta.totalItems}
 *   pageSize={pageSize}
 *   onPageChange={(p) => router.push(`?page=${p}&pageSize=${pageSize}`)}
 *   onPageSizeChange={(size) => router.push(`?page=1&pageSize=${size}`)}
 * />
 *
 * @example
 * // Custom page size seçenekleri
 * <Pagination
 *   currentPage={page}
 *   totalPages={totalPages}
 *   pageSize={pageSize}
 *   pageSizeOptions={[5, 10, 25, 50]}
 *   onPageChange={handlePageChange}
 *   onPageSizeChange={handlePageSizeChange}
 * />
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: PaginationProps) {
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  const resolvedPageSize = pageSize ?? 10
  const baseOptions = pageSizeOptions
  /**
   * Toplam kayıt, seçilen limit'ten küçükse (ör. 2 kayıt, limit 10) dropdown'da
   * yalnızca [2] gibi seçenekler kalır; Select value ile eşleşmez. Görünen değer
   * bu durumda totalItems ile sınırlanır.
   */
  const selectValue =
    totalItems !== undefined && totalItems > 0
      ? Math.min(resolvedPageSize, totalItems)
      : resolvedPageSize

  const mergedOptions = (() => {
    const next = [...baseOptions]
    if (!next.includes(selectValue)) {
      next.push(selectValue)
      next.sort((a, b) => a - b)
    }
    return next
  })()

  /**
   * Sayfa numaralarını hesaplar
   *
   * Aktif sayfanın etrafında en fazla 5 sayfa gösterir.
   * Arada boşluk varsa "..." (ellipsis) gösterir.
   *
   * @example
   * // sayfa 1, toplam 10 → [1, 2, 3, 4, 5, '...', 10]
   * // sayfa 5, toplam 10 → [1, '...', 4, 5, 6, '...', 10]
   * // sayfa 10, toplam 10 → [1, '...', 6, 7, 8, 9, 10]
   */
  function getPageNumbers(): (number | 'ellipsis')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = []

    // Her zaman ilk sayfa
    pages.push(1)

    if (currentPage > 3) {
      pages.push('ellipsis')
    }

    // Aktif sayfanın etrafındaki sayfalar
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis')
    }

    // Her zaman son sayfa
    pages.push(totalPages)

    return pages
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 sm:flex-row',
        className,
      )}
    >
      {/* Sol: Toplam kayıt bilgisi + page size */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {totalItems !== undefined && (
          <span>Toplam {totalItems} kayıt</span>
        )}

        {pageSize !== undefined && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Sayfa başına</span>
            <Select
              value={String(selectValue)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mergedOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Sağ: Navigasyon butonları */}
      <div className="flex items-center gap-1">
        {/* İlk sayfa */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={isFirstPage}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeftIcon />
          <span className="sr-only">İlk sayfa</span>
        </Button>

        {/* Önceki sayfa */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={isFirstPage}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeftIcon />
          <span className="sr-only">Önceki sayfa</span>
        </Button>

        {/* Sayfa numaraları */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="flex size-8 items-center justify-center text-sm text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? 'default' : 'outline'}
                size="icon"
                className="size-8"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            ),
          )}
        </div>

        {/* Sonraki sayfa */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon />
          <span className="sr-only">Sonraki sayfa</span>
        </Button>

        {/* Son sayfa */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={isLastPage}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRightIcon />
          <span className="sr-only">Son sayfa</span>
        </Button>
      </div>
    </div>
  )
}
