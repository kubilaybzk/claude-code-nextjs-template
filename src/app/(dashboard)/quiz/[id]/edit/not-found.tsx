import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import Link from 'next/link'

/**
 * Edit quiz form not found.
 * Displays 404 page when quiz doesn't exist.
 */
export default function EditQuizNotFound() {
  return (
    <EmptyState
      title="Quiz not found"
      description="The quiz you're trying to edit doesn't exist or has been deleted."
      action={
        <Button asChild>
          <Link href={paths.quiz.list}>Back to Quizzes</Link>
        </Button>
      }
    />
  )
}
