# Barrel Export & Import Rules

Every feature exposes its public API only through `index.ts`. Direct internal path imports are forbidden.

## Rule

```ts
// ✗ Forbidden — direct internal path
import { CompanyCard } from "@/features/company/sections/companyList/components/CompanyCard"
import { useCompanies } from "@/features/company/sections/companyList/hooks/useCompanies"

// ✓ Correct — via barrel
import { CompanyCard, useCompanies } from "@/features/company"
```

## What Should `index.ts` Export?

Only export what other features or the `app/` layer need.
Internal components (`sections/`, `components/`) are not exported.

```ts
// features/company/index.ts

// ✓ Public API — used by other features or app/
export { CompanyListPage } from "./sections/companyList/CompanyListPage"
export { CreateCompanyPage } from "./sections/createCompany/CreateCompanyPage"
export type { Company } from "./types/company.types"

// ✗ Do not export — feature-internal
// export { CompanyCard } from "./sections/companyList/components/CompanyCard"
// export { basicInfoSchema } from "./validations/basicInfoSchema"
```

## `components/shared/` and `services/`

These directories are not features — no barrel requirement. Direct imports are fine.

```ts
import { EmptyState } from "@/components/shared/EmptyState"
import { DataTable } from "@/components/shared/DataTable"
```
