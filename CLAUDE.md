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
- **frontend-design** (`.agents/skills/frontend-design/SKILL.md`) — her component ve sayfa geliştirmesinde bu skill uygulanır. UI kodu yazılmadan önce design thinking adımı yapılır: purpose, tone, differentiation.

## Key Rules (always apply)
- `app/` is thin wrappers only — no business logic
- `components/ui/` is never modified
- All backend operations use React Query, never direct API calls in components
- One component per file
- JSDoc on every exported component and function
- No raw Tailwind color utilities (`text-red-500` etc.) — use design tokens
- Feature `store/` only when explicitly requested
- Empty state → `<EmptyState />` from `@/components/shared/EmptyState`
- Error state → `<ErrorState />` from `@/components/shared/ErrorState`
- Loading state → skeleton component (never spinner for content areas)
- No `any` — use `unknown` + narrowing
- Mutation success/error → `sonner` toast; form validation errors → inline only
- Feature imports always via `index.ts` barrel — no direct internal paths
- Icon-only buttons must have `aria-label`
- No memo/useMemo/useCallback without profiler evidence — measure first, optimize second
