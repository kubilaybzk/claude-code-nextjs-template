'use client'

import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'

/**
 * Quiz list page error boundary.
 * Displays error state with retry action.
 */
export default function QuizListError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      title="Failed to load quizzes"
      description={error.message || 'An error occurred while loading the quiz list.'}
      action={
        <Button onClick={reset} variant="outline">
          Try Again
        </Button>
      }
    />
  )
}
