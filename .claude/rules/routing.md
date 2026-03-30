---
globs: ["src/app/**/*.tsx", "src/app/**/*.ts"]
description: Route dosya yapısı, page.tsx anatomy, loading/error/not-found zorunlulukları
alwaysApply: false
---

# Routing Kuralları

## app/ Thin Wrapper
- `page.tsx`: max ~15 satır, sadece feature section import et ve render et
- `layout.tsx`: route group shell (sidebar, header, auth guard)
- İş mantığı, state, fetch **asla** `app/` içinde olmaz

## Her Route Klasörü Zorunlu Dosyalar
```
app/(group)/feature-name/
├── page.tsx        # Feature section import + render
├── loading.tsx     # Suspense boundary (skeleton)
├── error.tsx       # Route-level error recovery
└── not-found.tsx   # 404 ekranı
```

## Barrel Export
- Her feature'da `index.ts` olmalı, main component export et
- `app/` dosyalarından import: sadece `@/features/[name]`
- Deep path import yasak (`@/features/x/components/y` gibi)

## Component Yerleştirme Kararı
1. Sadece bir section'da mı kullanılıyor? → `features/{name}/sections/{section}/components/`
2. Aynı feature'ın 2+ section'ında mı? → `features/{name}/components/`
3. Cross-feature mı? → `components/shared/`
4. shadcn primitive mi? → `components/ui/` (değiştirme)

## HTTP Hata Yönlendirme
| Kod | Aksiyon |
|-----|---------|
| 400 | Inline alert |
| 401 | Login'e redirect |
| 403 | Erişim engellendi sayfası |
| 404 | `not-found.tsx` |
| 500 | Toast notification |
