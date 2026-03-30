# User Feedback Rules — States & Notifications

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

Props: `title` (required) · `description` · `action` · `icon`

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

## Render Order

Every component that uses React Query data must follow this check order:

```tsx
if (isLoading) return <MySkeleton />
if (isError)   return <ErrorState title="..." />
if (!data?.length) return <EmptyState title="..." />

return <MyList data={data} />
```

## Toast — `sonner`

| Case | Usage |
|---|---|
| Mutation success (create / update / delete) | `toast.success(...)` — 3 seconds |
| Unexpected server error (5xx / network) | `toast.error(...)` — 5 seconds |
| Info message | `toast.info(...)` |

Technical error details (stack trace, error code) must not be shown in toasts.

## Inline — Form Validation Errors

Form field errors are shown inline below the field, never as a toast.

```tsx
// ✗ Forbidden
toast.error("Name is required.")

// ✓ Correct
<FormItem>
  <FormControl><Input {...field} /></FormControl>
  <FormMessage />
</FormItem>
```

## Summary

| Case | Channel |
|---|---|
| Mutation success / error | Toast |
| Form field validation | Inline `<FormMessage />` |
| Page / list loading error | `<ErrorState />` |
| Page / list empty | `<EmptyState />` |
| HTTP errors (400 / 401 / 403 / 500) | See full table → `docs/rules/routing.md` |
