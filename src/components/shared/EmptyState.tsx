import { InboxIcon } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface EmptyStateProps {
  /** Main heading shown in the empty state. */
  title: string
  /** Supplementary message explaining why the state is empty. */
  description?: string
  /** Optional action element (e.g. a Button) rendered below the description. */
  action?: React.ReactNode
  /** Override the default icon. */
  icon?: React.ReactNode
}

/**
 * Global empty state component used when a list or page has no data to display.
 * Wrap with the feature's own section; do not add data-fetching logic here.
 *
 * @param title - Main heading.
 * @param description - Optional supporting text.
 * @param action - Optional CTA element.
 * @param icon - Optional icon override.
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {icon ?? <InboxIcon />}
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
