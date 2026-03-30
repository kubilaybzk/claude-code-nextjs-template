# Performance Rules — memo / useMemo / useCallback

Premature optimization is forbidden. These rules define when to use each tool as much as when not to.

## React.memo

A component should be wrapped with `memo` only when:
- The parent re-renders frequently **and**
- The component's render is measurably expensive (list row, chart, large table)

```tsx
// ✓ Appropriate — each row in a large list
export const CompanyRow = memo(function CompanyRow({ company }: CompanyRowProps) {
  return <tr>...</tr>
})

// ✗ Unnecessary — simple, rarely re-renders
export const PageTitle = memo(function PageTitle({ title }: { title: string }) {
  return <h1>{title}</h1>
})
```

## useMemo

Use only when the computation is genuinely expensive. Do not use for primitive return values or simple map/filter.

```ts
// ✓ Appropriate — heavy computation over large dataset
const chartData = useMemo(() => transformRawMetrics(rawData), [rawData])

// ✗ Unnecessary — simple filter, React handles it fast
const active = useMemo(() => items.filter(i => i.active), [items])

// ✓ Instead
const active = items.filter(i => i.active)
```

## useCallback

Use only when:
- Passed as a prop to a `memo`-wrapped child **or**
- Used in another hook's dependency array

```ts
// ✓ Appropriate — passed to a memo'd child
const handleDelete = useCallback((id: string) => {
  deleteCompany(id)
}, [deleteCompany])

// ✗ Unnecessary — no memo'd child, not in any dependency
const handleClick = useCallback(() => {
  setOpen(true)
}, [])
```

## Decision Tree

```
Is it actually slow? (did you measure with the profiler?)
  ├── No  → don't optimize
  └── Yes → what's causing it?
        ├── Expensive computation          → useMemo
        ├── Unnecessary child re-renders   → React.memo + useCallback
        └── Both                           → apply both
```

## Strictly Forbidden

- Adding memo/useMemo based on intuition without profiler data
- Wrapping every component with `memo` by default
- Using `useCallback` with an empty dependency array `[]` (closure bug risk)
