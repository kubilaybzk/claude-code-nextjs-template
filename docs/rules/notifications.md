# Notification & Toast Rules

Bildirim kanalı iki türdür: **toast** ve **inline**. Hangisinin nerede kullanılacağı aşağıda tanımlanmıştır.

## Toast — `sonner`

Kullanıcı bir aksiyon aldı, sonuç döndü → toast göster.

| Durum | Kullanım |
|---|---|
| Mutasyon başarılı (create / update / delete) | `toast.success(...)` |
| Beklenmedik sunucu hatası (5xx) | `toast.error(...)` |
| Kullanıcıya bilgi mesajı (info) | `toast.info(...)` |

```ts
// lib/[name].queries.ts içinde
onSuccess: () => {
  toast.success("Şirket başarıyla oluşturuldu.")
  queryClient.invalidateQueries({ queryKey: queryKeys.company.list() })
},
onError: () => {
  toast.error("İşlem sırasında bir hata oluştu.")
},
```

## Inline — Form Validasyon Hataları

Form alanına ait hatalar toast değil, alanın altında inline gösterilir.
react-hook-form + zod otomatik olarak bunu yönetir.

```tsx
// ✗ Forbidden
toast.error("Ad alanı zorunludur.")

// ✓ Correct — react-hook-form ile otomatik
<FormField
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormControl><Input {...field} /></FormControl>
      <FormMessage />   {/* hata buraya düşer */}
    </FormItem>
  )}
/>
```

## Sayfa / Liste Hataları

Veri yükleme hatası → toast değil, `<ErrorState />` component'i kullanılır.

```tsx
if (isError) return <ErrorState title="Veriler yüklenemedi" action={<Button onClick={() => refetch()}>Tekrar Dene</Button>} />
```

## Özet

| Durum | Kanal |
|---|---|
| Mutasyon başarılı/hatalı | Toast |
| Form alan validasyonu | Inline (`<FormMessage />`) |
| Sayfa / liste yükleme hatası | `<ErrorState />` |
| Sunucu 401/403 | Toast + redirect |
