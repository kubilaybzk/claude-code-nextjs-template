'use client'

import { useMemo, useState, isValidElement, cloneElement } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type VisibilityState,
} from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ColumnsIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react'
import { Pagination } from '@/components/shared/Pagination'
import { cn } from '@/lib/utils'
import { getAlignClass, getResponsiveClass, getRowNumber, getPageSizeOptions } from './helpers'
import { DataTableSkeleton } from './DataTableSkeleton'
import { DataTableEmpty } from './DataTableEmpty'
import type { DataTableProps } from './types'

/**
 * Generic, type-safe DataTable component — powered by TanStack React Table.
 *
 * `TRow` tipi `data` prop'undan otomatik çıkarılır.
 * Kolon tanımlarında `cell: ({ row }) => row.original.field` callback'i tam TypeScript autocomplete sağlar.
 *
 * Desteklenen özellikler:
 * - Server-side ve client-side pagination
 * - Harici kontrollü sıralama (enableSorting: true kolonlar)
 * - Checkbox satır seçimi (tek / toplu)
 * - Responsive kolon gizleme (sm/md/lg/xl breakpoints)
 * - Sıra numarası kolonu (pagination offseti dahil)
 * - Toolbar slot (arama, filtreler, aksiyon butonları)
 * - Loading skeleton ve boş durum
 * - Row hover group (aksiyon butonları için)
 *
 * @example
 * // Temel kullanım
 * const columns: DataTableColumn<User>[] = [
 *   { id: 'name', header: 'Ad', cell: ({ row }) => row.original.name },
 *   { id: 'email', header: 'E-posta', cell: ({ row }) => row.original.email, meta: { responsive: 'md' } },
 * ]
 *
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   isLoading={isLoading}
 *   pagination={{ currentPage: page, totalItems: total, pageSize: 20, onPageChange: setPage }}
 *   toolbar={<DataTableToolbar search={{ value: search, onChange: setSearch }} />}
 * />
 *
 * @example
 * // Satır seçimi ile
 * <DataTable
 *   columns={columns}
 *   data={quizzes}
 *   selection={{
 *     selectedIds,
 *     getRowId: (row) => String(row.id),
 *     onToggle: (id) => dispatch(toggleSelection(id)),
 *   }}
 * />
 */
export function DataTable<TRow>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,
  pagination,
  sorting,
  onSortChange,
  selection,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  toolbar,
  filterChips,
  getRowKey,
  rowClassName,
  enableRowHover = false,
  showRowNumbers = false,
  showColumnVisibility = false,
  onRowClick,
  className,
  variant = 'default',
}: DataTableProps<TRow>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Selection + row-number display kolonları başa eklenir
  const allColumns = useMemo<ColumnDef<TRow>[]>(() => {
    const extra: ColumnDef<TRow>[] = []

    if (selection) {
      extra.push({
        id: '__select',
        enableSorting: false,
        meta: { width: 'w-10' },
        header: ({ table }) => {
          const allIds = table.getRowModel().rows.map((r) => r.id)
          const isAllSelected =
            allIds.length > 0 && allIds.every((id) => selection.selectedIds.includes(id))
          const isIndeterminate =
            !isAllSelected && allIds.some((id) => selection.selectedIds.includes(id))

          return selection.onToggleAll ? (
            <Checkbox
              checked={isAllSelected}
              data-state={isIndeterminate ? 'indeterminate' : undefined}
              onCheckedChange={() => selection.onToggleAll?.(allIds)}
              aria-label="Select all rows"
            />
          ) : (
            <span className="sr-only">Select</span>
          )
        },
        cell: ({ row }) => (
          <Checkbox
            checked={selection.selectedIds.includes(row.id)}
            onCheckedChange={() => selection.onToggle(row.id)}
            aria-label="Select row"
          />
        ),
      })
    }

    if (showRowNumbers) {
      extra.push({
        id: '__rownum',
        enableSorting: false,
        meta: { width: 'w-12' },
        header: () => <span className="text-xs">#</span>,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {pagination
              ? getRowNumber(pagination.currentPage, pagination.pageSize, row.index)
              : row.index + 1}
          </span>
        ),
      })
    }

    return [...extra, ...columns]
  }, [columns, selection, showRowNumbers, pagination])

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row, index) => {
      if (selection?.getRowId) return selection.getRowId(row)
      if (getRowKey) return String(getRowKey(row, index))
      return String(index)
    },
  })

  const totalColumnCount = table.getAllColumns().length

  const wrapperClass =
    variant === 'card'
      ? 'cyber-panel overflow-hidden'
      : 'rounded-lg border border-border overflow-hidden'

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Toolbar: search sol — filtre+sütunlar sağ (trailing inject) */}
      {(toolbar || showColumnVisibility) && (() => {
        const columnsButton = showColumnVisibility ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ColumnsIcon className="size-3.5" />
                <span className="hidden sm:inline">Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Column Visibility
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide() && !col.id.startsWith('__'))
                .map((col) => {
                  const header = col.columnDef.header
                  const label = typeof header === 'string' ? header : col.id
                  return (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={col.getIsVisible()}
                      onCheckedChange={(val) => col.toggleVisibility(val)}
                      className="text-xs"
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null

        // Toolbar DataTableToolbar ise columns butonu trailing olarak inject et
        const enhancedToolbar =
          columnsButton && isValidElement(toolbar)
            ? cloneElement(toolbar as React.ReactElement<{ trailing?: React.ReactNode }>, {
                trailing: columnsButton,
              })
            : toolbar

        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">{enhancedToolbar}</div>
            {/* Toolbar DataTableToolbar değilse columns butonu dışarıda render */}
            {columnsButton && !isValidElement(toolbar) && columnsButton}
          </div>
        )
      })()}

      {/* Aktif filtre chip'leri */}
      {filterChips}

      {/* Tablo wrapper */}
      <div className={wrapperClass}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border/60 bg-muted/30 hover:bg-muted/30"
              >
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta
                  const responsiveClass = getResponsiveClass(meta?.responsive)
                  const alignClass = getAlignClass(meta?.align)
                  const apiField = meta?.sortField ?? header.column.id
                  const isSorted = sorting?.field === apiField
                  const sortOrder = isSorted ? sorting?.order : undefined

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70',
                        alignClass,
                        responsiveClass,
                        meta?.width,
                        meta?.headerClassName,
                        isSorted && 'text-primary/80',
                      )}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() && onSortChange ? (
                        <button
                          type="button"
                          onClick={() => {
                            const nextOrder =
                              isSorted && sorting?.order === 'asc' ? 'desc' : 'asc'
                            onSortChange({ field: apiField, order: nextOrder })
                          }}
                          className={cn(
                            'inline-flex items-center gap-1 transition-colors hover:text-foreground',
                            isSorted ? 'text-primary' : 'text-muted-foreground/70',
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="flex flex-col gap-px opacity-60">
                            <ChevronUpIcon
                              className={cn(
                                'size-2 -rotate-90',
                                sortOrder === 'asc' ? 'opacity-100 text-primary' : 'opacity-30',
                              )}
                            />
                            <ChevronDownIcon
                              className={cn(
                                'size-2',
                                sortOrder === 'desc' ? 'opacity-100 text-primary' : 'opacity-30',
                              )}
                            />
                          </span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <DataTableSkeleton columnCount={totalColumnCount} rowCount={skeletonRows} />
            ) : table.getRowModel().rows.length === 0 ? (
              <DataTableEmpty
                columnCount={totalColumnCount}
                title={emptyTitle}
                description={emptyDescription}
                icon={emptyIcon}
              />
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={
                    selection?.selectedIds.includes(row.id) ? 'selected' : undefined
                  }
                  className={cn(
                    enableRowHover && 'group',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row.original),
                  )}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta
                    const responsiveClass = getResponsiveClass(meta?.responsive)
                    const alignClass = getAlignClass(meta?.align)

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(alignClass, responsiveClass, meta?.cellClassName)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={Math.ceil(pagination.totalItems / pagination.pageSize)}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={getPageSizeOptions(pagination.totalItems)}
        />
      )}
    </div>
  )
}
