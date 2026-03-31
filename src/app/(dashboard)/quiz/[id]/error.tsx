'use client'

import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'

/**
 * Quiz detail page error boundary.
 * Displays error state with retry action.
 */
export default function QuizDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      title="Failed to load quiz"
      description={error.message || 'An error occurred while loading the quiz details.'}
      action={
        <Button onClick={reset} variant="outline">
          Try Again
        </Button>
      }
    />
  )
}
