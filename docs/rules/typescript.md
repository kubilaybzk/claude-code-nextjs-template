# TypeScript Rules

## No `any`

`any` is forbidden. Use `unknown` and narrow the type explicitly.

```ts
// ✗ Forbidden
function handle(data: any) { ... }

// ✓ Correct
function handle(data: unknown) {
  if (typeof data === 'string') { ... }
}
```

## Explicit Props Interface

Component props must always be defined as a separate named interface. Inline types are forbidden.

```tsx
// ✗ Forbidden
export function CompanyCard({ name, id }: { name: string; id: string }) { ... }

// ✓ Correct
interface CompanyCardProps {
  name: string
  id: string
}

export function CompanyCard({ name, id }: CompanyCardProps) { ... }
```

## API Response Types

API response types are defined in `services/[Name]Service.ts`.
Data must be type-safe before it reaches any component.

```ts
// services/CompanyService.ts
export interface Company {
  id: string
  name: string
  created_at: string   // snake_case — left as-is from the backend
}

export interface GetCompaniesResponse {
  data: Company[]
  total: number
}
```

## Non-null Assertion

Avoid the `!` non-null assertion. Prefer optional chaining `?.` or an explicit guard.

```ts
// ✗ Avoid
const name = user!.name

// ✓ Correct
const name = user?.name ?? ''
```
