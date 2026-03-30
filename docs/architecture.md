# Architecture

## Stack

- **Framework**: Next.js (App Router)
- **UI**: shadcn/ui (radix-vega style)
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: Redux Toolkit
- **HTTP Client**: axios via `src/lib/api-client.ts`
- **Path Alias**: `@/*` → `src/*`

## Folder Structure

```
src/
├── app/                        # Next.js App Router — thin wrappers only (no business logic)
│   ├── (public)/               # Unauthenticated routes
│   └── (dashboard)/            # Authenticated/protected routes
├── features/[name]/            # Feature modules (e.g. company, asset)
│   ├── components/             # Components shared across multiple sections of this feature
│   ├── sections/
│   │   └── [section]/          # e.g. createCompany, companyList
│   │       ├── *Page.tsx | *Provider.tsx
│   │       ├── components/     # Components used ONLY in this section
│   │       └── steps/          # Wizard steps (if applicable)
│   ├── validations/
│   ├── store/                  # Redux slice — only when explicitly needed
│   ├── constants/
│   ├── utils/
│   └── index.ts                # Feature public API (barrel export)
├── components/
│   ├── ui/                     # shadcn primitives — never modified directly
│   └── shared/                 # Cross-feature shared components
├── services/                   # API service classes (CompanyService.ts, etc.)
├── lib/
│   ├── api-client.ts           # Axios instance
│   ├── query-keys.ts           # All React Query keys in one place
│   └── [name].queries.ts       # React Query hooks per domain
├── store/                      # Redux configureStore + root reducer (setup only)
├── constants/                  # Platform-wide constants
├── hooks/                      # Shared custom hooks
└── utils/                      # Shared utility functions
```

## Component Placement

Ask: **"Can this component be used outside its current scope?"**

```
Used only in this section?           → features/[name]/sections/[section]/components/
Used in 2+ sections of this feature? → features/[name]/components/
Used across 2+ features?             → components/shared/
shadcn primitive?                    → components/ui/  (do not modify)
```

## Route Groups

- `(public)` — no auth required
- `(dashboard)` — requires authentication; layout handles session check

## Services & Query Pattern

```
services/[Name]Service.ts   → Raw API calls (axios only, no React)
lib/query-keys.ts           → Single source of truth for all query keys
lib/[name].queries.ts       → useQuery / useMutation hooks per domain
```
