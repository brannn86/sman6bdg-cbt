interface Exam {
  id: number
  subject_id: number
  category_exam_id: number
  name: string
  start_at: string
  end_at: string
  duration: number
  status: string
  created_at: string
  updated_at: string
  subject?: Subject
  questions?: Questions[]
  student_exams?: StudentExam[]

  questions_count?: number
}

interface CategoryExam {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

interface StudentExam {
  id: number
  exam_id: number
  student_id: number
  subject_id: number
  question: number[]
  score?: number
  is_done: boolean
  blocked: boolean
  blocked_at: string
  blocked_reason: string
  finished_at: string
  created_at: string
  updated_at: string

  question_answer_count?: number
  question_answered_count?: number
  question_not_answered_count?: number
  question_answered_percentage?: number
  student_exam_answer?: StudentAnswer[]

  student?: User
}

interface StudentAnswer {
  id: number
  question_id: number
  student_exam_id: number
  answer: string
  created_at: string
  updated_at: string
}

interface ExamPagination extends Omit<ApiListDataPagination, 'data'> {
  data: Exam[]
}

interface CategoryExamPagination extends Omit<ApiListDataPagination, 'data'> {
  data: CategoryExam[]
}

interface StudentExamPagination extends Omit<ApiListDataPagination, 'data'> {
  data: StudentExam[]
}

interface StudentAnswerPagination extends Omit<ApiListDataPagination, 'data'> {
  data: StudentAnswer[]
}
