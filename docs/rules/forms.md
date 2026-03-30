# Form Rules

All forms use **react-hook-form** + **zod**. No exceptions.

## Step Forms

Each wizard step is a separate component inside `sections/[section]/steps/`.
Each step has its own zod schema in `features/[name]/validations/`.
Step state (current index, accumulated data) lives in the feature `store/` slice.

```
sections/createCompany/
├── CreateCompanyPage.tsx      # orchestrates steps, reads step index from store
├── steps/
│   ├── StepBasicInfo.tsx      # schema: basicInfoSchema.ts
│   ├── StepAddress.tsx        # schema: addressSchema.ts
│   └── StepConfirm.tsx
```

## Schema Convention

```ts
// features/company/validations/basicInfoSchema.ts
import { z } from "zod";

export const basicInfoSchema = z.object({
  name: z.string().min(1),
  taxId: z.string().min(10).max(10),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
```
