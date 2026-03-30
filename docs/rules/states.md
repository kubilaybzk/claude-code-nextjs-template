# Loading / Empty / Error States

## Loading — Skeleton

Content alanlarında spinner kullanılmaz. Her liste veya kart alanı için bir skeleton component yazılır.
Skeleton, gerçek component ile aynı layout boyutlarını korumalıdır.

```tsx
// ✗ Forbidden
if (isLoading) return <Spinner />

// ✓ Correct
if (isLoading) return <CompanyListSkeleton />
```

Skeleton dosyası, gerçek component'in yanına konur:

```
sections/companyList/components/
├── CompanyCard.tsx
└── CompanyCardSkeleton.tsx
```

## Empty State

Veri yoksa `<EmptyState />` kullanılır. Inline mesaj veya koşullu render yasak.

```tsx
import { EmptyState } from "@/components/shared/EmptyState"

if (!data?.length) {
  return (
    <EmptyState
      title="Henüz şirket eklenmedi"
      description="İlk şirketi eklemek için aşağıdaki butona tıklayın."
      action={<Button onClick={onAdd}>Şirket Ekle</Button>}
    />
  )
}
```

Props:
- `title` — zorunlu, kısa başlık
- `description` — isteğe bağlı, kullanıcıya ne yapacağını anlat
- `action` — isteğe bağlı, CTA butonu
- `icon` — isteğe bağlı, özel ikon

## Error State

React Query `isError` durumunda `<ErrorState />` kullanılır. Hata sessizce geçiştirilemez.

```tsx
import { ErrorState } from "@/components/shared/ErrorState"

if (isError) {
  return (
    <ErrorState
      title="Veriler yüklenemedi"
      description="Lütfen tekrar deneyin veya sayfayı yenileyin."
      action={<Button variant="outline" onClick={() => refetch()}>Tekrar Dene</Button>}
    />
  )
}
```

## Sıralama

React Query verisi olan her component'te kontrol sırası şu şekilde olmalıdır:

```tsx
if (isLoading) return <MySkeleton />
if (isError)   return <ErrorState title="..." />
if (!data?.length) return <EmptyState title="..." />

return <MyList data={data} />
```
