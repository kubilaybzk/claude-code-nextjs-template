# Shared Component Registry

Before writing any new component, check this list. If a component exists here, use it — do not rewrite.

## Available Components

### `EmptyState`
**Import:** `@/components/shared/EmptyState`
**Use when:** A list or page has no data to display.
**Props:** `title` (required) · `description` · `action` (ReactNode) · `icon` (ReactNode)

### `ErrorState`
**Import:** `@/components/shared/ErrorState`
**Use when:** A data fetch fails (`isError` is true).
**Props:** `title` (required) · `description` · `action` (ReactNode)

---

*Add every new shared component here when it is created.*
