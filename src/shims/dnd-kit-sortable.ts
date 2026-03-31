import type { ReactNode } from 'react'

export function SortableContext({
  children,
}: {
  children: ReactNode
  items?: Array<string | number>
  strategy?: unknown
}) {
  return children
}

export function useSortable({ id }: { id: string | number }) {
  return {
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
    isDragging: false,
    active: { id },
  }
}

export const verticalListSortingStrategy = {}

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const next = [...array]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}
