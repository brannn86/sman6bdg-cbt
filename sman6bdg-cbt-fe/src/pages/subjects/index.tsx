import axios from '@/lib/axios'
import AppLayout from '@/components/Layouts/AppLayout'
import Link from 'next/link'
import { useSubjects } from '@/hooks/subjects'
import { useEffect, useState } from 'react'
import Pagination from '@/components/Pagination'
import { calculateOffset } from '@/helpers/common-helper'
import useAuthStore from '@/stores/auth-store'
import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { toastHelper } from '@/helpers/toast-helper'

const Subjects = (): JSX.Element => {
  const isRole = useAuthStore((state) => state.isRole)

  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  const { t: subjectTrans } = useTranslation('subject')
  const { t: commonTrans } = useTranslation('common')

  useEffect(() => {
    if (isRole(['admin', 'developer'])) {
      setIsAdmin(true)
    }
  }, [isRole])

  const { deleteSubject } = useSubjects()
  const [subjects, setSubjects] = useState<SubjectPagination | null>(null)
  const [selectedId, setSelectedId] = useState<number>(0)
  const [params, setParams] = useState({
    limit: 5,
    page: 1,
    search: ''
  })
  useEffect(() => {
    const fetchSubjects = async (): Promise<void> => {
      const subjects = await axios.get('api/subjects', { params })
      const data = subjects.data.data.data
      setSubjects(data)
    }
    fetchSubjects().catch((err) => {
      toastHelper.error(err)
    })
  }, [params])

  const handleDelete = (id: number): void => {
    deleteSubject(id).then(() => {
      if (subjects === null) return

      setSubjects({
        ...subjects,
        data: subjects?.data?.filter((subjectItem) => subjectItem.id !== id)
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
            {subjectTrans('name')}
          </h2>
        }
        title={`${subjectTrans('name')}`}
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
              {isAdmin && (
                <Link
                  href={'/subjects/create'}
                  className="btn-primary btn-sm btn gap-2 self-end text-sm"
                >
                  {commonTrans('create')}
                </Link>
              )}
            </div>
          </div>

          <div className="my-4">
            <div className="overflow-x-auto">
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th className="text-center">
                      {subjectTrans('label.name')}
                    </th>
                    <th className="text-center">
                      {subjectTrans('label.teacher')}
                    </th>
                    <th className="text-center">
                      {subjectTrans('label.action')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjects?.data?.map((subjectItem: Subject, index) => {
                    return (
                      <tr key={index}>
                        {/* iteration with pagination */}
                        <td>{calculateOffset(subjects, index)}</td>
                        <td className="text-center">{subjectItem.name}</td>
                        <td className="text-center">
                          {subjectItem?.teacher?.profile?.name ??
                            subjectItem?.teacher?.username}
                        </td>
                        <td className="flex justify-center gap-2">
                          <Link
                            href={`/subjects/${subjectItem.id}/question`}
                            className="btn-primary btn-sm btn"
                          >
                            {subjectTrans('question.name')}
                          </Link>
                          {isAdmin && (
                            <>
                              <Link
                                href={`/subjects/${subjectItem.id}/edit`}
                                className="btn-secondary btn-sm btn"
                              >
                                {commonTrans('edit')}
                              </Link>
                              <label
                                htmlFor="delete-modal"
                                className="btn-error btn-sm btn text-white"
                                onClick={() => {
                                  setSelectedId(subjectItem.id)
                                }}
                              >
                                {commonTrans('delete')}
                              </label>
                            </>
                          )}
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
              currentPage={subjects?.current_page ?? 1}
              lastPage={subjects?.last_page ?? 1}
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
      ...(await serverSideTranslations(locale ?? 'id', ['subject', 'common']))
    }
  }
}

export default Subjects
