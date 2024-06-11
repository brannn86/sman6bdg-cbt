import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { format as formatDate, parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { Transition } from '@headlessui/react'
import PrimaryButton from '@/components/PrimaryButton'
import { useRouter } from 'next/router'
import Select from 'react-select'

import { useExams } from '@/hooks/exams'
import { toastHelper } from '@/helpers/toast-helper'
import { useTranslation } from 'next-i18next'

const ExamForm = ({
  id: examId = null
}: {
  id?: string | null
}): JSX.Element => {
  const router = useRouter()
  const { t: commonTrans } = useTranslation('common')
  const { t: examTrans } = useTranslation('exam')

  const { createExam, updateExam } = useExams()

  const [name, setName] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [totalQuestion, setTotalQuestion] = useState(0)
  const [subjectId, setSubjectId] = useState('')
  const [categoryExamId, setCategoryExamId] = useState('')
  const [duration, setDuration] = useState('')
  const [listQuestionExams, setListQuestionExams] = useState<Question[]>([])

  const [listSubjects, setListSubjects] = useState<ReactSelectOption[]>([])
  const [listCategoryExams, setListCategoryExams] = useState<
    ReactSelectOption[]
  >([])
  const [listQuestions, setListQuestions] = useState<ReactSelectOption[]>([])

  const [tempQuestion, setTempQuestion] = useState<Question>({
    id: 0,
    subject_id: 0,
    question: '',
    answer: '',
    options: []
  })

  useEffect(() => {
    // Human Readable Duration, Day, Hour, Minute
    if (startAt == null || endAt == null) return

    const startAtDate = new Date(startAt).getTime()
    const endAtDate = new Date(endAt).getTime()

    const duration = (endAtDate - startAtDate) / 1000 / 60

    const day = Math.floor(duration / 60 / 24)
    const hour = Math.floor(duration / 60) - day * 24
    const minute = Math.floor(duration) - day * 24 * 60 - hour * 60

    setDuration(
      ` ${day != null ? `${day} Hari` : ''} ${
        hour !== 0 ? `${hour} Jam` : ''
      } ${minute !== 0 ? `${minute} Menit` : ''}`
    )
  }, [startAt, endAt])

  useEffect(() => {
    const fetchSubject = async (): Promise<void> => {
      if (examId === null || examId === undefined) return

      const exam = await axios.get(`api/exams/${examId}`)
      const data = exam.data.data.data

      // timezone indonesian
      const timezone = 'Asia/Jakarta'
      const startAt = formatDate(
        utcToZonedTime(parseISO(data.start_at), timezone),
        "yyyy-MM-dd'T'HH:mm"
      )
      const endAt = formatDate(
        utcToZonedTime(parseISO(data.end_at), timezone),
        "yyyy-MM-dd'T'HH:mm"
      )

      setName(data.name)
      setStartAt(startAt)
      setEndAt(endAt)
      setSubjectId(data.subject_id)
      setCategoryExamId(data.category_exam_id)
      setListQuestionExams(data.questions)
      setTotalQuestion(data.total_question)
    }
    fetchSubject().catch((err) => {
      toastHelper.error(err)

      if (err.response.status === 404) {
        void router.replace('/exams')
      }
    })
  }, [examId, router])

  useEffect(() => {
    const fetchSubject = async (): Promise<void> => {
      const subjects = await axios.get('api/subjects', {
        params: {
          limit: 0
        }
      })

      const data = subjects.data.data.data

      const listMapSubject = data.data?.map((subject: Subject) => {
        return {
          value: subject,
          label: subject.name
        }
      })

      setListSubjects(listMapSubject)
    }
    fetchSubject().catch((err) => {
      toastHelper.error(err)
    })
  }, [])

  useEffect(() => {
    const fetchCategoryExams = async (): Promise<void> => {
      const categoryExam = await axios.get('api/category-exam', {
        params: {
          limit: 0
        }
      })

      const data = categoryExam.data.data.data

      const listMapCategoryExams = data?.map((categoryExam: CategoryExam) => {
        return {
          value: categoryExam,
          label: categoryExam.name
        }
      })

      setListCategoryExams(listMapCategoryExams)
    }
    fetchCategoryExams().catch((err) => {
      toastHelper.error(err)
    })
  }, [])

  useEffect(() => {
    const fetchQuestions = async (): Promise<void> => {
      const question = await axios.get('api/questions', {
        params: {
          limit: 0,
          subject_id: subjectId
        }
      })

      const data = question.data.data.data

      const listMapQuestions = data?.data?.map((question: Question) => {
        return {
          value: question,
          label: question.question
        }
      })

      setListQuestions(listMapQuestions)
    }
    fetchQuestions().catch((err) => {
      toastHelper.error(err)
    })
  }, [subjectId])

  const [errors, setErrors] = useState<{
    name?: string[]
    start_at?: string[]
    end_at?: string[]
    total_question?: string[]
    subject_id?: string[]
    category_exam_id?: string[]
  }>({})
  const [status, setStatus] = useState<string>('')

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setErrors({})

    const data = {
      name,
      start_at: startAt,
      end_at: endAt,
      subject_id: subjectId,
      category_exam_id: categoryExamId,
      total_question: totalQuestion,
      question_id: listQuestionExams.map((item: Question) => item.id)
    }
    try {
      if (examId != null) {
        await updateExam(examId, data)
        setStatus('submit-success')
      } else {
        await createExam(data)
      }

      await router.push('/exams')
    } catch (err: any) {
      toastHelper.error(err)
    }
  }

  const handleQuestionExam = (): void => {
    if (tempQuestion === null || tempQuestion === undefined) return

    if (tempQuestion.id === 0) return

    if (listQuestionExams.includes(tempQuestion)) return

    setListQuestionExams([...listQuestionExams, tempQuestion])
    setTempQuestion({
      id: 0,
      subject_id: 0,
      question: '',
      answer: '',
      options: []
    })

    setTotalQuestion(listQuestionExams.length + 1)
  }

  return (
    <section>
      <header>
        <h2 className="border-b-2 border-b-slate-600 pb-2 text-lg font-medium text-gray-900 ">
          {commonTrans('form')} {examTrans('name')}
        </h2>
      </header>
      <div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid">
            {/* Name */}
            <div className="mb-4">
              <Label htmlFor="name">{examTrans('label.name')}</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={name}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setName(event.target.value)
                }}
                required
                autoFocus
                placeholder={examTrans('label.name') ?? ''}
              />
              <InputError messages={errors.name} className="mt-2" />
            </div>
            {/* Start At */}
            <div className="mb-4">
              <Label htmlFor="start_at">{examTrans('label.start_at')}</Label>
              <Input
                id="start_at"
                type="datetime-local"
                name="start_at"
                value={startAt}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setStartAt(event.target.value)
                }}
                required
                autoFocus
                placeholder={examTrans('label.start_at') ?? ''}
              />
              <InputError messages={errors.start_at} className="mt-2" />
            </div>
            {/* End At */}
            <div className="mb-4">
              <Label htmlFor="start_at">{examTrans('label.end_at')}</Label>
              <Input
                id="end_at"
                type="datetime-local"
                name="end_at"
                value={endAt}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setEndAt(event.target.value)
                }}
                required
                autoFocus
                placeholder={examTrans('label.end_at') ?? ''}
              />
              <InputError messages={errors.end_at} className="mt-2" />
            </div>
            {/* Duration */}
            <div className="mb-4">
              <Label htmlFor="duration">{examTrans('label.duration')}</Label>
              <Input
                id="duration"
                type="text"
                name="duration"
                value={duration}
                className="mt-1 block w-full"
                required
                autoFocus
                placeholder={examTrans('label.start_at') ?? ''}
                disabled
              />
            </div>
            {/* Total Question */}
            <div className="mb-4">
              <Label htmlFor="total_question">
                {examTrans('label.total_question')}
              </Label>
              <Input
                id="total_question"
                type="number"
                name="total_question"
                value={totalQuestion}
                className="mt-1 block w-full"
                onChange={(event) => {
                  setTotalQuestion(parseInt(event.target.value))
                }}
                required
                autoFocus
                placeholder="Total Question"
                disabled={examId != null}
              />
              <InputError messages={errors.total_question} className="mt-2" />
            </div>
            {/* Subject */}
            <div className="mb-4">
              <Label htmlFor="subject">{examTrans('label.subject')}</Label>
              <Select
                className="my-react-select-container col-span-2 mt-1 block w-full"
                classNamePrefix="my-react-select"
                instanceId="subject"
                options={listSubjects}
                onChange={(e: any) => {
                  if (subjectId !== e.value.id) setListQuestionExams([])
                  setSubjectId(e.value.id)
                }}
                value={
                  subjectId != null &&
                  listSubjects.find((item: any) => item.value.id === subjectId)
                }
                placeholder={commonTrans('select', {
                  name: examTrans('label.subject')
                })}
                required
              />
              <InputError messages={errors.subject_id} className="mt-2" />
            </div>
            {/* Category Exam */}
            <div className="mb-4">
              <Label htmlFor="category-exam">
                {examTrans('label.category_exam')}
              </Label>
              <Select
                className="my-react-select-container col-span-2 mt-1 block w-full"
                classNamePrefix="my-react-select"
                instanceId="category-exam"
                options={listCategoryExams}
                onChange={(e: any) => {
                  setCategoryExamId(e.value.id)
                }}
                value={
                  categoryExamId != null &&
                  listCategoryExams.find(
                    (item: any) => item.value.id === categoryExamId
                  )
                }
                placeholder={
                  commonTrans('select', {
                    name: examTrans('label.category_exam')
                  }) ?? ''
                }
                required
              />
              <InputError messages={errors.category_exam_id} className="mt-2" />
            </div>
          </div>

          {examId != null && (
            <div className="grid">
              <h2 className="mb-4 border-b-2 border-b-slate-600 pb-2 text-lg font-medium text-gray-900 ">
                {examTrans('question.name')}
              </h2>

              <div className="grid grid-cols-3 gap-2">
                <Select
                  className="my-react-select-container col-span-2 mt-1 block w-full"
                  classNamePrefix="my-react-select"
                  instanceId="question"
                  // filter by id
                  options={listQuestions.filter((item: any) => {
                    const listQuestionExamsId = listQuestionExams.map(
                      (item: Question) => item.id
                    )
                    return !listQuestionExamsId.includes(item.value.id)
                  })}
                  onChange={(e: any) => {
                    setTempQuestion(e.value)
                  }}
                  value={
                    tempQuestion != null &&
                    listQuestions.find(
                      (item: any) => item.value === tempQuestion
                    )
                  }
                  placeholder={commonTrans('select', {
                    name: examTrans('question.name')
                  })}
                />

                <button
                  type="button"
                  className="btn-primary btn-sm btn w-1/2 self-end"
                  onClick={handleQuestionExam}
                >
                  {commonTrans('add')}
                </button>
              </div>

              <div className="my-4 overflow-x-auto">
                <table className="table-zebra mt-4 w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">
                        {examTrans('question.label.no')}
                      </th>
                      <th className="px-4 py-2">
                        {examTrans('question.label.question')}
                      </th>
                      <th className="px-4 py-2 text-center">
                        {examTrans('question.label.action')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listQuestionExams.map(
                      (question: Question, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2">{question.question}</td>
                          <td className="px-4 py-2 text-center">
                            <button
                              type="button"
                              className="btn-error btn-sm btn text-white"
                              onClick={() => {
                                setListQuestionExams(
                                  listQuestionExams.filter(
                                    (item: Question) => item !== question
                                  )
                                )
                                setTotalQuestion(listQuestionExams.length - 1)
                              }}
                            >
                              {commonTrans('delete')}
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-4">
            <PrimaryButton>{commonTrans('save')}</PrimaryButton>

            {status === 'submit-success' && (
              <Transition
                show={true}
                enterFrom="opacity-0"
                leaveTo="opacity-0"
                className="transition ease-in-out"
              >
                <p className="text-sm text-gray-600">Saved.</p>
              </Transition>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

export default ExamForm
