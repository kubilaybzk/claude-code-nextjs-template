import { AlertCircleIcon } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface ErrorStateProps {
  /** Main heading describing the error. */
  title: string
  /** Optional message with additional context or recovery hint. */
  description?: string
  /** Optional action element (e.g. a retry Button). */
  action?: React.ReactNode
}

/**
 * Global error state component used when a data fetch or operation fails.
 * Pair with React Query's `isError` flag. Do not catch errors silently.
 *
 * @param title - Main error heading.
 * @param description - Optional recovery hint or error detail.
 * @param action - Optional retry / fallback CTA.
 */
export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircleIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && (
          <EmptyDescription>{description}</EmptyDescription>
        )}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  )
}
