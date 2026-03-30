# Agent Team

## Token Strategy
Every agent reads `.claude/QUICK_REF.md` first — not the full `docs/rules/` files.
Full rule files are read only when a specific detail is needed.

## Agents

| Agent | File | When to use |
|---|---|---|
| Senior Frontend | `agents/senior-frontend.md` | Every feature / component task |
| Rules Checker | `agents/rules-checker.md` | Before writing code — placement + shared component check |
| Verify | `agents/verify.md` | After writing code — tsc + rule compliance |
| Feature Scaffolder | `agents/feature-scaffolder.md` | Starting a brand new feature |

## Workflow

```
1. senior-frontend  → fills task.md
2. rules-checker    → validates → PASS/FAIL
3. senior-frontend  → writes code
4. verify           → tsc + rules → PASS/FAIL
5. FAIL → senior-frontend fixes → back to 4
```

## Key Files

| File | Purpose |
|---|---|
| `.claude/QUICK_REF.md` | Condensed rules — agents read this, not docs/rules/ |
| `.claude/task.md` | Active task context + checklist |
| `docs/shared-components.md` | Component registry — always check before writing |

## Usage (Claude Code)

```
"senior-frontend agent olarak çalış, task.md doldur ve rules-checker'ı çağır"
"feature-scaffolder ile company feature'ı oluştur"
"verify agent olarak tsc ve kural kontrolü yap"
```
