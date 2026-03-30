# Notification & Toast Rules

There are two notification channels: **toast** and **inline**. Full HTTP error code table → `docs/rules/routing.md`.

## Toast — `sonner`

| Case | Usage |
|---|---|
| Mutation success (create / update / delete) | `toast.success(...)` — 3 seconds |
| Unexpected server error (5xx / network) | `toast.error(...)` — 5 seconds |
| Info message | `toast.info(...)` |

```ts
// inside lib/[name].queries.ts
onSuccess: () => {
  toast.success("Company created successfully.")
  queryClient.invalidateQueries({ queryKey: queryKeys.company.list() })
},
onError: () => {
  toast.error("An error occurred. Please try again.")
},
```

Technical error details (stack trace, error code) must not be shown in toasts.

## Inline — Form Validation Errors

Form field errors are shown inline below the field, never as a toast.
react-hook-form + zod handles this automatically.

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
| Page / list loading error | `<ErrorState />` — see `docs/rules/states.md` |
| HTTP errors (400 / 401 / 403 / 500) | See full table → `docs/rules/routing.md` |
