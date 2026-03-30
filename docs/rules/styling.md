# Styling Rules

Raw Tailwind color/spacing utilities are **forbidden**. Use semantic design tokens from the shadcn theme.

## Examples

```tsx
// ✗ Forbidden
<p className="text-red-500">Error</p>
<div className="bg-gray-100 p-4">...</div>

// ✓ Correct
<p className="text-destructive">Error</p>
<div className="bg-muted p-4">...</div>
```

## Allowed Tokens

| Purpose | Token |
|---|---|
| Primary text | `text-foreground` |
| Secondary / hint text | `text-muted-foreground` |
| Error / destructive | `text-destructive` |
| Primary action | `text-primary`, `bg-primary` |
| Page background | `bg-background` |
| Subtle background | `bg-muted` |
| Borders | `border-border` |
