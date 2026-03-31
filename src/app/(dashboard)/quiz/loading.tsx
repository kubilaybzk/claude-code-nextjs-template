import { Skeleton } from '@/components/ui/skeleton'

/**
 * Quiz list page loading state.
 * Displays skeleton placeholder while list is loading.
 */
export default function QuizListLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* Search + Actions Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-full sm:max-w-sm rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  )
}
