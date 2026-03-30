# Component Rules

## One Component Per File

Multiple component definitions in a single file are forbidden.

## Reusability First

Before creating a new component, check if an existing one can be extended.
Follow the placement decision tree in `docs/architecture.md`.

## JSDoc Required

Every component and exported function must have a JSDoc comment.

```ts
/**
 * Displays a summary card for a single company.
 * @param company - The company data to display.
 * @param onSelect - Callback fired when the card is clicked.
 */
export function CompanyCard({ company, onSelect }: CompanyCardProps) {
```
