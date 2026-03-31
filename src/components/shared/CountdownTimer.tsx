'use client'

import { useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  targetDate: number
  onComplete?: () => void
  className?: string
}

export function CountdownTimer({ targetDate, onComplete, className }: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const remainingMs = Math.max(0, targetDate * 1000 - now)

  useEffect(() => {
    if (remainingMs === 0) onComplete?.()
  }, [remainingMs, onComplete])

  const text = useMemo(() => {
    const totalSeconds = Math.floor(remainingMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [remainingMs])

  return <span className={cn('countdown-timer', className)}>{text}</span>
}
