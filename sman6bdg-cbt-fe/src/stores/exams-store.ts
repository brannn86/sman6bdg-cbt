import { downloadFile } from '@/helpers/fetch-helpers'
import { toastHelper } from '@/helpers/toast-helper'
import axios from '@/lib/axios'
import { create } from 'zustand'

interface State {
  listExams: Exam[]
  exam: Exam
  getListExams: (params: any) => Promise<void>
  getExam: (id: string) => Promise<void>
  unBlockStudentExam: (id: string, studentId: number) => Promise<void>
  downloadExam: (id: string, name: string) => Promise<void>
}

const listExamDefault: Exam[] = []
const examDefault: Exam = {
  id: 0,
  subject_id: 0,
  category_exam_id: 0,
  name: '',
  start_at: '',
  end_at: '',
  duration: 0,
  status: '',
  created_at: '',
  updated_at: '',
  subject: {
    id: 0,
    teacher_id: 0,
    name: '',
    teacher: {
      id: 0,
      email: '',
      username: ''
    },
    classes: []
  },
  questions: [],
  student_exams: []
}

const useExamsStore = create<State>()((set) => ({
  listExams: listExamDefault,
  exam: examDefault,
  getListExams: async (params) => {
    try {
      const response = await axios.get('/api/exams', { params })

      const responseData = await response.data

      if (response.status !== 200) throw new Error(responseData.message)

      const listExams: Exam[] = responseData.data.data.data

      set({ listExams })
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message

      throw new Error(message)
    }
  },
  getExam: async (id: string) => {
    try {
      const response = await axios.get(`/api/exams/${id}`)

      const responseData = await response.data

      if (response.status !== 200) throw new Error(responseData.message)

      const exam: Exam = responseData.data.data

      set({ exam })
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message

      throw new Error(message)
    }
  },

  unBlockStudentExam: async (id: string, studentId: number) => {
    try {
      const response = await axios.post(`/api/exams/${id}/unblock-exam`, {
        student_id: studentId
      })

      const responseData = await response.data

      if (response.status !== 200) throw new Error(responseData.message)

      const exam: Exam = responseData.data.data

      set({ exam })
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message

      throw new Error(message)
    }
  },
  downloadExam: async (id: string, name: string) => {
    try {
      await downloadFile(`/api/exams/${id}/export`, `${name}.xlsx`)
    } catch (error) {
      toastHelper.error(error)
    }
  }
}))

export default useExamsStore
