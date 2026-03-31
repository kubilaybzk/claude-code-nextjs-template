import { QuizWizardPage } from '@/features/quiz'

interface EditQuizPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const { id } = await params

  return <QuizWizardPage mode="edit" quizId={id} />
}
