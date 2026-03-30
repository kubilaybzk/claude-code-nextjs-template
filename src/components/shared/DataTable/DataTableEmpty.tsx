import type { ReactNode } from 'react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'

interface DataTableEmptyProps {
  /** Toplam kolon sayısı (colspan için) */
  columnCount: number
  /** Boş durum başlığı — varsayılan: 'Kayıt bulunamadı' */
  title?: string
  /** Boş durum açıklaması */
  description?: string
  /** Boş durum ikonu */
  icon?: ReactNode
}

/**
 * DataTable boş durum render'ı.
 *
 * `<TableBody>` içine yerleştirilmek üzere tasarlanmıştır.
 * Shadcn `<Empty>` composable component'ini kullanır.
 *
 * @example
 * <TableBody>
 *   {data.length === 0 && (
 *     <DataTableEmpty
 *       columnCount={columns.length}
 *       title="Kullanıcı bulunamadı"
 *       description="Arama kriterlerini değiştirin"
 *     />
 *   )}
 * </TableBody>
 */
export function DataTableEmpty({
  columnCount,
  title = 'No records found',
  description,
  icon,
}: DataTableEmptyProps) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columnCount} className="p-0">
        <Empty>
          {icon && (
            <EmptyContent className="text-muted-foreground">
              {icon}
            </EmptyContent>
          )}
          <EmptyHeader>
            <EmptyTitle>{title}</EmptyTitle>
            {description && <EmptyDescription>{description}</EmptyDescription>}
          </EmptyHeader>
        </Empty>
      </TableCell>
    </TableRow>
  )
}
