'use client'

import { createContext, useContext } from 'react'

interface QuestionWizardContextValue {
  isSubmitting: boolean
  onFinalSubmit: () => void
}

const QuestionWizardContext = createContext<QuestionWizardContextValue | null>(null)

export function QuestionWizardProviderContext({
  value,
  children,
}: {
  value: QuestionWizardContextValue
  children: React.ReactNode
}) {
  return <QuestionWizardContext.Provider value={value}>{children}</QuestionWizardContext.Provider>
}

export function useQuestionWizard() {
  const ctx = useContext(QuestionWizardContext)
  if (!ctx) {
    throw new Error('useQuestionWizard must be used within QuestionWizardProviderContext')
  }
  return ctx
}
