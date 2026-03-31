"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Bug,
  Scan,
  Target,
  Activity,
  Search,
  Bell,
  Settings,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";

const colorTokens = [
  { name: "background", label: "Background", css: "bg-background" },
  { name: "foreground", label: "Foreground", css: "bg-foreground" },
  { name: "card", label: "Card", css: "bg-card" },
  { name: "primary", label: "Primary (Teal)", css: "bg-primary" },
  { name: "secondary", label: "Secondary (Slate)", css: "bg-secondary" },
  { name: "muted", label: "Muted", css: "bg-muted" },
  { name: "accent", label: "Accent (Amber)", css: "bg-accent" },
  { name: "destructive", label: "Destructive (Crimson)", css: "bg-destructive" },
  { name: "border", label: "Border", css: "bg-border" },
  { name: "ring", label: "Ring", css: "bg-ring" },
];

const chartTokens = [
  { name: "chart-1", label: "Info / Low", css: "bg-chart-1" },
  { name: "chart-2", label: "Resolved", css: "bg-chart-2" },
  { name: "chart-3", label: "Medium", css: "bg-chart-3" },
  { name: "chart-4", label: "High", css: "bg-chart-4" },
  { name: "chart-5", label: "Critical", css: "bg-chart-5" },
];

const sidebarTokens = [
  { name: "sidebar", label: "Sidebar", css: "bg-sidebar" },
  { name: "sidebar-primary", label: "Sidebar Primary", css: "bg-sidebar-primary" },
  { name: "sidebar-accent", label: "Sidebar Accent", css: "bg-sidebar-accent" },
  { name: "sidebar-border", label: "Sidebar Border", css: "bg-sidebar-border" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-foreground tracking-tight">
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
      {children}
    </h3>
  );
}

export default function PaletteShowcase() {
  const [isDark, setIsDark] = useState(false);
  const [timestamp, setTimestamp] = useState("2026-03-31T13:58:41");

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    setTimestamp(new Date().toISOString().slice(0, 19));
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setIsDark(root.classList.contains("dark"));
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Atmospheric layers — grid + noise + vignette + scan */}
      <div className="cyber-grid pointer-events-none fixed inset-0 opacity-30" />
      <div className="cyber-noise pointer-events-none fixed inset-0" />
      <div className="cyber-vignette pointer-events-none fixed inset-0" />
      <div className="cyber-scan-line pointer-events-none fixed inset-0 overflow-hidden" />

      {/* Header — Command Bar */}
      <header className="cyber-top-line relative border-b border-border bg-card/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="glow-primary-sm flex size-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="size-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-wide text-foreground uppercase">
                PMAP
                <span className="ml-2 text-xs font-normal text-primary">
                  Design System
                </span>
              </h1>
              <p className="font-mono text-[11px] text-muted-foreground">
                <span className="text-primary">$</span> threat_intel
                <span className="text-muted-foreground/50">::</span>
                palette_v2
                <span className="cursor-blink ml-1 inline-block h-3 w-1 bg-primary" />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="pulse-primary inline-block size-1.5 rounded-full bg-primary" />
              <span className="font-mono text-[10px] text-muted-foreground">SYSTEM ONLINE</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="default" className="font-mono text-[10px]">v2.0</Badge>
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1">
              <Sun className="size-3 text-muted-foreground" />
              <Switch
                id="theme-toggle"
                checked={isDark}
                onCheckedChange={toggleTheme}
                size="sm"
              />
              <Moon className="size-3 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        {/* ═══ COLOR PALETTE ═══ */}
        <section className="flex flex-col gap-6">
          <SectionTitle>Renk Paleti — Semantic Tokens</SectionTitle>

          {/* Core Tokens */}
          <div className="flex flex-col gap-3">
            <SubTitle>Core Tokens</SubTitle>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {colorTokens.map((token) => (
                <div
                  key={token.name}
                  className="flex flex-col gap-1.5 rounded-lg border border-border p-3"
                >
                  <div
                    className={`${token.css} h-12 rounded-md border border-border`}
                  />
                  <p className="text-xs font-medium text-foreground">
                    {token.label}
                  </p>
                  <code className="text-[10px] text-muted-foreground">
                    --{token.name}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Chart / Severity Scale */}
          <div className="flex flex-col gap-3">
            <SubTitle>Chart — Severity Scale</SubTitle>
            <div className="flex gap-1 overflow-hidden rounded-lg">
              {chartTokens.map((token) => (
                <div key={token.name} className="flex flex-1 flex-col gap-1.5">
                  <div className={`${token.css} h-14`} />
                  <p className="text-center text-[10px] font-medium text-foreground">
                    {token.label}
                  </p>
                  <code className="text-center text-[10px] text-muted-foreground">
                    --{token.name}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Tokens */}
          <div className="flex flex-col gap-3">
            <SubTitle>Sidebar Tokens</SubTitle>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {sidebarTokens.map((token) => (
                <div
                  key={token.name}
                  className="flex flex-col gap-1.5 rounded-lg border border-border p-3"
                >
                  <div
                    className={`${token.css} h-10 rounded-md border border-border`}
                  />
                  <p className="text-xs font-medium text-foreground">
                    {token.label}
                  </p>
                  <code className="text-[10px] text-muted-foreground">
                    --{token.name}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* ═══ TYPOGRAPHY ═══ */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Tipografi</SectionTitle>
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6">
            <p className="text-foreground">
              <span className="font-semibold">text-foreground</span> — Ana içerik
              metni
            </p>
            <p className="text-muted-foreground">
              <span className="font-semibold">text-muted-foreground</span> —
              İkincil metin, açıklamalar
            </p>
            <p className="text-primary">
              <span className="font-semibold">text-primary</span> — Linkler,
              vurgulu metin (Teal)
            </p>
            <p className="text-accent-foreground">
              <span className="font-semibold">text-accent-foreground</span> —
              Accent metin (Amber)
            </p>
            <p className="text-destructive">
              <span className="font-semibold">text-destructive</span> — Hata,
              kritik zafiyet (Crimson)
            </p>
          </div>
        </section>

        <Separator />

        {/* ═══ BUTTONS ═══ */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Butonlar</SectionTitle>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">
              <Scan className="size-4" />
              Taramayı Başlat
            </Button>
            <Button variant="secondary">
              <Settings className="size-4" />
              Ayarlar
            </Button>
            <Button variant="outline">
              <Search className="size-4" />
              Ara
            </Button>
            <Button variant="ghost">
              <Activity className="size-4" />
              Aktivite
            </Button>
            <Button variant="destructive">
              <ShieldAlert className="size-4" />
              Zafiyet Sil
            </Button>
            <Button variant="link">Detayları Gör</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="default">Default</Button>
            <Button size="lg">LG</Button>
            <Button size="icon" aria-label="Bildirimler">
              <Bell className="size-4" />
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <Separator />

        {/* ═══ BADGES ═══ */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Badge&apos;ler</SectionTitle>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">
              <ShieldCheck className="size-3" />
              Primary (Teal)
            </Badge>
            <Badge variant="secondary">Secondary (Slate)</Badge>
            <Badge variant="destructive">
              <ShieldAlert className="size-3" />
              Destructive
            </Badge>
            <Badge variant="outline">Outline</Badge>
          </div>

          <SubTitle>Severity Badges</SubTitle>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-chart-1 text-primary-foreground">
              <Info className="size-3" />
              Info
            </Badge>
            <Badge className="bg-chart-2 text-primary-foreground">
              <ShieldCheck className="size-3" />
              Low
            </Badge>
            <Badge className="bg-chart-3 text-foreground">
              <AlertTriangle className="size-3" />
              Medium
            </Badge>
            <Badge className="bg-chart-4 text-primary-foreground">
              <Bug className="size-3" />
              High
            </Badge>
            <Badge className="bg-chart-5 text-primary-foreground">
              <ShieldAlert className="size-3" />
              Critical
            </Badge>
          </div>
        </section>

        <Separator />

        {/* ═══ CARDS ═══ */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Kartlar</SectionTitle>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover-glow transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-4 text-primary" />
                  Aktif Taramalar
                </CardTitle>
                <CardDescription className="font-mono text-xs">last_24h :: active_scans</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">24</p>
                <p className="text-sm text-muted-foreground">
                  <span className="status-active mr-1.5 inline-block size-2 rounded-full bg-primary" />
                  3 tarama devam ediyor
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-[0_0_16px_var(--glow-destructive)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="size-4 text-destructive" />
                  Kritik Zafiyetler
                </CardTitle>
                <CardDescription className="font-mono text-xs">pending :: severity_critical</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-destructive">7</p>
                <p className="text-sm text-muted-foreground">
                  <span className="pulse-critical mr-1.5 inline-block size-2 rounded-full bg-destructive" />
                  2 yeni tespit
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-[0_0_16px_oklch(0.72_0.16_150_/_25%)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-chart-2" />
                  Çözülen Zafiyetler
                </CardTitle>
                <CardDescription className="font-mono text-xs">this_week :: resolved</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-chart-2">42</p>
                <p className="text-sm text-muted-foreground">
                  %89 çözüm oranı
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* ═══ ALERTS ═══ */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Uyarılar (Alert)</SectionTitle>
          <div className="flex flex-col gap-3">
            <Alert>
              <Info className="size-4" />
              <AlertTitle>Bilgilendirme</AlertTitle>
              <AlertDescription>
                Yeni tarama sonuçları hazır. Detayları incelemek için tıklayın.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <ShieldAlert className="size-4" />
              <AlertTitle>Kritik Zafiyet Tespit Edildi</AlertTitle>
              <AlertDescription>
                CVE-2024-1234 — Remote Code Execution zafiyeti tespit edildi. Acil
                müdahale gerekli.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <Separator />

        {/* ═══ FORM ELEMENTS ═══ */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Form Elemanları</SectionTitle>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Input & Label</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="target-host">Hedef Host</Label>
                  <Input
                    id="target-host"
                    placeholder="192.168.1.0/24"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="scan-name">Tarama Adı</Label>
                  <Input
                    id="scan-name"
                    placeholder="Q1 External Pentest"
                    defaultValue="Q1 External Pentest"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="disabled-input">Disabled Input</Label>
                  <Input
                    id="disabled-input"
                    placeholder="Düzenlenemez"
                    disabled
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Switch, Checkbox & Progress</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Switch id="auto-scan" defaultChecked />
                  <Label htmlFor="auto-scan">Otomatik Tarama</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Bildirimler</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="terms" defaultChecked />
                  <Label htmlFor="terms">Şartları kabul ediyorum</Label>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Tarama İlerlemesi</Label>
                    <span className="text-sm text-muted-foreground">68%</span>
                  </div>
                  <Progress value={68} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Zafiyet Analizi</Label>
                    <span className="text-sm text-muted-foreground">100%</span>
                  </div>
                  <Progress value={100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* ═══ TABS ═══ */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Tabs</SectionTitle>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="vulnerabilities">Zafiyetler</TabsTrigger>
              <TabsTrigger value="assets">Varlıklar</TabsTrigger>
              <TabsTrigger value="reports">Raporlar</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Genel bakış içeriği burada gösterilir. Tüm tarama
                    sonuçları, metrikler ve özet bilgiler.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="vulnerabilities">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Tespit edilen zafiyetlerin listesi ve detayları.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="assets">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Taranmış varlıklar ve host bilgileri.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Oluşturulan raporlar ve dışa aktarma seçenekleri.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <Separator />

        {/* ═══ COMBINED: Mini Dashboard Preview ═══ */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Mini Dashboard Önizleme</SectionTitle>
          <Card className="hover-glow overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="status-active size-4 text-primary" />
                  Son Tarama Sonuçları
                </CardTitle>
                <Button variant="ghost" size="sm">
                  Tümünü Gör
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {[
                  {
                    severity: "CRIT",
                    name: "SQL Injection — Login Endpoint",
                    host: "api.example.com",
                    cvss: "9.8",
                    color: "bg-chart-5",
                    textColor: "text-chart-5",
                    pulse: true,
                  },
                  {
                    severity: "HIGH",
                    name: "XSS Stored — Comment Section",
                    host: "app.example.com",
                    cvss: "7.5",
                    color: "bg-chart-4",
                    textColor: "text-chart-4",
                    pulse: false,
                  },
                  {
                    severity: "MED",
                    name: "CORS Misconfiguration",
                    host: "cdn.example.com",
                    cvss: "5.3",
                    color: "bg-chart-3",
                    textColor: "text-chart-3",
                    pulse: false,
                  },
                  {
                    severity: "LOW",
                    name: "Missing Security Headers",
                    host: "www.example.com",
                    cvss: "3.1",
                    color: "bg-chart-1",
                    textColor: "text-chart-1",
                    pulse: false,
                  },
                ].map((vuln) => (
                  <div
                    key={vuln.name}
                    className="group flex items-center gap-3 rounded-md border border-border p-3 transition-all hover:bg-muted/50 hover:border-primary/30"
                  >
                    <div className={`size-2.5 rounded-full ${vuln.color} ${vuln.pulse ? "pulse-critical" : ""}`} />
                    <div className="flex flex-1 flex-col gap-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {vuln.name}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {vuln.host}
                      </p>
                    </div>
                    <span className={`font-mono text-xs font-semibold ${vuln.textColor}`}>
                      {vuln.cvss}
                    </span>
                    <Badge
                      className={`${vuln.color}/10 ${vuln.textColor} border-transparent font-mono text-[10px]`}
                    >
                      {vuln.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* ═══ CYBER EFFECTS SHOWCASE ═══ */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Cyber Effects</SectionTitle>

          {/* Glow Effects */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="cyber-border flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6">
              <div className="glow-primary flex size-14 items-center justify-center rounded-xl bg-primary">
                <Shield className="size-7 text-primary-foreground" />
              </div>
              <code className="font-mono text-[10px] text-primary">.glow-primary</code>
              <span className="text-[10px] text-muted-foreground">Electric Cyan</span>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6">
              <div className="glow-accent flex size-14 items-center justify-center rounded-xl bg-accent">
                <AlertTriangle className="size-7 text-accent-foreground" />
              </div>
              <code className="font-mono text-[10px] text-accent-foreground">.glow-accent</code>
              <span className="text-[10px] text-muted-foreground">Tactical Amber</span>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6">
              <div className="glow-destructive flex size-14 items-center justify-center rounded-xl bg-destructive">
                <ShieldAlert className="size-7 text-primary-foreground" />
              </div>
              <code className="font-mono text-[10px] text-destructive">.glow-destructive</code>
              <span className="text-[10px] text-muted-foreground">Breach Red</span>
            </div>
          </div>

          {/* Status & Terminal */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
              <SubTitle>Status Indicators</SubTitle>
              <div className="flex flex-col gap-2.5">
                <span className="flex items-center gap-2.5 text-sm">
                  <span className="pulse-primary inline-block size-2 rounded-full bg-primary" />
                  <span className="font-mono text-xs text-muted-foreground">SCANNING</span>
                  <span className="data-stream ml-auto h-px w-12 rounded" />
                </span>
                <span className="flex items-center gap-2.5 text-sm">
                  <span className="pulse-critical inline-block size-2 rounded-full bg-destructive" />
                  <span className="font-mono text-xs text-muted-foreground">BREACH DETECTED</span>
                </span>
                <span className="flex items-center gap-2.5 text-sm">
                  <span className="status-active inline-block size-2 rounded-full bg-accent" />
                  <span className="font-mono text-xs text-muted-foreground">ALERT PENDING</span>
                </span>
                <span className="flex items-center gap-2.5 text-sm">
                  <span className="inline-block size-2 rounded-full bg-chart-2" />
                  <span className="font-mono text-xs text-muted-foreground">RESOLVED</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
              <SubTitle>Terminal</SubTitle>
              <div className="flex flex-col gap-1 rounded-md bg-background p-4 font-mono text-xs leading-relaxed">
                <div>
                  <span className="text-chart-2">root</span>
                  <span className="text-muted-foreground">@</span>
                  <span className="text-primary">pmap-node</span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-accent-foreground">~</span>
                  <span className="text-muted-foreground">$ </span>
                  <span className="text-foreground">nmap -sV -sC 10.0.0.0/24</span>
                </div>
                <div className="text-muted-foreground">
                  Starting Nmap scan at {timestamp}
                </div>
                <div>
                  <span className="text-chart-2">Discovered</span>
                  <span className="text-foreground"> open port </span>
                  <span className="text-primary">443/tcp</span>
                  <span className="text-foreground"> on 10.0.0.15</span>
                </div>
                <div>
                  <span className="text-destructive">VULN:</span>
                  <span className="text-foreground"> CVE-2024-6387 </span>
                  <span className="text-destructive">[CRITICAL]</span>
                </div>
                <div className="mt-1">
                  <span className="text-primary">pmap</span>
                  <span className="text-muted-foreground"> $ </span>
                  <span className="cursor-blink inline-block h-3.5 w-1.5 bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-6 text-center font-mono text-[11px] text-muted-foreground">
          PMAP v1.0 // dark_ops::design_system // oklch color space // {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
