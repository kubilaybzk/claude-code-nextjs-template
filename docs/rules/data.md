yorum# Data & State Management Rules

## Server State → React Query

All backend operations (list, detail, create, update, delete) must go through React Query.
Direct API calls inside components are forbidden.
React Query cache is the single source of truth for all backend data. Never duplicate server state in Redux.

### Usage Pattern

```ts
const { data, error, isLoading } = useCompanies();
const { mutate: createCompany, isPending } = useCreateCompany();
```

### Mutation → Cache Invalidation

After every mutation, invalidate the related query key so the UI stays in sync.

```ts
onSuccess: () => {
  toast.success("Company created successfully.")
  queryClient.invalidateQueries({ queryKey: queryKeys.company.list() });
}
```

### Query Keys

Always import from `lib/query-keys.ts`. Inline strings are forbidden.

```ts
// ✗ Forbidden
useQuery({ queryKey: ['company', 'list'] })

// ✓ Correct
useQuery({ queryKey: queryKeys.company.list() })
```

## Client State → Redux (feature store)

Feature `store/` is created **only when the user explicitly requests it**. Never create it proactively.

Never use it for server data.

## Global Store

`src/store/` contains only `configureStore` + root reducer wiring. No slice definitions here — slices live in `features/[name]/store/`.
