---
globs: ["src/features/**", "src/components/shared/**"]
description: Component mimarisi, error boundary, JSDoc, shared component registry, erişilebilirlik
alwaysApply: false
---

# Component Kuralları

## Temel İlkeler
- Bir dosya = bir component, PascalCase dosya adı = export adı
- `index.tsx` dosya adı yasak
- Props için ayrı `{ComponentName}Props` interface'i (inline type yasak)
- JSDoc zorunlu: her exported component, fonksiyon, interface ve type'a `@example` ile
- Yeni eklenen HER kod bloğuna (component, hook, helper, type) JSDoc yazılmalı — istisnasız
- Server Component varsayılan; `'use client'` sadece gerçek interaktivite için
- `<img>` yasak → `next/image` kullan, LCP için `priority` ekle

## Error Boundary
- Her data-fetching component'i `<ComponentErrorBoundary>` ile ayrı ayrı sar
- Tüm sayfayı tek boundary'e sarma

## Performans
- `memo`/`useMemo`/`useCallback` sadece profiler kanıtıyla
- Text search input'larında `useDebounce(value, 300)` kullan (manuel setTimeout yasak)

## Yasaklar
- `console.log`, `@ts-ignore`, magic number
- IP adresleri `font-mono` olmadan gösterilmez

## Dev Helper
- Her forma `<FormValidationDebugger />` ekle (son child olarak)

---

# Shared Component Registry

Yeni component yazmadan ÖNCE bu listeyi kontrol et.

| Component | Konum | Kullanım |
|-----------|-------|----------|
| `EmptyState` | `components/shared/` | Liste boş olduğunda |
| `ErrorState` | `components/shared/` | Veri çekme hatası |
| `ComponentErrorBoundary` | `components/shared/` | Data-fetch component wrapper |
| `DataTable` | `components/shared/DataTable/` | Filtreleme/sıralama/pagination tablo |
| `DataTableSkeleton` | `components/shared/DataTable/` | DataTable loading placeholder |
| `Pagination` | `components/shared/` | Standalone sayfalama |
| `FormValidationDebugger` | `components/shared/` | Dev-only form state inspector |
| `RichTextEditor` | `components/shared/` | Tiptap tabanlı zengin metin editörü |

Yeni shared component oluşturduysan bu listeye ekle.

---

# Erişilebilirlik (A11y)

- Icon-only button → `aria-label` zorunlu
- Screen reader metni → `sr-only` class
- Her form input → `<FormLabel>` ile eşleştirilmeli
- Renk tek başına bilgi taşımaz → ikon veya metin ekle
