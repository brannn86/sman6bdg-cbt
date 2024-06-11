interface Subject {
  id: number
  teacher_id: number
  name: string
  teacher: User
  classes: Classes[]
}

interface Question {
  id: number
  subject_id: number
  images?: string[]
  image_url?: string[]
  question: string
  options: string[]
  answer: string
  created_at?: string
  updated_at?: string
  subject?: Subject
}

interface Answer {
  id: number
  question_id: number
  answer: string
  created_at: string
  updated_at: string
}

interface SubjectPagination extends Omit<ApiListDataPagination, 'data'> {
  data: Subject[]
}
