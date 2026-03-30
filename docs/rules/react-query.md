# React Query Rules

All backend operations (list, detail, create, update, delete) must go through React Query. Direct API calls inside components are forbidden.

## Usage Pattern

```ts
const { data, error, isLoading } = useCompanies();
const { mutate: createCompany, isPending } = useCreateCompany();
```

## Mutation → Cache Invalidation

After every mutation, invalidate the related query key so the UI stays in sync.

```ts
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: queryKeys.company.list() });
}
```

## Query Keys

Always import from `lib/query-keys.ts`. Inline strings are forbidden.

```ts
// ✗ Forbidden
useQuery({ queryKey: ['company', 'list'] })

// ✓ Correct
useQuery({ queryKey: queryKeys.company.list() })
```
