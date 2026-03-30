# Project Guide

## Stack
Next.js (App Router) · shadcn/ui (radix-vega) · TanStack Query · Redux Toolkit · Axios
Path alias: `@/*` → `src/*`

## Docs
- Architecture, folder structure, component placement → `docs/architecture.md`
- Naming conventions (camelCase / PascalCase / snake_case) → `docs/rules/naming.md`
- React Query usage & cache invalidation → `docs/rules/react-query.md`
- State management (React Query vs Redux) → `docs/rules/state.md`
- Step forms (react-hook-form + zod) → `docs/rules/forms.md`
- Component rules (one per file, JSDoc) → `docs/rules/components.md`
- Styling (design tokens, no raw Tailwind colors) → `docs/rules/styling.md`
- Loading / Empty / Error states → `docs/rules/states.md`
- TypeScript strictness (no any, explicit props, API types) → `docs/rules/typescript.md`
- Notifications & toast pattern → `docs/rules/notifications.md`
- Barrel exports & feature imports → `docs/rules/barrel-exports.md`
- App Router anatomy (page / layout / loading / error) → `docs/rules/routing.md`
- Accessibility minimums (aria-label, sr-only, form labels) → `docs/rules/a11y.md`
- Performance (memo / useMemo / useCallback — when to use and when not to) → `docs/rules/performance.md`

## Skills
- **frontend-design** (`.agents/skills/frontend-design/SKILL.md`) — applied to every component and page. Before writing UI code, go through design thinking: purpose, tone, differentiation.

## Key Rules (always apply)
- `app/` is thin wrappers only — no business logic; max ~15 lines per page.tsx
- `components/ui/` is never modified
- All backend operations use React Query, never direct API calls in components
- One component per file; `index.tsx` filename forbidden — use component name
- JSDoc + `@example` on every exported component and function
- No raw Tailwind colors (`text-red-500` etc.) — use design tokens; `space-y/x-*` → `flex gap-*`; `w-4 h-4` → `size-4`
- Feature `store/` only when explicitly requested
- Empty state → `<EmptyState />` · Error state → `<ErrorState />` · Loading → skeleton (never spinner)
- No `any` — use `unknown` + narrowing; no `// @ts-ignore`; no non-null assertion `!`
- Mutation success/error → `sonner` toast; form validation → inline `<FormMessage />` only
- Feature imports always via barrel (`sections/index.ts`) — no direct internal paths
- Every route needs `loading.tsx` + `error.tsx` + `not-found.tsx`
- Every data-fetching component wrapped in `<ComponentErrorBoundary>`
- `<img>` forbidden — use `next/image`; `'use client'` only when interactivity needed
- Text search inputs require `useDebounce` (300ms)
- Icon-only buttons must have `aria-label`
- No memo/useMemo/useCallback without profiler evidence
