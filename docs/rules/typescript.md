# TypeScript Rules

## No `any`

`any` kullanımı yasaktır. Tipi bilinmiyorsa `unknown` kullanılır ve narrowing yapılır.

```ts
// ✗ Forbidden
function handle(data: any) { ... }

// ✓ Correct
function handle(data: unknown) {
  if (typeof data === 'string') { ... }
}
```

## Explicit Props Interface

Component props'ları her zaman ayrı bir interface olarak tanımlanır. Inline type yasak.

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

Backend'den gelen veri tipleri `services/[Name]Service.ts` içinde tanımlanır.
Component'e ulaşana kadar type-safe olmalıdır.

```ts
// services/CompanyService.ts
export interface Company {
  id: string
  name: string
  created_at: string   // snake_case — backend'den geldiği gibi bırakılır
}

export interface GetCompaniesResponse {
  data: Company[]
  total: number
}
```

## Non-null Assertion

`!` (non-null assertion) kullanımından kaçınılır. Optional chaining `?.` veya explicit guard tercih edilir.

```ts
// ✗ Avoid
const name = user!.name

// ✓ Correct
const name = user?.name ?? ''
```
