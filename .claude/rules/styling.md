---
globs: ["**/*.css", "tailwind.config.*", "src/components/ui/**"]
description: Design token'ları, Tailwind kısıtlamaları, responsive pattern'ler
alwaysApply: false
---

# Stil Kuralları

## Semantic Token Zorunluluğu
Raw Tailwind renkleri **yasak** (`text-red-500`, `bg-gray-100`, vb.)

Kullanılabilir token'lar:
`primary` · `secondary` · `accent` · `muted` · `destructive` · `card` · `popover` · `background` · `foreground` · `border` · `input` · `ring` · `chart-1`…`chart-5`

Pattern: `bg-{token}`, `text-{token}-foreground`, `border-{token}`

## Tailwind Yasakları
| Yasak | Yerine |
|-------|--------|
| `space-x-*` / `space-y-*` | `flex gap-*` |
| `w-4 h-4` | `size-4` |
| inline `style={{}}` | Tailwind class |
| `dark:` prefix | CSS variable ile otomatik |

## Conditional Class
`cn()` utility'si kullan (`@/lib/utils`)

## Responsive Design
- Mobile-first: base → `sm:` → `md:` → `lg:`
- Container'larda fixed px genişlik yasak
- Touch target: `min-h-11`
- Mobilde horizontal scroll yasak
- Grid collapse: mobilde tek kolon

## Tipografi
- `font-sans` (Inter), `font-mono` (Geist Mono), `font-heading`
- Radius token'ları: `rounded-sm` … `rounded-4xl`

## Icon
- Kaynak: `lucide-react`
- Button icon: `data-icon="inline-start"` veya `data-icon="inline-end"`

## Dokunma
- `src/components/ui/` dosyalarını **ASLA** değiştirme (shadcn managed)
