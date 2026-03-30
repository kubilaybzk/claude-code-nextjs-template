# Styling Rules

## Design Tokens

Raw Tailwind color utilities are forbidden. Use semantic design tokens from the shadcn theme.

```tsx
// ✗ Forbidden
<p className="text-red-500">Error</p>
<div className="bg-gray-100 bg-white bg-[#1a1a2e]">...</div>

// ✓ Correct
<p className="text-destructive">Error</p>
<div className="bg-muted">...</div>
```

## Tailwind Forbidden Patterns

| Forbidden | Use instead |
|---|---|
| `text-red-500`, `bg-blue-100` etc. | `text-destructive`, `bg-muted` etc. |
| `dark:` prefix | `bg-background`, `text-foreground` (tokens handle dark mode) |
| `space-y-*`, `space-x-*` | `flex gap-*` |
| `w-4 h-4` | `size-4` |
| `bg-white`, `bg-gray-*` | `bg-background`, `bg-card`, `bg-muted` |
| Inline `style={{ }}` | Tailwind class |

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

## Responsive Design

Mobile-first is required. Start with the base (mobile) style, then scale up with breakpoints.

```tsx
// ✗ Forbidden — desktop-first
<div className="flex-row md:flex-col">

// ✓ Correct — mobile-first
<div className="flex-col md:flex-row">
```

### Breakpoints (Tailwind defaults)
| Prefix | Min-width |
|---|---|
| *(none)* | 0px — mobile base |
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

### Rules

- Fixed pixel widths (`w-[320px]`) are forbidden for layout containers — use `w-full`, `max-w-*`, `flex`, or `grid`
- Touch targets must be at least 44px tall — use `min-h-11` on interactive elements
- Text must be readable without zoom — minimum `text-sm` (14px) for body content
- Horizontal scroll on mobile is forbidden — always check overflow
- Grid columns must collapse: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Stacked on mobile, side-by-side on desktop: `flex-col md:flex-row`
