# Privia Base Template

Next.js (App Router) base template with shadcn/ui, TanStack Query, Redux Toolkit, and a built-in Claude Code agent system.

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated

### 1. Clone & Install

```bash
git clone <repo-url> my-project
cd my-project
pnpm install
```

---

## Project Setup with Claude Code

This template is designed to work with Claude Code from day one. Follow these steps in order after cloning.

### Step 1 — Introduce Your Project

Open Claude Code in the project root and describe your project. Claude will save the context to `CLAUDE.md`.

```
claude

> This is [Project Name], a [brief description].
> The backend API is at [URL]. Main entities are [X, Y, Z].
> Save this to CLAUDE.md.
```

Claude will update `CLAUDE.md` with your project-specific details (API base URL, domain entities, team conventions) while preserving the existing architecture rules.

### Step 2 — Set Up Your Color Palette

The template ships with default shadcn grayscale tokens in `src/app/globals.css`. You need to customize them for your brand.

**Option A — You have a brand palette:**

```
> Here is my color palette:
> Primary: #2563EB (blue-600)
> Destructive: #DC2626 (red-600)
> Success: #16A34A (green-600)
> Warning: #F59E0B (amber-500)
>
> Update globals.css with these colors as oklch values
> for both light and dark themes.
```

**Option B — You don't have a palette yet:**

```
> Generate a professional color palette for a [healthcare/fintech/e-commerce] app.
> Apply it to globals.css with oklch values for light and dark themes.
> Use the existing token structure (--primary, --secondary, --accent, --destructive, etc.)
```

Claude will update the `:root` and `.dark` sections in `globals.css`, converting your hex/rgb values to oklch.

### Step 3 — Update Ruleset with Your Palette

After the palette is set, have Claude register the new tokens in the styling rules:

```
> Review the color palette in globals.css.
> Update docs/rules/styling.md to document the allowed semantic tokens
> and their intended usage (e.g., --success for positive states, --warning for alerts).
> Also update .claude/QUICK_REF.md styling section if needed.
```

This ensures all agents and future development follow your palette — no raw Tailwind colors, only your semantic tokens.

### Step 4 — Start Development

Now you're ready to build features. Here's how to work with the agent system:

---

## Working with Claude Code

### Architecture Overview

```
src/
├── app/                    # Thin route wrappers (~15 lines per page.tsx)
│   └── (dashboard)/
│       └── companies/
│           ├── page.tsx        # Imports from features, nothing else
│           ├── loading.tsx     # Skeleton UI
│           ├── error.tsx       # Error boundary
│           └── not-found.tsx   # 404 state
├── features/               # Business logic lives here
│   └── company/
│       ├── index.ts            # Public barrel (only export pages + types)
│       ├── sections/
│       │   ├── index.ts        # Section barrel (always update when adding)
│       │   └── company-list/
│       │       ├── CompanyListPage.tsx
│       │       ├── components/
│       │       └── steps/      # For multi-step forms
│       ├── validations/        # Zod schemas
│       ├── constants/
│       └── utils/
├── components/
│   ├── ui/                 # shadcn primitives — NEVER modify
│   └── shared/             # Reusable components (EmptyState, ErrorState, etc.)
├── services/               # API service files (Axios)
└── lib/
    ├── api-client.ts       # Axios instance
    └── query-keys.ts       # Centralized query key registry
```

### Using Agents

The template includes a custom agent team in `.claude/agents/`. These agents enforce project rules automatically.

#### Create a New Feature

```
> @feature-scaffolder Create a "company" feature with sections: company-list, create-company
```

This generates the full folder structure, barrel exports, route files (`page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`), and a ready-to-use feature skeleton.

#### Build a Component

```
> Build a CompanyList section that displays companies in a DataTable
> with search, pagination, and delete action.
```

Claude will automatically:
1. Check `docs/shared-components.md` for existing components to reuse
2. Follow the placement decision tree in `docs/architecture.md`
3. Use semantic design tokens (never raw Tailwind colors)
4. Add error boundaries, loading skeletons, and empty states
5. Ensure mobile-first responsive layout

#### Validate Your Code

```
> @verify Check the company feature for rule violations
```

The verify agent runs:
- `tsc --noEmit` for type errors
- Checks for forbidden patterns (`any`, `@ts-ignore`, `<img>`, `console.log`, raw colors)
- Validates barrel exports and route file completeness

### Key Rules (Always Enforced)

| Rule | Details |
|---|---|
| **No raw Tailwind colors** | Use `text-foreground`, `bg-muted`, `text-destructive` etc. |
| **Server Components first** | `'use client'` only when real interactivity is needed |
| **React Query for all data** | No direct API calls in components, no server state in Redux |
| **Error boundaries per component** | Each data-fetching component wrapped individually |
| **Mobile-first responsive** | Base = mobile, scale up with `sm:` `md:` `lg:` |
| **One component per file** | `index.tsx` as component filename is forbidden |
| **Forms = react-hook-form + zod** | Each step gets its own schema and component |
| **No premature optimization** | `memo`/`useMemo`/`useCallback` only with profiler evidence |

### Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint check

# With Claude Code
claude                # Open Claude Code in terminal
/compact              # Compress conversation context
/model default        # Switch to default model
```

---

## Documentation Map

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project guide — stack, doc links, key rules |
| `.claude/QUICK_REF.md` | Condensed rules for agents (~100 lines) |
| `.claude/agents/*.md` | Agent role definitions |
| `docs/architecture.md` | Folder structure, placement decision tree |
| `docs/shared-components.md` | Component registry — check before writing any component |
| `docs/rules/components.md` | Component patterns, error boundaries, performance |
| `docs/rules/data.md` | React Query, state management, query keys |
| `docs/rules/styling.md` | Design tokens, Tailwind constraints, responsive |
| `docs/rules/routing.md` | Route anatomy, barrel exports |
| `docs/rules/forms.md` | Step forms, zod schemas |
| `docs/rules/feedback.md` | Loading/empty/error states, toast notifications |
| `docs/rules/naming.md` | Naming conventions |
| `docs/rules/typescript.md` | Type safety rules |
| `docs/rules/a11y.md` | Accessibility minimums |

---

## License

Private — All rights reserved.
