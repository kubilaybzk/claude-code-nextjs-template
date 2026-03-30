# Quick Reference — Always read this first instead of docs/rules/*

## Architecture
- `app/` thin wrapper only — max 15 lines per page.tsx, no business logic
- Feature modules: `features/[name]/sections/[section]/` → components → steps
- Public API only via `features/[name]/index.ts` barrel
- `sections/index.ts` required in every feature — update before adding a section
- `components/ui/` — never modify (shadcn primitives)

## Shared Components — CHECK FIRST
Before writing any component, read `docs/shared-components.md`.
If it exists there → use it. Never rewrite.

## Data & State
- ALL backend ops → React Query. No direct API calls in components.
- After mutation → `queryClient.invalidateQueries({ queryKey: queryKeys.[domain].list() })`
- Query keys → always from `lib/query-keys.ts`, never inline strings
- Redux feature store → only when user explicitly requests it
- `src/store/` → configureStore setup only, no slice definitions

## Component Rules
- One component per file. `index.tsx` as filename → forbidden
- Every data-fetching component → `<ComponentErrorBoundary>` (individually, not whole page)
- Server Component default. `'use client'` only for real interactivity
- `<img>` → forbidden, use `next/image`
- Text search/filter inputs → `useDebounce(value, 300)` required
- JSDoc + `@example` on every exported component and function
- `console.log`, `// @ts-ignore`, magic numbers → forbidden

## Feedback States (in this order)
```
if (isLoading)     return <[Name]Skeleton />
if (isError)       return <ErrorState title="..." />
if (!data?.length) return <EmptyState title="..." />
return <ActualComponent />
```
- Loading → skeleton only, never `<Spinner />`
- Empty → `<EmptyState />` from `@/components/shared/EmptyState`
- Error → `<ErrorState />` from `@/components/shared/ErrorState`

## Notifications
- Mutation success/error → `toast.success/error()` via sonner (3s/5s)
- Form validation errors → inline `<FormMessage />` only, never toast
- Technical details → never shown in toasts

## Routing
Every route needs: `page.tsx` + `loading.tsx` + `error.tsx` + `not-found.tsx`
HTTP errors: 400→inline alert, 401→redirect login, 403→access denied, 404→not-found.tsx, 500→toast

## Barrel Imports
- `app/` imports features only via `@/features/[name]/sections` or `@/features/[name]` — no deep paths
- `features/[name]/index.ts` exports only public API (pages, types) — never internal components
- `features/[name]/sections/index.ts` must exist and be updated when adding a new section
- `components/shared/` and `services/` — direct imports allowed, no barrel needed

## Forms
- react-hook-form + zod. No exceptions.
- Each step → separate component in `steps/`, own zod schema in `validations/`
- Step state → `useState` in orchestrator (not Redux unless requested)
- `<FormValidationDebugger />` as last child (dev only)

## Styling
- Raw Tailwind colors forbidden: `text-red-500`, `bg-gray-*`, `bg-white` etc.
- Use tokens: `text-foreground`, `text-muted-foreground`, `text-destructive`, `bg-background`, `bg-muted`, `bg-card`, `border-border`
- `space-y/x-*` → `flex gap-*` | `w-4 h-4` → `size-4` | no inline `style={{}}` | no `dark:` prefix

## Responsive (mobile-first required)
- Always start with mobile base, then `sm:` → `md:` → `lg:`
- Fixed px widths forbidden on containers — use `w-full`, `max-w-*`, `flex`, `grid`
- Touch targets min 44px → `min-h-11` on interactive elements
- Grids must collapse: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Layout direction: `flex-col md:flex-row`
- No horizontal scroll on mobile — always check overflow

## TypeScript
- `any` → forbidden, use `unknown` + narrowing
- `// @ts-ignore` → forbidden
- Non-null `!` → avoid, use `?.` or explicit guard
- Props → always a separate named interface, never inline

## Naming
- Components, types, interfaces → PascalCase
- Variables, functions, hooks → camelCase
- Booleans → `is/has/can/should` prefix
- Handlers → `handle` prefix
- Folders → kebab-case | Constants → SCREAMING_SNAKE_CASE
- API fields (backend) → snake_case, leave as-is

## Accessibility
- Icon-only buttons → `aria-label` required
- Screen-reader text → `<span className="sr-only">`
- Form inputs → always with `<FormLabel>`
- Error/warning → never color alone, add icon or text

## Performance
- memo/useMemo/useCallback → only with profiler evidence
- `React.memo` → only when parent re-renders often AND render is expensive
- `useMemo` → only for genuinely heavy computation, not simple filter/map
- `useCallback` → only when passed to memo'd child or used in dependency array
