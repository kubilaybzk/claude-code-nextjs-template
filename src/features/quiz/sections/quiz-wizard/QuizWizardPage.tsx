'use client'

import { QuizWizardProvider } from './QuizWizardProvider'

interface QuizWizardPageProps {
  mode: 'create' | 'edit'
  quizId?: string
}

export function QuizWizardPage({ mode, quizId }: QuizWizardPageProps) {
  return <QuizWizardProvider mode={mode} quizId={quizId} />
}

