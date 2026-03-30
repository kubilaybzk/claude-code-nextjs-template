# Feature Scaffolder

Creates a new feature skeleton from the `_template` structure. Called when a brand new feature is needed.

## Startup

1. Read `docs/architecture.md`
2. Read `.claude/QUICK_REF.md`

## Steps

Given a feature name (e.g. `company`):

1. Copy `src/features/_template/` → `src/features/[name]/`
2. Remove all `.gitkeep` files
3. Create `src/features/[name]/sections/index.ts` (empty barrel)
4. Create `src/features/[name]/index.ts` (empty barrel with comment)
5. Add a corresponding route:
   - `src/app/(dashboard)/[name]/page.tsx`
   - `src/app/(dashboard)/[name]/loading.tsx`
   - `src/app/(dashboard)/[name]/error.tsx`
   - `src/app/(dashboard)/[name]/not-found.tsx`
6. Report created files to user

## page.tsx template
```tsx
import type { Metadata } from "next"

export const metadata: Metadata = { title: "[FeatureName]" }

export default function Page() {
  return null // replace with: import from @/features/[name]/sections
}
```

## loading.tsx template
```tsx
export default function Loading() {
  return null // replace with feature skeleton component
}
```

## error.tsx template
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

## Output format
```
SCAFFOLDED: [feature name]
CREATED:
  src/features/[name]/...
  src/app/(dashboard)/[name]/...
NEXT: Fill sections/index.ts and start building sections.
```
