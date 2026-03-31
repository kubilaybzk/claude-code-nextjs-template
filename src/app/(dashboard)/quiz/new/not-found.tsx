import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import Link from 'next/link'

/**
 * Create quiz form not found.
 * Displays 404 page for quiz creation.
 */
export default function CreateQuizNotFound() {
  return (
    <EmptyState
      title="Quiz creation page not found"
      description="The quiz creation page could not be found."
      action={
        <Button asChild>
          <Link href={paths.quiz.list}>Back to Quizzes</Link>
        </Button>
      }
    />
  )
}
