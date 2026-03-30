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

## Key Rules (always apply)
- `app/` is thin wrappers only — no business logic
- `components/ui/` is never modified
- All backend operations use React Query, never direct API calls in components
- One component per file
- JSDoc on every exported component and function
- No raw Tailwind color utilities (`text-red-500` etc.) — use design tokens
- Feature `store/` only when explicitly requested
