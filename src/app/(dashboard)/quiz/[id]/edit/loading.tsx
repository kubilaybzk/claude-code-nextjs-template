import { Skeleton } from '@/components/ui/skeleton'

/**
 * Edit quiz form loading state.
 * Displays skeleton while edit form is loading.
 */
export default function EditQuizLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Form header skeleton */}
      <div>
        <Skeleton className="h-8 w-64 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md mt-2" />
      </div>

      {/* Form sections skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>

      {/* Actions skeleton */}
      <div className="flex gap-2 justify-end">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  )
}
