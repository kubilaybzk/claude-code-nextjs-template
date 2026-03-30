# Performance Rules — memo / useMemo / useCallback

Erken optimizasyon yasaktır. Aşağıdaki kurallar "ne zaman kullan" kadar "ne zaman kullanma"yı da tanımlar.

## React.memo

Bir component yalnızca şu koşulda `memo` ile sarılır:
- Parent sık re-render oluyor **ve**
- Component'in render'ı ölçülebilir şekilde pahalı (liste satırı, grafik, büyük tablo)

```tsx
// ✓ Uygun — büyük listede her satır için
export const CompanyRow = memo(function CompanyRow({ company }: CompanyRowProps) {
  return <tr>...</tr>
})

// ✗ Gereksiz — basit, nadiren render olan component
export const PageTitle = memo(function PageTitle({ title }: { title: string }) {
  return <h1>{title}</h1>
})
```

## useMemo

Hesaplama gerçekten pahalıysa kullanılır. Primitive dönüş değerleri veya basit map/filter için **kullanılmaz**.

```ts
// ✓ Uygun — büyük veri kümesi üzerinde ağır hesaplama
const chartData = useMemo(() => transformRawMetrics(rawData), [rawData])

// ✗ Gereksiz — basit filter, React zaten hızlı halleder
const active = useMemo(() => items.filter(i => i.active), [items])

// ✓ Bunun yerine
const active = items.filter(i => i.active)
```

## useCallback

Yalnızca şu durumda kullanılır:
- `memo` ile sarılmış bir child'a prop olarak geçiyorsa **veya**
- Başka bir hook'un dependency array'inde kullanılıyorsa

```ts
// ✓ Uygun — memo'lu child'a geçiyor
const handleDelete = useCallback((id: string) => {
  deleteCompany(id)
}, [deleteCompany])

// ✗ Gereksiz — memo'lu child yok, dependency'de de yok
const handleClick = useCallback(() => {
  setOpen(true)
}, [])
```

## Karar Ağacı

```
Gerçekten yavaş mı? (profiler ile ölçtün mü?)
  ├── Hayır → optimizasyon yapma
  └── Evet → ne yavaşlatıyor?
        ├── Pahalı hesaplama → useMemo
        ├── Gereksiz child render → React.memo + useCallback
        └── Her ikisi → ikisini birlikte uygula
```

## Kesinlikle Yasak

- Profiler olmadan sezgiyle memo/useMemo eklemek
- Her component'i otomatik olarak `memo` ile sarmak
- Boş dependency array `[]` ile `useCallback` kullanmak (closure bug riski)
