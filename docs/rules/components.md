# Component Rules

## One Component Per File

Multiple component definitions in a single file are forbidden.

## Reusability First

Before creating a new component, check if an existing one can be extended.
Follow the placement decision tree in `docs/architecture.md`.

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
