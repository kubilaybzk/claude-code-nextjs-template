# Loading / Empty / Error States

## Loading — Skeleton

Spinners are forbidden in content areas. Write a skeleton component for every list or card area.
The skeleton must match the real component's layout dimensions.

```tsx
// ✗ Forbidden
if (isLoading) return <Spinner />

// ✓ Correct
if (isLoading) return <CompanyListSkeleton />
```

The skeleton file lives next to the real component:

```
sections/companyList/components/
├── CompanyCard.tsx
└── CompanyCardSkeleton.tsx
```

## Empty State

When there is no data, use `<EmptyState />`. Inline messages or conditional renders are forbidden.

```tsx
import { EmptyState } from "@/components/shared/EmptyState"

if (!data?.length) {
  return (
    <EmptyState
      title="No companies yet"
      description="Click the button below to add your first company."
      action={<Button onClick={onAdd}>Add Company</Button>}
    />
  )
}
```

Props:
- `title` — required, short heading
- `description` — optional, tell the user what to do next
- `action` — optional, CTA button
- `icon` — optional, custom icon override

## Error State

Use `<ErrorState />` when React Query's `isError` is true. Errors must never be silently ignored.

```tsx
import { ErrorState } from "@/components/shared/ErrorState"

if (isError) {
  return (
    <ErrorState
      title="Failed to load data"
      description="Please try again or refresh the page."
      action={<Button variant="outline" onClick={() => refetch()}>Retry</Button>}
    />
  )
}
```

## Order

Every component that uses React Query data must follow this check order:

```tsx
if (isLoading) return <MySkeleton />
if (isError)   return <ErrorState title="..." />
if (!data?.length) return <EmptyState title="..." />

return <MyList data={data} />
```
