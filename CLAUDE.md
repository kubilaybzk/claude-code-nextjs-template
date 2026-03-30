# Project Guide

## Stack

Next.js (App Router) · shadcn/ui (radix-vega) · TanStack Query · Redux Toolkit · Axios
Path alias: `@/*` → `src/*`

## Canonical Docs (source of truth)

- Architecture, folder structure, component placement → `docs/architecture.md`
- **Shared component registry (read before writing any feature)** → `docs/shared-components.md`
- Naming conventions → `docs/rules/naming.md`
- Data fetching & state management → `docs/rules/data.md`
- User feedback (skeleton/empty/error/toast) → `docs/rules/feedback.md`
- App Router anatomy, route checklist, barrel exports → `docs/rules/routing.md`
- Component rules & performance guidance → `docs/rules/components.md`
- Step forms (react-hook-form + zod) → `docs/rules/forms.md`
- Styling (design tokens, Tailwind constraints) → `docs/rules/styling.md`
- TypeScript strictness & API types → `docs/rules/typescript.md`
- Accessibility minimums → `docs/rules/a11y.md`

## Skills

- **frontend-design** (`.agents/skills/frontend-design/SKILL.md`) — applied to every component and page. Before writing UI code, go through design thinking: purpose, tone, differentiation.

## Key Rules (always apply) — short guardrails

- `docs/architecture.md`: `app/` thin wrapper only (page.tsx ~15 lines), component placement decision tree
- `components/ui/`: never modify (shadcn primitives)
- `docs/rules/data.md`: backend operations via React Query only; no direct API calls in components; no server-state in Redux
- `docs/rules/routing.md`: every route has `page.tsx` + `loading.tsx` + `error.tsx` + `not-found.tsx`; barrel-only imports from features
- `docs/rules/components.md`: one component per file; `ComponentErrorBoundary` per data component; debounce for text search; no premature memoization
- `docs/rules/typescript.md`: no `any`, no `// @ts-ignore`, avoid non-null `!`, explicit named props interfaces
- `docs/rules/styling.md`: no raw Tailwind colors; use semantic tokens; `space-*` → `gap-*`, `w/h-*` → `size-*`
- `docs/rules/feedback.md`: loading = skeleton (no spinner); empty/error states via shared components; mutations toast with `sonner`
- `docs/rules/a11y.md`: icon-only buttons require `aria-label`; forms require labels
