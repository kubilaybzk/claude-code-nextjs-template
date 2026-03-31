/**
 * Quiz Liste Skeleton
 *
 * Quiz kartlari yuklenirken gosterilen loading state.
 * AcademyListSkeleton ile ayni pattern.
 *
 * @example
 * <QuizListSkeleton />
 * <QuizListSkeleton count={12} />
 */
import { Skeleton } from '@/components/ui/skeleton'

interface QuizListSkeletonProps {
  /** Gosterilecek iskelet kart sayisi */
  count?: number
}

export function QuizListSkeleton({ count = 8 }: QuizListSkeletonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Thumbnail */}
          <Skeleton className="aspect-video w-full rounded-none" />

          {/* Content */}
          <div className="flex flex-col gap-2.5 px-3.5 py-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-1.5 flex-1" />
              <Skeleton className="h-5 w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
