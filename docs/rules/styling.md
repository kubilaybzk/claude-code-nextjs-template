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
