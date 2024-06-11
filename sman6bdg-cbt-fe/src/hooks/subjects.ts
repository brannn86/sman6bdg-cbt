import axios from '@/lib/axios'
// import { useEffect } from 'react'
// import { subjectsouter } from 'next/router'

export const useSubjects: any = () => {
  const listSubjects = async (
    props: IApiRequest
  ): Promise<ApiListDataPagination> => {
    const subjects = await axios.get('api/subjects', props)
    return subjects.data.data.data
  }

  const createSubject = async (
    data: Subject,
    props: IApiRequest
  ): Promise<Subject> => {
    const subject = await axios.post('api/subjects', data, props)
    return subject.data.data
  }

  const findSubject = async (
    id: number,
    props: IApiRequest
  ): Promise<Subject> => {
    const subject = await axios.get(`api/subjects/${id}`, props)
    return subject.data.data
  }

  const updateSubject = async (
    id: number,
    data: Subject,
    props: IApiRequest
  ): Promise<Subject> => {
    const subject = await axios.put(`api/subjects/${id}`, data, props)
    return subject.data.data
  }

  const deleteSubject = async (
    id: number,
    props: IApiRequest
  ): Promise<Subject> => {
    const subject = await axios.delete(`api/subjects/${id}`, props)
    return subject.data.data
  }

  return {
    listSubjects,
    createSubject,
    findSubject,
    updateSubject,
    deleteSubject
  }
}

export const useQuestion: any = () => {
  const listQuestions = async (
    props: IApiRequest
  ): Promise<ApiListDataPagination> => {
    const questions = await axios.get('api/questions', props)
    return questions.data.data.data
  }

  const createQuestion = async (
    data: Question,
    props: IApiRequest
  ): Promise<Question> => {
    const question = await axios.post('api/questions', data, props)
    return question.data.data
  }

  const findQuestion = async (
    id: number,
    props: IApiRequest
  ): Promise<Question> => {
    const question = await axios.get(`api/questions/${id}`, props)
    return question.data.data
  }

  const updateQuestion = async (
    id: number,
    data: Question,
    props: IApiRequest
  ): Promise<Question> => {
    const question = await axios.post(`api/questions/${id}`, data, props)
    return question.data.data
  }

  const deleteQuestion = async (
    id: number,
    props: IApiRequest
  ): Promise<Question> => {
    const question = await axios.delete(`api/questions/${id}`, props)
    return question.data.data
  }

  return {
    listQuestions,
    createQuestion,
    findQuestion,
    updateQuestion,
    deleteQuestion
  }
}
