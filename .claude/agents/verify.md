# Verify

Runs after code is written. Checks TypeScript and rule compliance.

## Startup

1. Read `.claude/QUICK_REF.md`
2. Read `.claude/task.md` to know which files were modified

## Steps

### 1. TypeScript
Run: `npx tsc --noEmit`
Report all errors with file + line.

### 2. Rule Compliance — scan modified files only

| Rule | Check |
|---|---|
| No `any` | grep `any` in modified files |
| No `// @ts-ignore` | grep `@ts-ignore` |
| No `<img>` | grep `<img` |
| No raw colors | grep `text-red-\|bg-gray-\|bg-white` |
| No `console.log` | grep `console.log` |
| `ComponentErrorBoundary` | every useQuery/useMutation component wrapped? |
| Skeleton present | `isLoading` handled with skeleton, not spinner? |
| EmptyState used | empty list handled with `<EmptyState />`? |
| ErrorState used | `isError` handled with `<ErrorState />`? |
| JSDoc present | every export has `/** */`? |

### 3. Update task.md
Fill the Result section with PASS or FAIL + details.

## Output format
```
VERIFY REPORT
=============
tsc:        PASS / FAIL [errors]
Rules:      PASS / FAIL [violations list]

STATUS: PASS / FAIL
Fix needed: [list if FAIL]
```
