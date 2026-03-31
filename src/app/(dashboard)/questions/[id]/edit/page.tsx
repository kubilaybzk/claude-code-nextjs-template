import { QuestionWizardPage } from '@/features/quiz/sections'

interface EditQuestionPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id } = await params

  return <QuestionWizardPage mode="edit" questionId={id} />
}
