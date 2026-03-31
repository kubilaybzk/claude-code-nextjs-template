// ============================================================
// Quiz Modulu Ikon Sabitleri
//
// Tum quiz bilesenlerinde kullanilan ikonlar tek merkezden yonetilir.
// Ikon degisikligi tum quiz modulunu etkiler — tutarlilik saglar.
//
// Kullanim:
//   import { QuizIcons } from '@/features/quiz/constants/icons'
//   <QuizIcons.status.completed />
//   <QuizIcons.action.start className="size-4" />
//   <QuizIcons.meta.duration className="size-3.5" />
// ============================================================

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDot,
  ClipboardCheck,
  Clock,
  Compass,
  Eye,
  FileQuestion,
  FileText,
  Globe,
  GripVertical,
  Image as ImageIcon,
  Infinity,
  Info,
  Lightbulb,
  Lock,
  LayoutDashboard,
  Loader2,
  Plus,
  Play,
  RotateCcw,
  Settings,
  Shuffle,
  SkipForward,
  SlidersHorizontal,
  Square,
  Star,
  Tags,
  Target,
  Trophy,
  Trash2,
  Upload,
  Users,
  XCircle,
  Zap,
} from 'lucide-react'

// ─────────────────────────────────────────────
// Ana Ikon Namespace — QuizIcons
// ─────────────────────────────────────────────

/**
 * Quiz modulu merkezi ikon sabitleri
 *
 * Tum quiz bilesenlerinde bu namespace uzerinden ikon kullanilir.
 * Dogrudan lucide-react import'u YAPILMAZ.
 *
 * @example
 * import { QuizIcons } from '@/features/quiz/constants/icons'
 *
 * // Durum ikonu
 * <QuizIcons.status.completed className="text-emerald-500" />
 *
 * // Aksiyon ikonu
 * <QuizIcons.action.start />
 *
 * // Meta bilgi ikonu
 * <QuizIcons.meta.duration className="size-3.5" />
 */
export const QuizIcons = {
  // ── Durum Ikonlari ────────────────────────────────────────
  status: {
    /** Mevcut / basvurulabilir */
    available: CircleDot,
    /** Atanmis */
    assigned: Users,
    /** Yaklasan */
    upcoming: CalendarClock,
    /** Suresi dolmus */
    expired: Clock,
    /** Tamamlanmis */
    completed: CheckCircle2,
    /** Devam ediyor / yukleniyor */
    ongoing: Loader2,
    /** Uyari / hata */
    warning: AlertCircle,
  },

  // ── Aksiyon Ikonlari ──────────────────────────────────────
  action: {
    /** Quiz'i baslat */
    start: Play,
    /** Devam et */
    continue: Play,
    /** Onay / check */
    check: Check,
    /** Ekle */
    add: Plus,
    /** Sil */
    delete: Trash2,
    /** Yukle */
    upload: Upload,
  },

  // ── Meta / Bilgi Ikonlari ─────────────────────────────────
  meta: {
    /** Sure */
    duration: Clock,
    /** Deneme hakki (sinirsiz) */
    attempts: Infinity,
    /** Soru sayisi */
    questions: ClipboardCheck,
    /** Takvim / tarih */
    calendar: CalendarClock,
    /** Dil / global */
    globe: Globe,
    /** Bilgi */
    info: Info,
    /** XP / enerji */
    xp: Zap,
  },

  // ── Navigasyon Ikonlari ──────────────────────────────────
  nav: {
    /** Geri / onceki */
    back: ArrowLeft,
    /** Sonraki */
    next: ArrowRight,
    /** Sol */
    prev: ChevronLeft,
    /** Sag */
    forward: ChevronRight,
    /** Asagi */
    down: ChevronDown,
  },

  // ── Wizard / Form Ikonlari ───────────────────────────────
  wizard: {
    settings: Settings,
    dashboard: LayoutDashboard,
    configurations: SlidersHorizontal,
    questions: FileQuestion,
    kpi: Target,
    preview: Eye,
    content: FileText,
    tags: Tags,
    calendar: CalendarClock,
    image: ImageIcon,
    navigation: Compass,
    pass: SkipForward,
    rules: BookOpen,
    end: Square,
    lock: Lock,
    shuffle: Shuffle,
    users: Users,
  },

  // ── Solve / Result Ikonlari ──────────────────────────────
  solve: {
    hint: Lightbulb,
    correct: CheckCircle2,
    wrong: XCircle,
    retry: RotateCcw,
    next: ArrowRight,
    trophy: Trophy,
    star: Star,
  },

  // ── Editor Ikonlari ──────────────────────────────────────
  editor: {
    drag: GripVertical,
    radioOff: Circle,
  },
} as const

/** QuizIcons type (dinamik ikon secimi icin) */
export type QuizIconsType = typeof QuizIcons
