import axios from '@/lib/axios'
// import { useEffect } from 'react'
// import { examsouter } from 'next/router'
// declare type ExamsMiddleware = 'auth'

// interface IUseExams {
//   middleware: ExamsMiddleware
//   redirectIfAuthenticated?: string
// }

export const useExams: any = () => {
  const createExam = async (data: Exam, props: IApiRequest): Promise<Exam> => {
    const exam = await axios.post('api/exams', data, props)
    return exam.data.data
  }

  const findExam = async (id: number, props: IApiRequest): Promise<Exam> => {
    const exam = await axios.get(`api/exams/${id}`, props)
    return exam.data.data
  }

  const updateExam = async (
    id: number,
    data: Exam,
    props: IApiRequest
  ): Promise<Exam> => {
    const exam = await axios.put(`api/exams/${id}`, data, props)
    return exam.data.data
  }

  const deleteExam = async (id: number, props: IApiRequest): Promise<Exam> => {
    const exam = await axios.delete(`api/exams/${id}`, props)
    return exam.data.data
  }

  return {
    createExam,
    findExam,
    updateExam,
    deleteExam
  }
}
