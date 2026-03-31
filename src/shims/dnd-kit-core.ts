import type { ReactNode } from 'react'

export interface DragEndEvent {
  active: { id: string | number }
  over: { id: string | number } | null
}

export function DndContext({
  children,
}: {
  children: ReactNode
  sensors?: unknown[]
  collisionDetection?: unknown
  onDragEnd?: (event: DragEndEvent) => void
}) {
  return children
}

export function closestCenter() {
  return null
}

export class PointerSensor {}
export class KeyboardSensor {}

export function useSensor<T>(sensor: T, options?: unknown) {
  return { sensor, options }
}

export function useSensors(...sensors: unknown[]) {
  return sensors
}
