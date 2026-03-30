# Privia Base Template

Next.js App Router + React 19 + TypeScript 5 + Tailwind 4 + shadcn/ui | **pnpm**

## Mimari (3 katman)

| Katman | Konum | Sorumluluk |
|--------|-------|------------|
| Route | `src/app/` | Thin wrapper (~15 satır), sadece feature import eder |
| Feature | `src/features/{name}/` | Tüm iş mantığı: page component, sub-components, types |
| Shared | `src/components/shared/` | Cross-feature yeniden kullanılabilir component'ler |
| UI | `src/components/ui/` | shadcn primitive'leri — **ASLA değiştirme** |
| Service | `src/services/` | API servisleri + React Query hook'ları |
| Lib | `src/lib/` | Utility'ler, query-keys, API client'lar |

## Evrensel Kurallar (her zaman geçerli)

- `any` yasak → `unknown` + narrowing kullan
- Raw Tailwind renkleri yasak → semantic token kullan (`text-foreground`, `bg-muted`, vb.)
- `console.log`, `@ts-ignore`, `@ts-nocheck` yasak
- Server Component varsayılan; `'use client'` sadece interaktivite gerektiğinde
- Bir dosya = bir component, dosya adı `index.tsx` olamaz
- Import alias: `@/*` → `./src/*`

## Komutlar

```bash
pnpm dev      # geliştirme
pnpm build    # production build
pnpm lint     # linting
```

## Çalışma Prensibi — ZORUNLU

### Varsayılan: Hızlı mod (feature/component/sayfa geliştirme)
Kullanıcı dosya veriyorsa veya ne yapılacağı belliyse:
1. Verilen dosyaları tekrar okuma — zaten context'te
2. Referans gerekiyorsa → `Glob` + `Read` ile tek bir benzer dosya oku
3. Shared component kontrolü → `ls src/components/shared/`
4. **Hemen kod yaz** — en fazla 3-5 dosya oku, 10'dan fazla araştırma tool call yapma

### İstisna: Explore agent sadece şu durumlarda kullanılabilir
- Bug/hata araştırması (root cause birden fazla dosyada olabilir)
- Cross-feature refactoring (etki alanı belirsiz)
- Kullanıcı açıkça "araştır", "incele", "bul" dediğinde
- Codebase'de hiç örnek yokken ilk kez bir pattern oluşturulacaksa

## Referans Sayfalar

Yeni bir sayfa/feature oluştururken önce bu referansları oku ve aynı pattern'i takip et:

| Tür | Referans dosya | Ne öğretir |
|-----|---------------|------------|
| Liste (tablo + kart) | `src/features/users/UserListSection.tsx` | DataTable, card grid, view toggle, arama, loading/error/empty state |
| Kolon tanımları | `src/features/users/components/UserListColumns.tsx` | DataTableColumn tipi, responsive, actions |
| Kart component | `src/features/users/components/UserCard.tsx` | Card layout, hover actions, icon kullanımı |
| Kart skeleton | `src/features/users/components/UserCardSkeleton.tsx` | Skeleton pattern |
| Service | `src/services/UserService.ts` | Query/mutation hook'ları, interface tanımları |
| API client | `src/lib/api-client.ts` | Generic HTTP client oluşturma |
| Route dosyaları | `src/app/(dashboard)/users/` | page, loading, error, not-found dosyaları |

## Kural Sistemi

Context-specific kurallar `.claude/rules/` altında glob pattern'leriyle otomatik yüklenir.
Sadece dokunulan dosyayla eşleşen kurallar context'e dahil edilir.
