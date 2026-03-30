# Privia Base Template

Next.js (App Router) base template — shadcn/ui, TanStack Query, Redux Toolkit ve yerleşik Claude Code agent sistemi ile birlikte gelir.

---

## Kurulum

### Gereksinimler

- Node.js 18+
- pnpm (önerilen) veya npm
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) kurulu ve aktif

### 1. Clone ve Yükle

```bash
git clone <repo-url> my-project
cd my-project
pnpm install
```

---

## Proje Kurulum Adımları (Claude Code ile)

Bu template Claude Code ile birlikte çalışacak şekilde tasarlanmıştır. Clone'ladıktan sonra sırasıyla takip edin.

### Adım 1 — Projeyi Tanıt

Claude Code'u proje kök dizininde açın ve projenizi tanıtın. Claude bilgileri `CLAUDE.md`'ye kaydeder.

```
claude

> Bu [Proje Adı], [kısa açıklama].
> Backend API adresi [URL]. Ana entity'ler: [X, Y, Z].
> Bunları CLAUDE.md'ye kaydet.
```

Claude, mevcut mimari kuralları koruyarak projenize özel bilgileri (API URL, domain entity'leri, ekip konvansiyonları) `CLAUDE.md`'ye yazar.

### Adım 2 — Renk Paletini Kur

Template varsayılan shadcn gri tonları ile gelir (`src/app/globals.css`). Markanıza göre özelleştirmeniz gerekir.

**Seçenek A — Mevcut palet var:**

```
> Renk paletim:
> Primary: #2563EB (blue-600)
> Destructive: #DC2626 (red-600)
> Success: #16A34A (green-600)
> Warning: #F59E0B (amber-500)
>
> globals.css'i bu renklere göre oklch değerleriyle güncelle.
> Light ve dark tema için ayrı ayrı ayarla.
```

**Seçenek B — Palet henüz yok:**

```
> [sağlık/fintech/e-ticaret] uygulaması için profesyonel bir renk paleti oluştur.
> globals.css'e oklch değerleriyle uygula.
> Mevcut token yapısını kullan (--primary, --secondary, --accent, --destructive, vb.)
```

### Adım 3 — Kural Setini Güncelle

Palet ayarlandıktan sonra, Claude'un yeni token'ları kural dosyalarına kaydetmesini sağlayın:

```
> globals.css'teki renk paletini incele.
> docs/rules/styling.md'yi güncelle — izin verilen semantic token'ları ve kullanım amaçlarını yaz.
> .claude/QUICK_REF.md styling bölümünü de güncelle.
```

### Adım 4 — Geliştirmeye Başla

Artık hazırsınız. Aşağıdaki agent sistemini kullanarak geliştirme yapabilirsiniz.

---

## Mimari

```
src/
├── app/                    # Sadece thin wrapper (~15 satır page.tsx)
│   └── (dashboard)/
│       └── companies/
│           ├── page.tsx        # Feature'dan import eder, başka iş yapmaz
│           ├── loading.tsx     # Skeleton UI
│           ├── error.tsx       # Error boundary
│           └── not-found.tsx   # 404 ekranı
├── features/               # İş mantığı burada yaşar
│   └── company/
│       ├── index.ts            # Public barrel (sadece page + type export)
│       ├── sections/
│       │   ├── index.ts        # Section barrel (yeni section → önce burayı güncelle)
│       │   └── company-list/
│       │       ├── CompanyListPage.tsx
│       │       ├── components/
│       │       └── steps/      # Multi-step formlar için
│       ├── validations/        # Zod şemaları
│       ├── constants/
│       └── utils/
├── components/
│   ├── ui/                 # shadcn primitives — KESİNLİKLE değiştirme
│   └── shared/             # Ortak componentler (EmptyState, ErrorState, vb.)
├── services/               # API servis dosyaları (Axios)
└── lib/
    ├── api-client.ts       # Axios instance
    └── query-keys.ts       # Merkezi query key kaydı
```

---

## Agent Sistemi — Kullanım Kılavuzu

Template, `.claude/agents/` altında hazır bir agent takımı ile gelir. Bu agentlar proje kurallarını otomatik olarak uygular.

### Agent Takımı

| Agent | Dosya | Görevi |
|---|---|---|
| **Senior Frontend** | `agents/senior-frontend.md` | Feature/component geliştirme. İşi planlar, kodu yazar, diğer agentları çağırır. |
| **Rules Checker** | `agents/rules-checker.md` | Kod yazılmadan **önce** çalışır. Shared component kontrolü, dosya yerleşimi, route dosyaları ve barrel export'ları doğrular. |
| **Verify** | `agents/verify.md` | Kod yazıldıktan **sonra** çalışır. `tsc`, yasaklı pattern taraması, kural uyumluluğu kontrolü yapar. |
| **Feature Scaffolder** | `agents/feature-scaffolder.md` | Sıfırdan yeni feature iskeleti oluşturur. `_template` klasörünü kopyalar, route dosyalarını yaratır. |

### İş Akışı

```
1. senior-frontend  → task.md'yi doldurur (hedef, kapsam, checklist)
2. rules-checker    → doğrulama yapar → PASS / FAIL
3. senior-frontend  → kodu yazar
4. verify           → tsc + kural kontrolü → PASS / FAIL
5. FAIL → senior-frontend düzeltir → tekrar 4'e döner
```

### Nasıl Kullanılır?

#### Yeni Feature Oluşturma

```
> @feature-scaffolder "company" feature'ı oluştur, section'lar: company-list, create-company
```

Bu komut şunları yapar:
- `src/features/company/` klasör yapısını oluşturur
- Barrel export dosyalarını hazırlar
- Route dosyalarını yaratır (`page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`)

#### Component / Sayfa Geliştirme

```
> senior-frontend agent olarak çalış.
> CompanyList section'ı oluştur: DataTable ile listeleme, arama, sayfalama ve silme aksiyonu olsun.
```

Senior Frontend otomatik olarak:
1. `docs/shared-components.md`'yi kontrol eder — mevcut component var mı?
2. `docs/architecture.md`'deki karar ağacına göre dosya yerleşimini belirler
3. Semantic design token kullanır (raw Tailwind renkleri yasak)
4. Error boundary, loading skeleton ve empty state ekler
5. Mobile-first responsive layout uygular

#### Kod Doğrulama

```
> @verify company feature'ını kontrol et
```

Verify agent şunları tarar:
- `tsc --noEmit` — TypeScript hataları
- Yasaklı pattern'ler: `any`, `@ts-ignore`, `<img>`, `console.log`, raw renkler
- Barrel export ve route dosyası eksiklikleri
- JSDoc varlığı, EmptyState/ErrorState kullanımı

#### Doğal Dil ile Kullanım

Agent'ları @mention yerine doğal dille de çağırabilirsiniz:

```
> "task.md'yi doldur ve rules-checker'ı çağır"
> "feature-scaffolder ile asset feature'ı oluştur"
> "verify ile tsc ve kural kontrolü yap"
```

### Önemli Dosyalar

| Dosya | Açıklama |
|---|---|
| `.claude/QUICK_REF.md` | Tüm kuralların özeti — agentlar bunu okur, `docs/rules/` değil |
| `.claude/task.md` | Aktif görev planı + checklist + sonuçlar |
| `.claude/AGENTS.md` | Agent takımı yapısı ve iş akışı |
| `docs/shared-components.md` | Component kayıt defteri — yazmadan önce mutlaka kontrol et |

---

## Temel Kurallar

| Kural | Detay |
|---|---|
| **Raw Tailwind renk yasak** | `text-foreground`, `bg-muted`, `text-destructive` vb. token kullan |
| **Server Component öncelikli** | `'use client'` sadece gerçek interaktivite gerektiğinde |
| **Tüm veri → React Query** | Component içinde doğrudan API çağrısı yok, Redux'ta server state yok |
| **Component başına error boundary** | Her veri çeken component ayrı ayrı sarılır |
| **Mobile-first responsive** | Base = mobil, `sm:` `md:` `lg:` ile büyüt |
| **Dosya başına bir component** | `index.tsx` dosya adı olarak kullanılamaz |
| **Form = react-hook-form + zod** | Her step ayrı component + ayrı şema |
| **Erken optimizasyon yasak** | `memo`/`useMemo`/`useCallback` sadece profiler kanıtıyla |

---

## Komutlar

```bash
# Geliştirme
pnpm dev              # Dev sunucusu
pnpm build            # Production build
pnpm lint             # ESLint kontrolü

# Claude Code
claude                # Claude Code'u terminalde aç
/compact              # Konuşma context'ini sıkıştır
```

---

## Dokümantasyon Haritası

| Dosya | İçerik |
|---|---|
| `CLAUDE.md` | Proje rehberi — stack, doküman linkleri, temel kurallar |
| `.claude/QUICK_REF.md` | Agentlar için özet kurallar (~100 satır) |
| `.claude/agents/*.md` | Agent rol tanımları |
| `docs/architecture.md` | Klasör yapısı, component yerleşim karar ağacı |
| `docs/shared-components.md` | Component kayıt defteri |
| `docs/rules/components.md` | Component kuralları, error boundary, performance |
| `docs/rules/data.md` | React Query, state yönetimi, query keys |
| `docs/rules/styling.md` | Design token'lar, Tailwind kısıtlamaları, responsive |
| `docs/rules/routing.md` | Route yapısı, barrel exports |
| `docs/rules/forms.md` | Step formlar, zod şemaları |
| `docs/rules/feedback.md` | Loading/empty/error state'ler, toast bildirimleri |
| `docs/rules/naming.md` | İsimlendirme konvansiyonları |
| `docs/rules/typescript.md` | TypeScript kuralları |
| `docs/rules/a11y.md` | Erişilebilirlik minimumları |

---

## Lisans

Private — Tüm hakları saklıdır.
