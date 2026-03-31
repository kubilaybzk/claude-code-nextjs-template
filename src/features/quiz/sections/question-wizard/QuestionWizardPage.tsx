'use client'

import { QuestionWizardProvider } from './QuestionWizardProvider'

interface QuestionWizardPageProps {
  mode: 'create' | 'edit'
  questionId?: string
}

export function QuestionWizardPage({ mode, questionId }: QuestionWizardPageProps) {
  return <QuestionWizardProvider mode={mode} questionId={questionId} />
}

