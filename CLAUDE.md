
# Project Architecture

## Stack
- **Framework**: Next.js (App Router)
- **UI**: shadcn/ui (radix-vega style)
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: Redux Toolkit
- **HTTP Client**: axios via `src/lib/api-client.ts`

## Folder Structure

```
src/
├── app/                        # Next.js App Router — thin wrappers only (no business logic)
│   ├── (public)/               # Unauthenticated routes
│   └── (dashboard)/            # Authenticated/protected routes
├── features/[name]/            # Feature modules (e.g. company, asset)
│   ├── components/             # Components shared across multiple sections of this feature
│   ├── sections/               # Page / flow level sections
│   │   └── [section]/          # e.g. createCompany, companyList
│   │       ├── *Page.tsx | *Provider.tsx   # Section root
│   │       ├── components/                 # Components used ONLY in this section
│   │       └── steps/                      # Wizard steps (if applicable)
│   ├── validations/
│   ├── store/                  # Redux slice for this feature (when needed)
│   ├── constants/
│   ├── utils/
│   └── index.ts                # Feature public API (barrel export)
├── components/
│   ├── ui/                     # shadcn primitives — never modified directly
│   └── shared/                 # Cross-feature shared components (DataTable, PageHeader, etc.)
├── services/                   # API service classes (e.g. CompanyService.ts, AssetService.ts)
├── lib/
│   ├── api-client.ts           # Axios instance
│   ├── query-keys.ts           # All React Query keys in one place
│   └── [name].queries.ts       # React Query hooks per domain
├── store/                      # Redux configureStore + root reducer (setup only)
├── constants/                  # Platform-wide constants (statusCode, roles, etc.)
├── hooks/                      # Shared custom hooks
└── utils/                      # Shared utility functions
```

## Component Placement Decision Tree

Ask: **"Can this component be used outside its current scope?"**

```
Used only in this section?           → features/[name]/sections/[section]/components/
Used in 2+ sections of this feature? → features/[name]/components/
Used across 2+ features?             → components/shared/
shadcn primitive?                    → components/ui/  (do not modify)
```

## Services & Query Pattern

```
services/[Name]Service.ts     → Raw API calls (axios methods only, no React)
lib/query-keys.ts             → Single source of truth for all query keys
lib/[name].queries.ts         → useQuery / useMutation hooks for that domain
```

## State Management

- **Global store** (`src/store/`): `configureStore` + root reducer wiring only.
- **Feature store** (`features/[name]/store/`): `createSlice` definitions. Only create when a feature genuinely needs client-side state beyond React Query cache (e.g. wizard steps, multi-step form state).

## Route Groups

- `(public)` — no auth required
- `(dashboard)` — requires authentication; layout handles session check
- Route protection: optimistic cookie check in `proxy.ts` for redirects; Server Actions do their own auth verification.

## Path Alias

`@/*` resolves to `src/*` (configured in `tsconfig.json`).
