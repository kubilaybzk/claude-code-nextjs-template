import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'

interface DataTableSkeletonProps {
  /** Toplam kolon sayısı (colspan hesabı için) */
  columnCount: number
  /** Gösterilecek skeleton satır sayısı — varsayılan: 5 */
  rowCount?: number
}

/**
 * DataTable loading durumu için skeleton satırları render eder.
 *
 * `<TableBody>` içine yerleştirilmek üzere tasarlanmıştır.
 *
 * @example
 * <TableBody>
 *   {isLoading ? (
 *     <DataTableSkeleton columnCount={columns.length} rowCount={5} />
 *   ) : (
 *     // ...rows
 *   )}
 * </TableBody>
 */
export function DataTableSkeleton({ columnCount, rowCount = 5 }: DataTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <TableRow key={rowIdx} aria-hidden="true">
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
