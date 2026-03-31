/**
 * Icon re-exports — lucide-react ikonlarını merkezi yerden erişmek için.
 */

import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  BarChart3,
  HelpCircle,
  Eye,
  EyeOff,
  Share2,
  Copy,
  Download,
  RefreshCw,
  Search,
  X,
  Filter,
} from 'lucide-react'

/**
 * Yaygın ikonlar — Quiz feature'da kullanılan.
 */
export const CommonIcons = {
  status: {
    error: AlertTriangle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: HelpCircle,
  },
  action: {
    view: Eye,
    hide: EyeOff,
    share: Share2,
    copy: Copy,
    download: Download,
    refresh: RefreshCw,
    search: Search,
    close: X,
    filter: Filter,
  },
  quiz: {
    time: Clock,
    difficulty: Zap,
    stats: BarChart3,
  },
} as const
