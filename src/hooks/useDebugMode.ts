'use client'

import { useState, useEffect } from 'react'

const DEBUG_STORAGE_KEY = 'APP_DEBUG_FORMS'
const REQUIRED_PRESS_COUNT = 3
const PRESS_TIMEOUT_MS = 1000

/**
 * Debug modu hook'u — Form debugger'ın aktif olup olmadığını kontrol eder.
 *
 * Aktifleştirme yöntemleri:
 * 1. Development modunda otomatik açık
 * 2. localStorage: localStorage.setItem('APP_DEBUG_FORMS', 'true')
 * 3. URL parametresi: ?debug=forms
 * 4. Klavye kısayolu: Ctrl+Shift+D (3 kez üst üste, 1 saniye içinde)
 *
 * Production'da varsayılan olarak KAPALI.
 */
export function useDebugMode(): boolean {
  const [isDebugMode, setIsDebugMode] = useState(() => {
    if (process.env.NODE_ENV === 'development') return true

    if (typeof window === 'undefined') return false

    // localStorage kontrolü
    if (localStorage.getItem(DEBUG_STORAGE_KEY) === 'true') return true

    // URL query parameter kontrolü
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('debug') === 'forms') return true

    return false
  })

  // Klavye kısayolu: Ctrl+Shift+D (3 kez üst üste)
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    let pressCount = 0
    let timeout: ReturnType<typeof setTimeout>

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd' || e.key === 'Ş')) {
        e.preventDefault()
        pressCount += 1
        clearTimeout(timeout)

        if (pressCount >= REQUIRED_PRESS_COUNT) {
          setIsDebugMode((prev) => {
            const next = !prev

            if (next) {
              localStorage.setItem(DEBUG_STORAGE_KEY, 'true')
            } else {
              localStorage.removeItem(DEBUG_STORAGE_KEY)
            }

            return next
          })
          pressCount = 0
        } else {
          timeout = setTimeout(() => {
            pressCount = 0
          }, PRESS_TIMEOUT_MS)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timeout)
    }
  }, [])

  return isDebugMode
}

export { DEBUG_STORAGE_KEY }
