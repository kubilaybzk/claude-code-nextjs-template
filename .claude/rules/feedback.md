---
globs: ["**/*Loading*", "**/*loading*", "**/*Skeleton*", "**/*skeleton*", "**/*Error*", "**/*error*", "**/*Empty*", "**/*empty*", "**/sections/**"]
description: Loading skeleton, empty state, error state, toast notification kuralları
alwaysApply: false
---

# Feedback State Kuralları

## Her Data-Fetching Component'te 3 State Zorunlu
Sıralama: `isLoading` → `isError` → empty check → render

## Loading
- Skeleton component kullan (final layout şeklini taklit et)
- Spinner **yasak**
- Route seviyesi: `loading.tsx` (Suspense boundary)

## Error
- `<ErrorState title="..." action={<Button onClick={refetch}>Tekrar Dene</Button>} />`
- Component seviyesi: `<ComponentErrorBoundary>` ile sar

## Empty
- `<EmptyState title="..." description="..." action={<Button>Oluştur</Button>} />`

## Toast (sonner)
- `toast.success()`: mutation başarılı
- `toast.error()`: mutation hatası, server hataları (5xx, network)
- Form validation hatası toast ile gösterilmez → inline `<FormMessage />`

## Özet Tablo
| Durum | Kanal |
|-------|-------|
| Form validation | Inline `<FormMessage />` |
| Mutation başarı | `toast.success()` |
| Mutation hata | `toast.error()` |
| Server error (5xx) | `toast.error()` |
| Network error | `toast.error()` |
| Liste boş | `<EmptyState />` |
| Veri çekme hatası | `<ErrorState />` |
| Yükleniyor | Skeleton |
