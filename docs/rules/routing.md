# App Router — Route Anatomy

`app/` klasörü ince bir sarmalayıcıdır. Business logic, veri çekme ve state buraya gelmez.

## Dosya Sorumlulukları

| Dosya | Sorumluluk |
|---|---|
| `page.tsx` | Yalnızca feature section'ı import edip render eder |
| `layout.tsx` | Route grubuna ait shell (sidebar, header, auth guard) |
| `loading.tsx` | Next.js Suspense boundary — sadece route geçişleri için skeleton |
| `error.tsx` | Next.js Error boundary — route düzeyinde kurtarma ekranı |

## `page.tsx` Yapısı

```tsx
// app/(dashboard)/companies/page.tsx
import { CompanyListPage } from "@/features/company"

export default function Page() {
  return <CompanyListPage />
}
```

Metadata gerekiyorsa:

```tsx
import type { Metadata } from "next"
import { CompanyListPage } from "@/features/company"

export const metadata: Metadata = {
  title: "Şirketler",
}

export default function Page() {
  return <CompanyListPage />
}
```

## `loading.tsx` vs Skeleton Component

`loading.tsx` yalnızca **route geçişi** sırasında Next.js tarafından gösterilir.
Component düzeyindeki yükleme (`isLoading`) için `loading.tsx` kullanılmaz — skeleton component yazılır.

```
// Route geçişi    → loading.tsx   (otomatik, Suspense)
// isLoading true  → <MySkeleton /> (manuel, React Query)
```

## `error.tsx` Yapısı

Route düzeyinde beklenmedik hataları yakalar. React Query `isError` ile karıştırılmaz.

```tsx
"use client"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="Beklenmedik bir hata oluştu"
      action={<Button onClick={reset}>Tekrar Dene</Button>}
    />
  )
}
```
