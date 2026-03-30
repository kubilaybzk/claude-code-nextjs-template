# Barrel Export & Import Rules

Her feature dışarıya yalnızca `index.ts` üzerinden açılır. Doğrudan iç path import yasaktır.

## Kural

```ts
// ✗ Forbidden — iç path'e doğrudan erişim
import { CompanyCard } from "@/features/company/sections/companyList/components/CompanyCard"
import { useCompanies } from "@/features/company/sections/companyList/hooks/useCompanies"

// ✓ Correct — barrel üzerinden
import { CompanyCard, useCompanies } from "@/features/company"
```

## `index.ts` Neyi Export Etmeli?

Yalnızca başka feature veya `app/` katmanının kullanacağı şeyler export edilir.
Feature içi bileşenler (`sections/`, `components/`) dışarıya açılmaz.

```ts
// features/company/index.ts

// ✓ Dışarıya açılan — başka feature veya app/ kullanıyor
export { CompanyListPage } from "./sections/companyList/CompanyListPage"
export { CreateCompanyPage } from "./sections/createCompany/CreateCompanyPage"
export type { Company } from "./types/company.types"

// ✗ Buraya eklenmez — feature-internal
// export { CompanyCard } from "./sections/companyList/components/CompanyCard"
// export { basicInfoSchema } from "./validations/basicInfoSchema"
```

## `components/shared/` ve `services/` İçin

Bu dizinler feature değildir, barrel zorunluluğu yoktur. Doğrudan import yapılabilir.

```ts
import { EmptyState } from "@/components/shared/EmptyState"
import { DataTable } from "@/components/shared/DataTable"
```
