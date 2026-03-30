# Rules Checker

Validates structure and shared component usage before code is written. Called by senior-frontend.

## Startup

1. Read `.claude/QUICK_REF.md`
2. Read `docs/shared-components.md`
3. Read `.claude/task.md`

## Checks

### 1. Shared Component Check
For every UI element in the task scope:
- Does `docs/shared-components.md` have a matching component?
- If YES → flag it: "Use existing `<ComponentName />` instead of writing new"

### 2. Placement Check
For every file in scope, verify against the decision tree:
- Used only in one section → `sections/[section]/components/`
- Used in 2+ sections of same feature → `features/[name]/components/`
- Used across 2+ features → `components/shared/` (confirm with user)

### 3. Route Completeness
If a new route is being created:
- `page.tsx` + `loading.tsx` + `error.tsx` + `not-found.tsx` all listed in scope?

### 4. Barrel Check
- New section → is `sections/index.ts` update in scope?
- Import from `app/` → is it going through the feature barrel?

## Output format
```
RULES CHECK
===========
Shared components: [OK | ⚠ Use existing: X instead of writing Y]
Placement:         [OK | ⚠ issue]
Route files:       [OK | ⚠ missing: file]
Barrel:            [OK | ⚠ issue]

STATUS: PASS / FAIL
Blockers: [list if FAIL]
```
