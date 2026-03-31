'use client'

import { createContext, useContext } from 'react'

interface QuizWizardContextValue {
  isSubmitting: boolean
  onFinalSubmit: () => void
}

const QuizWizardContext = createContext<QuizWizardContextValue | null>(null)

export function QuizWizardProviderContext({
  value,
  children,
}: {
  value: QuizWizardContextValue
  children: React.ReactNode
}) {
  return <QuizWizardContext.Provider value={value}>{children}</QuizWizardContext.Provider>
}

export function useQuizWizard() {
  const ctx = useContext(QuizWizardContext)
  if (!ctx) {
    throw new Error('useQuizWizard must be used within QuizWizardProviderContext')
  }
  return ctx
}

