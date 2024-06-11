import AppLayout from '@/components/Layouts/AppLayout'
import { toastHelper } from '@/helpers/toast-helper'
import useExamsStore from '@/stores/exams-store'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'

const StudentExams = (): JSX.Element => {
  const { t: commonTrans } = useTranslation('common')
  const router = useRouter()
  const { exam, unBlockStudentExam, getExam, downloadExam } = useExamsStore(
    (state) => state
  )

  const [selectedId, setSelectedId] = useState<number>(0)

  useEffect(() => {
    if (router.query.id === null || router.query.id === undefined) return

    getExam(router.query.id as string).catch((err) => {
      toastHelper.error(err)

      if (err.response.status === 404) {
        void router.replace('/exams')
      }
    })
  }, [router, getExam])

  const handleUnBlock = (): void => {
    if (
      router.query.id === null ||
      router.query.id === undefined ||
      selectedId === 0
    )
      return

    unBlockStudentExam(router.query.id as string, selectedId)
      .then(() => {
        getExam(router.query.id as string).catch((err) => {
          toastHelper.error(err)
        })
      })
      .catch((err) => {
        toastHelper.error(err)
      })

    setSelectedId(0)

    const checkbox = document.getElementById(
      'unblock-modal'
    ) as HTMLInputElement
    checkbox.checked = false
  }

  return (
    <>
      <AppLayout
        header={
          <h2 className="text-xl font-semibold leading-tight text-gray-800 ">
            Student Exam Management
          </h2>
        }
        title={`Student Exam Management`}
      >
        <div className="pt-4">
          <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                {/* Back */}
                <Link href="/exams" className="flex gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.707 3.293a1 1 0 010 1.414L7.414 9H15a1 1 0 110 2H7.414l3.293 3.293a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {commonTrans('back')}
                </Link>
              </div>
              <div className="breadcrumbs text-sm">
                <ul>
                  <li>
                    <Link href={'/'}>{commonTrans('home')}</Link>
                  </li>
                  <li>
                    <Link href={'/exams'}>Exam</Link>
                  </li>
                  <li>Student Exams</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-4">
          <div className="my-4">
            <div className="flex justify-end">
              <div className="flex gap-4">
                <button
                  className="btn-primary btn-sm btn"
                  onClick={async () => {
                    await downloadExam(router.query.id as string, exam.name)
                  }}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
          <div className="my-4">
            <div className="overflow-x-auto rounded-md bg-white px-4 py-2">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th className="text-center">Name Student</th>
                    <th className="text-center">Score</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Blocked</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exam?.student_exams?.length !== undefined &&
                  exam?.student_exams?.length > 0 ? (
                    exam?.student_exams?.map((studentExam) => (
                      <tr key={studentExam.id}>
                        <td className="text-center">
                          <span className="text-sm text-gray-500">
                            {studentExam.id}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="text-sm text-gray-500">
                            {studentExam?.student?.profile?.name ??
                              studentExam?.student?.username}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="text-sm text-gray-500">
                            <span className="badge-primary badge">
                              {studentExam.score !== undefined &&
                                exam?.questions_count !== undefined &&
                                Math.round(
                                  (studentExam.score / exam?.questions_count) *
                                    100
                                )}
                              %
                            </span>
                          </span>
                        </td>
                        <td className="text-center font-bold">
                          {studentExam.is_done ? (
                            <span className="badge-success badge">Done</span>
                          ) : (
                            <span className="badge-primary badge">
                              Not Done
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          <span className="text-sm font-bold">
                            {studentExam.blocked ? (
                              <span className="badge-danger badge">Yes</span>
                            ) : (
                              <span className="badge-success badge">No</span>
                            )}
                          </span>
                        </td>
                        <td>
                          {studentExam.blocked ? (
                            <label
                              htmlFor="unblock-modal"
                              className="btn-primary btn-xs btn"
                              onClick={() => {
                                setSelectedId(studentExam.student_id)
                              }}
                            >
                              Unblock
                            </label>
                          ) : (
                            ''
                            // <label
                            //   htmlFor="block-modal"
                            //   className="btn-primary btn-xs btn"
                            // >
                            //   Block
                            // </label>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        <span className="text-sm text-gray-500">No Data</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Unblock */}
        <input type="checkbox" id="unblock-modal" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Unblock Student</h3>
            <p className="py-4">
              Are you sure you want to unblock this student?
            </p>
            <div className="modal-action">
              <button
                className="btn-primary btn-sm btn"
                onClick={() => {
                  handleUnBlock()
                }}
              >
                Unblock Student
              </button>
              <label htmlFor="unblock-modal" className="btn-sm btn">
                {commonTrans('cancel')}
              </label>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'id', ['exam', 'common']))
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export default StudentExams
