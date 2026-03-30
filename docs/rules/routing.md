# App Router — Route Anatomy

`app/` is a thin wrapper. No business logic, data fetching, or state belongs here.

## File Responsibilities

| File | Responsibility |
|---|---|
| `page.tsx` | Imports and renders the feature section only (max ~15 lines) |
| `layout.tsx` | Route group shell (sidebar, header, auth guard) |
| `loading.tsx` | Next.js Suspense boundary — skeleton for route transitions |
| `error.tsx` | Next.js Error boundary — route-level recovery screen |
| `not-found.tsx` | 404 screen |

## Route Checklist

When creating a new route, these 4 files are **required**:

```
app/(dashboard)/companies/
├── page.tsx        ✓ required
├── loading.tsx     ✓ required
├── error.tsx       ✓ required
└── not-found.tsx   ✓ required
```

## `page.tsx` Structure

```tsx
// app/(dashboard)/companies/page.tsx
import type { Metadata } from "next"
import { CompanyListPage } from "@/features/company/sections"

export const metadata: Metadata = { title: "Companies" }

export default function Page() {
  return <CompanyListPage />
}
```

Within `app/`, only import from `@/features/[name]/sections` or `@/features/[name]/components` barrels. Deep paths are forbidden.

## `sections/index.ts` — Required Barrel

Every feature's `sections/` directory must have an `index.ts`. Update this file first when adding a new section.

```ts
// features/company/sections/index.ts
export { CompanyListPage } from "./company-list/CompanyListPage"
export { CreateCompanyPage } from "./create-company/CreateCompanyPage"
```

## `loading.tsx` vs Skeleton Component

```
Route transition  → loading.tsx      (Next.js Suspense, automatic)
isLoading true    → <MySkeleton />   (React Query, manual)
```

## `error.tsx` Structure

```tsx
"use client"
import { ErrorState } from "@/components/shared/ErrorState"
import { Button } from "@/components/ui/button"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="An unexpected error occurred"
      action={<Button onClick={reset}>Try Again</Button>}
    />
  )
}
```

## HTTP Error Code Table

| HTTP | Handling |
|---|---|
| 400 | Inline alert above the form |
| 401 | Redirect to login |
| 403 | "Access denied" screen |
| 404 | `not-found.tsx` |
| 500 / Network | Toast (`toast.error`) |
| Render crash | `ComponentErrorBoundary` |
