---
globs: ["**/*Form*", "**/*form*", "**/steps/**", "**/validations/**", "**/*.schema.ts", "**/*.validation.ts"]
description: react-hook-form + zod pattern'leri, step wizard, validation schema kuralları
alwaysApply: false
---

# Form Kuralları

## Tek Teknoloji: react-hook-form + zod
- Başka form kütüphanesi kullanma
- Schema type inference: `z.infer<typeof schema>`

## Schema Yerleşimi
- Konum: `features/{name}/validations/{schemaName}Schema.ts`
- Her schema dosyasında: zod schema + infer edilmiş type export
- Her field için default value zorunlu

## Multi-Step Form
- Her adım = ayrı component (`steps/` klasöründe)
- Her adım = ayrı zod schema (`validations/` klasöründe)
- Adım state'i `useState` ile orchestrator'da yönetilir (Redux sadece istenirse)
- Step component `methods: UseFormReturn` prop'u alır

## Pattern
```tsx
const methods = useForm<SchemaType>({
  resolver: zodResolver(schema),
  defaultValues: { ... }
})

const onSubmit = methods.handleSubmit(onValid, onInvalid)
```

## Validation Gösterimi
- Field-level hata: inline `<FormMessage />` (toast yasak)
- `<FormValidationDebugger methods={methods} />` her forma son child olarak ekle

## Yasaklar
- Uncontrolled input + react-hook-form karıştırma
- Toast ile form validation hatası gösterme
- Schema'sız form
