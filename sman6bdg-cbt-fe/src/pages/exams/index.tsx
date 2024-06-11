import AppLayout from '@/components/Layouts/AppLayout'
import Link from 'next/link'
import { useExams } from '@/hooks/exams'
import { useEffect, useState } from 'react'
import Pagination from '@/components/Pagination'
import axios from '@/lib/axios'
import { calculateOffset } from '@/helpers/common-helper'
import { toastHelper } from '@/helpers/toast-helper'
import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Exams = (): JSX.Element => {
  const { t: examTrans } = useTranslation('exam')
  const { t: commonTrans } = useTranslation('common')

  const { deleteExam } = useExams()
  const [exams, setExams] = useState<ExamPagination | null>(null)
  const [selectedId, setSelectedId] = useState<number>(0)
  const [params, setParams] = useState({
    limit: 5,
    page: 1,
    search: ''
  })

  useEffect(() => {
    const fetchExams = async (): Promise<void> => {
      const data = await axios.get('api/exams', { params })
      setExams(data.data.data.data)
    }
    fetchExams().catch((err) => {
      toastHelper.error(err)
    })
  }, [params])

  const handleDelete = (id: number): void => {
    deleteExam(id).then(() => {
      if (exams === null) return

      setExams({
        ...exams,
        data: exams?.data?.filter((examItem) => examItem.id !== id)
      })

      setSelectedId(0)

      const checkbox = document.getElementById(
        'delete-modal'
      ) as HTMLInputElement
      checkbox.checked = false
    })
  }

  return (
    <>
      <AppLayout
        header={
          <h2 className="text-xl font-semibold leading-tight text-gray-800 ">
            {examTrans('name')}
          </h2>
        }
        title={examTrans('name')}
      >
        <div className="mx-4 my-2">
          <div className="flex justify-between gap-4">
            <div className="flex gap-4">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">{commonTrans('search')}</span>
                </label>
                <input
                  type="text"
                  placeholder={commonTrans('search') ?? '...'}
                  id="name"
                  className="input input-sm w-full max-w-xs text-sm"
                  onChange={(e) => {
                    setParams({
                      ...params,
                      search: e.target.value
                    })
                  }}
                  value={params.search}
                />
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">{commonTrans('limit')}</span>
                </label>
                <select
                  className="select-bordered select select-sm w-full max-w-xs text-sm"
                  onChange={(e) => {
                    setParams({
                      ...params,
                      limit: parseInt(e.target.value)
                    })
                  }}
                  value={params.limit}
                >
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href={'/exams/create'}
                className="btn-primary btn-sm btn gap-2 self-end text-sm"
              >
                {commonTrans('create')} {examTrans('name')}
              </Link>
            </div>
          </div>

          <div className="my-4">
            <div className="overflow-x-auto">
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th className="text-center">{examTrans('label.name')}</th>
                    <th className="text-center">
                      {examTrans('label.start_at')}
                    </th>
                    <th className="text-center">{examTrans('label.end_at')}</th>
                    <th className="text-center">{examTrans('label.status')}</th>
                    <th className="text-center">{examTrans('label.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {exams?.data?.map((examItem: Exam, index) => {
                    return (
                      <tr key={index}>
                        {/* iteration with pagination */}
                        <td>{calculateOffset(exams, index)}</td>
                        <td className="text-center">{examItem.name}</td>
                        <td className="text-center">
                          {new Date(examItem.start_at).toLocaleString('id')}
                        </td>
                        <td className="text-center">
                          {new Date(examItem.end_at).toLocaleString('id')}
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge ${
                              examItem.status === 'ongoing'
                                ? 'badge-primary'
                                : examItem.status === 'finished'
                                ? 'badge-accent'
                                : 'badge-secondary'
                            }`}
                          >
                            {examTrans(`category_status.${examItem.status}`)}
                          </span>
                        </td>
                        <td className="flex justify-center gap-2">
                          <Link
                            href={`/exams/${examItem.id}/student-exams`}
                            className="btn-primary btn-sm btn"
                          >
                            {examTrans('student_exam.name')}
                          </Link>
                          <Link
                            href={`/exams/${examItem.id}/edit`}
                            className="btn-secondary btn-sm btn"
                          >
                            {commonTrans('edit')}
                          </Link>
                          <label
                            htmlFor="delete-modal"
                            className="btn-error btn-sm btn text-white"
                            onClick={() => {
                              setSelectedId(examItem.id)
                            }}
                          >
                            {commonTrans('delete')}
                          </label>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="my-4">
            <Pagination
              currentPage={exams?.current_page ?? 1}
              lastPage={exams?.last_page ?? 1}
              onPageChange={(page: number) => {
                setParams({
                  ...params,
                  page
                })
              }}
            />
          </div>
        </div>

        <input type="checkbox" id="delete-modal" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="text-lg font-bold">{commonTrans('delete')}</h3>
            <p className="py-4">{commonTrans('delete_confirm')}</p>
            <div className="modal-action">
              <button
                className="btn-primary btn-sm btn"
                onClick={() => {
                  handleDelete(selectedId)
                }}
              >
                {commonTrans('delete')}
              </button>
              <label htmlFor="delete-modal" className="btn-sm btn">
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

export default Exams
