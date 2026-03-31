import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import Link from 'next/link'

/**
 * Quiz list page not found.
 * Displays 404 page for quiz routes.
 */
export default function QuizNotFound() {
  return (
    <EmptyState
      title="Quiz list not found"
      description="The quiz list page could not be found."
      action={
        <Button asChild>
          <Link href={paths.dashboard.quiz}>Back to Dashboard</Link>
        </Button>
      }
    />
  )
}
