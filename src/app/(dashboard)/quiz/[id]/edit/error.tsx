'use client'

import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'

/**
 * Edit quiz form error boundary.
 * Displays error state with retry action.
 */
export default function EditQuizError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      title="Failed to load quiz editor"
      description={error.message || 'An error occurred while loading the quiz editor.'}
      action={
        <Button onClick={reset} variant="outline">
          Try Again
        </Button>
      }
    />
  )
}
