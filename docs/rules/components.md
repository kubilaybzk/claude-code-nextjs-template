# Component Rules

## One Component Per File

Multiple component definitions in a single file are forbidden.

## Reusability First

**Before writing any component**, read `docs/shared-components.md`. If a matching component exists, use it — never rewrite.

For placement decisions, follow the decision tree in `docs/architecture.md`.

## Error Boundary

Every component that fetches API data must be wrapped with `<ComponentErrorBoundary>`.
Wrapping the entire page in a single boundary is forbidden — each component is wrapped individually.

```tsx
// ✗ Forbidden — single boundary for the entire page
<ComponentErrorBoundary>
  <CompanyList />
  <CompanyStats />
</ComponentErrorBoundary>

// ✓ Correct — each data-fetching component wrapped separately
<ComponentErrorBoundary>
  <CompanyList />
</ComponentErrorBoundary>
<ComponentErrorBoundary>
  <CompanyStats />
</ComponentErrorBoundary>
```

## Server vs Client Component

Server Components are preferred. Add `'use client'` only when real interactivity is needed.

```tsx
// ✗ Unnecessary — no interactivity
'use client'
export function CompanyBadge({ name }: { name: string }) {
  return <span>{name}</span>
}

// ✓ Correct — has state/events
'use client'
export function CompanyFilter() {
  const [search, setSearch] = useState('')
  ...
}
```

## Image

`<img>` tag is forbidden — use `next/image`. Add `priority` for LCP elements.

```tsx
// ✗ Forbidden
<img src="/logo.png" alt="Logo" />

// ✓ Correct
import Image from "next/image"
<Image src="/logo.png" alt="Logo" width={120} height={40} priority />
```

## Debounce

Text search and filter inputs require `useDebounce` (300ms).
Manual debounce with `useEffect` + `setTimeout` is forbidden.
Do not use debounce on checkboxes, selects, or pagination.

```tsx
// ✗ Forbidden
useEffect(() => {
  const t = setTimeout(() => search(value), 300)
  return () => clearTimeout(t)
}, [value])

// ✓ Correct
const debouncedSearch = useDebounce(value, 300)
```

## JSDoc Required

Every component and exported function must have a JSDoc comment with `@example`.

```ts
/**
 * Displays a summary card for a single company.
 * @param company - The company data to display.
 * @param onSelect - Callback fired when the card is clicked.
 * @example
 * <CompanyCard company={company} onSelect={handleSelect} />
 */
export function CompanyCard({ company, onSelect }: CompanyCardProps) {
```

## Dev Helpers

Add `<FormValidationDebugger />` as the last child of every form's JSX (development only).

## Other Forbidden Patterns

- `console.log` must not reach production
- `// @ts-ignore` is forbidden
- Magic numbers/strings are forbidden — extract to constants
- IP addresses, hashes, and code values must be rendered with `font-mono`

## Performance — memo / useMemo / useCallback

Premature optimization is forbidden. Measure first, optimize second.

### React.memo

Wrap with `memo` only when the parent re-renders frequently **and** the component's render is measurably expensive (list row, chart, large table).

```tsx
// ✓ Appropriate — each row in a large list
export const CompanyRow = memo(function CompanyRow({ company }: CompanyRowProps) { ... })

// ✗ Unnecessary — simple, rarely re-renders
export const PageTitle = memo(function PageTitle({ title }: { title: string }) { ... })
```

### useMemo

Use only for genuinely expensive computations. Not for simple `filter` / `map`.

```ts
// ✓ Heavy computation over large dataset
const chartData = useMemo(() => transformRawMetrics(rawData), [rawData])

// ✗ Simple filter — React handles it fast, no memo needed
const active = items.filter(i => i.active)
```

### useCallback

Use only when passed to a `memo`-wrapped child or used in another hook's dependency array.

```ts
// ✓ Passed to a memo'd child
const handleDelete = useCallback((id: string) => deleteCompany(id), [deleteCompany])

// ✗ No memo'd child, not in any dependency
const handleClick = useCallback(() => setOpen(true), [])
```

### Strictly Forbidden

- Adding memo/useMemo based on intuition without profiler data
- Wrapping every component with `memo` by default
- `useCallback` with empty `[]` dependency array (closure bug risk)
