---
globs: ["**/*.ts", "**/*.tsx"]
description: TypeScript katılık kuralları ve isimlendirme convention'ları
alwaysApply: false
---

# TypeScript & İsimlendirme

## TypeScript Kuralları
- `any` yasak → `unknown` + narrowing
- `@ts-ignore` / `@ts-nocheck` yasak
- Non-null assertion `!` yasak → `?.` veya explicit guard
- Exported fonksiyonlarda explicit return type

## Props Interface
```tsx
export interface CompanyCardProps {
  company: Company
  onSelect: (id: string) => void
}
```
Inline type yasak, interface ismi `{ComponentName}Props`

## İsimlendirme Convention'ları

| Ne | Format | Örnek |
|----|--------|-------|
| Component / Type / Interface | PascalCase | `CompanyListPage.tsx` |
| Hook | camelCase + `use` prefix | `useDebounce.ts` |
| Service | PascalCase + Service | `QuizService.ts` |
| Değişken / fonksiyon | camelCase | `handleSubmit` |
| Boolean | `is/has/can/should` prefix | `isLoading` |
| Event handler | `handle` prefix | `handleClick` |
| Sabit (değer) | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Klasör | kebab-case | `company-list/` |
| Zod schema | camelCase + Schema | `createQuestionSchema` |
| API response field | snake_case (backend'den geldiği gibi) | `created_at` |

## Export
- Named export only (`export default` yasak)
- Barrel export: sadece feature root ve sections root'ta `index.ts`
- `index.tsx` dosya adı olarak yasak (component adını kullan)
