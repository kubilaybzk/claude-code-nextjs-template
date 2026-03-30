# Naming Conventions

| Context | Convention | Example |
|---|---|---|
| Variables, functions, hook params | camelCase | `companyId`, `totalCount` |
| Boolean variables | camelCase + `is/has/can/should` prefix | `isLoading`, `hasPermission`, `canEdit` |
| Event handlers | camelCase + `handle` prefix | `handleSubmit`, `handleDelete` |
| React components, types, interfaces, enums | PascalCase | `CompanyCard`, `UserRole` |
| Custom hooks | camelCase + `use` prefix | `useCompanies`, `useCreateCompany` |
| Global constants | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE` |
| Files — components | PascalCase | `CompanyCard.tsx`, `CreateCompanyPage.tsx` |
| Files — hooks, utils, services, queries | camelCase | `company.queries.ts`, `formatDate.ts` |
| Folders | kebab-case | `company-list/`, `user-profile/` |
| API response fields (from backend) | snake_case — leave as-is | `created_at`, `company_id` |

## Forbidden

- `index.tsx` as a filename is forbidden — use the component name (`CompanyCard.tsx`)
- `index.ts` is reserved for barrel exports only
