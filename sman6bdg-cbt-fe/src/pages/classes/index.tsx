import AppLayout from '@/components/Layouts/AppLayout'
import Link from 'next/link'
import { useClasses } from '@/hooks/classes'
import { useEffect, useState } from 'react'
import Pagination from '@/components/Pagination'
import { calculateOffset } from '@/helpers/common-helper'
import axios from '@/lib/axios'
import useAuthStore from '@/stores/auth-store'
import { toastHelper } from '@/helpers/toast-helper'
import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Classes = (): JSX.Element => {
  const { t: commonTrans } = useTranslation('common')
  const isRole = useAuthStore((state) => state.isRole)
  const { deleteClasses } = useClasses()
  const [classes, setClasses] = useState<ClassesPagination | null>(null)
  const [selectedId, setSelectedId] = useState<number>(0)
  const [params, setParams] = useState({
    limit: 5,
    page: 1,
    search: '',
    role: ''
  })

  useEffect(() => {
    const fetchClasses = async (): Promise<void> => {
      if (!isRole(['admin', 'developer'])) return

      const classes = await axios.get('api/classes', { params })
      const data = classes.data.data.data
      setClasses(data)
    }
    fetchClasses().catch((err) => {
      toastHelper.error(err)
    })
  }, [params, isRole])

  const handleDelete = (id: number): void => {
    deleteClasses(id).then(() => {
      if (classes === null) return

      setClasses({
        ...classes,
        data: classes?.data?.filter((classItem) => classItem.id !== id)
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
            Classes Management
          </h2>
        }
        title="Classes Management"
      >
        <div className="mx-4 my-2">
          <div className="flex justify-between gap-4">
            <div className="flex gap-4">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Search Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Name..."
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
                  <span className="label-text">Limit</span>
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
                href={'/classes/create'}
                className="btn-primary btn-sm btn gap-2 self-end text-sm"
              >
                {commonTrans('create')} Class
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
                    <th className="text-center">Name</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes?.data?.map((classItem: Classes, index) => {
                    return (
                      <tr key={index}>
                        {/* iteration with pagination */}
                        <td>{calculateOffset(classes, index)}</td>
                        <td className="text-center">{classItem.name}</td>
                        <td className="flex justify-center gap-2">
                          <Link
                            href={`/classes/${classItem.id}/edit`}
                            className="btn-secondary btn-sm btn"
                          >
                            {commonTrans('edit')}
                          </Link>
                          <label
                            htmlFor="delete-modal"
                            className="btn-error btn-sm btn text-white"
                            onClick={() => {
                              setSelectedId(classItem.id)
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
              currentPage={classes?.current_page ?? 1}
              lastPage={classes?.last_page ?? 1}
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
      ...(await serverSideTranslations(locale ?? 'id', ['classes', 'common']))
    }
  }
}

export default Classes
