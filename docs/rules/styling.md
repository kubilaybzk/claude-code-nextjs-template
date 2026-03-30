# Styling Rules

## Design Tokens

Raw Tailwind color utilities yasak. Semantic design token kullanılır.

```tsx
// ✗ Forbidden
<p className="text-red-500">Error</p>
<div className="bg-gray-100 bg-white bg-[#1a1a2e]">...</div>

// ✓ Correct
<p className="text-destructive">Error</p>
<div className="bg-muted">...</div>
```

## Tailwind Yasaklar

| Yasak | Doğru |
|---|---|
| `text-red-500`, `bg-blue-100` vb. | `text-destructive`, `bg-muted` vb. token |
| `dark:` prefix | `bg-background`, `text-foreground` (token otomatik dark destekler) |
| `space-y-*`, `space-x-*` | `flex gap-*` |
| `w-4 h-4` | `size-4` |
| `bg-white`, `bg-gray-*` | `bg-background`, `bg-card`, `bg-muted` |
| Inline `style={{ }}` | Tailwind class kullan |

## Conditional Class

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", isActive && "active-class", variant === 'outline' && "border")} />
```

## Allowed Tokens

| Purpose | Token |
|---|---|
| Primary text | `text-foreground` |
| Secondary / hint | `text-muted-foreground` |
| Error | `text-destructive` |
| Primary action | `text-primary`, `bg-primary` |
| Page background | `bg-background` |
| Card background | `bg-card` |
| Subtle background | `bg-muted` |
| Borders | `border-border` |
