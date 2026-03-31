'use client'

import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'

/**
 * Create quiz form error boundary.
 * Displays error state with retry action.
 */
export default function CreateQuizError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      title="Failed to load quiz form"
      description={error.message || 'An error occurred while loading the quiz creation form.'}
      action={
        <Button onClick={reset} variant="outline">
          Try Again
        </Button>
      }
    />
  )
}
