---
globs: ["src/services/**", "src/lib/query-keys.ts", "src/lib/*-client.ts", "**/*.queries.ts", "**/*.service.ts", "**/store/**"]
description: React Query hook'ları, API client pattern, query key yönetimi, Redux (sadece UI state)
alwaysApply: false
---

# Veri & State Kuralları

## Server State → React Query (TanStack Query)
- Tüm backend operasyonları React Query ile
- Component içinde doğrudan API çağrısı yasak → service hook kullan
- React Query cache = single source of truth

## Service Dosya Pattern'i
Konum: `src/services/{Feature}Service.ts`

```tsx
// Query hook'ları
export function useGet{Entity}List(filters) { ... }
export function useGet{Entity}Detail(id) { ... }

// Mutation hook'ları
export function useCreate{Entity}() { ... }
export function useUpdate{Entity}(id) { ... }
export function useDelete{Entity}(id) { ... }
```

## Query Key Yönetimi
- Tüm key'ler `src/lib/query-keys.ts`'den import edilir
- Inline string key yasak
- Hiyerarşi: `[domain, scope, ...params]`
- Üst key invalidate edildiğinde alt key'ler de temizlenir

## Mutation Sonrası
- `onSuccess` callback'inde ilgili query key'i **mutlaka** invalidate et
- Gerekirse `onSettled` kullan

## Client State → Redux
- Sadece client-side UI state (sidebar açık/kapalı, wizard adımı, vb.)
- Server data asla Redux'ta tutulmaz
- Feature store: `features/{name}/store/` — sadece açıkça istendiğinde oluştur
- Global store: `src/store/` — sadece configureStore + root reducer

## API Client
- Custom fetch-based client (`src/lib/*-client.ts`)
- Auth: cookie token ile
- Array param'lar repeated key olarak gönderilir
