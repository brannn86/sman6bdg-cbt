import axios from '@/lib/axios'
import AppLayout from '@/components/Layouts/AppLayout'
import Link from 'next/link'
import { useUser } from '@/hooks/user'
import { useEffect, useRef, useState } from 'react'
import Pagination from '@/components/Pagination'
import { calculateOffset } from '@/helpers/common-helper'
import useAuthStore from '@/stores/auth-store'
import { toastHelper } from '@/helpers/toast-helper'
import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Users = (): JSX.Element => {
  const { t: commonTrans } = useTranslation('common')
  const isRole = useAuthStore((state) => state.isRole)
  const { deleteUser } = useUser()
  const [users, setUsers] = useState<UserPagination | null>(null)
  const [selectedId, setSelectedId] = useState<number>(0)
  const modalDelete = useRef<HTMLInputElement>(null)
  const modalImport = useRef<HTMLInputElement>(null)
  const [params, setParams] = useState({
    limit: 5,
    page: 1,
    search: '',
    role: ''
  })

  const [file, setFile] = useState<File | null>(null)

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files == null) {
      return
    }

    const file = event.target.files[0]
    setFile(file)
  }

  const handleImport = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    if (file === null) {
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post('api/users/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toastHelper.success('Import data success')

      const checkbox = modalImport.current
      if (checkbox !== null) {
        checkbox.checked = false
      }

      setParams({
        ...params,
        page: 1
      })
    } catch (error) {
      toastHelper.error(error)
    }
  }

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      if (!isRole(['admin', 'developer'])) return

      const users = await axios.get('api/users', { params })
      const data = users.data.data.data
      setUsers(data)
    }
    fetchUsers().catch((err) => {
      toastHelper.error(err)
    })
  }, [params, isRole])

  const handleDelete = (id: number): void => {
    deleteUser(id).then(() => {
      if (users === null) return

      setUsers({
        ...users,
        data: users?.data?.filter((userItem) => userItem.id !== id)
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
            Users Management
          </h2>
        }
        title={`Users Management`}
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

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Roles</span>
                </label>
                <select
                  className="select-bordered select select-sm w-full max-w-xs text-sm"
                  onChange={(e) => {
                    setParams({
                      ...params,
                      role: e.target.value
                    })
                  }}
                >
                  <option value="">Select Role</option>
                  <option>Student</option>
                  <option>Teacher</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href={'/users/create'}
                className="btn-primary btn-sm btn gap-2 self-end text-sm"
              >
                {commonTrans('create')} User
              </Link>
              <label
                htmlFor="modal-import"
                className="btn-primary btn-sm btn gap-2 self-end text-sm"
              >
                {commonTrans('import')} User
              </label>
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
                    <th className="text-center">Username</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Roles</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.data?.map((user: User, index) => {
                    return (
                      <tr key={index}>
                        {/* iteration with pagination */}
                        <td>{calculateOffset(users, index)}</td>
                        <td className="text-center">{user.profile?.name}</td>
                        <td className="text-center">{user.username}</td>
                        <td className="text-center">{user.email}</td>
                        <td className="text-center">
                          {Array.isArray(user.roles) &&
                            user.roles.map((role: Role, indexRole: number) => {
                              return (
                                <div
                                  className="badge-primary badge"
                                  key={indexRole}
                                >
                                  {role.name}
                                </div>
                              )
                            })}
                        </td>
                        <td className="flex justify-center gap-2">
                          <Link
                            href={
                              user.id !== null ? `/users/${user.id}/edit` : ''
                            }
                            className="btn-secondary btn-sm btn"
                          >
                            {commonTrans('edit')}
                          </Link>
                          <label
                            htmlFor="delete-modal"
                            className="btn-error btn-sm btn text-white"
                            onClick={() => {
                              if (user.id === null) return
                              setSelectedId(user.id)
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
              currentPage={users?.current_page ?? 1}
              lastPage={users?.last_page ?? 1}
              onPageChange={(page: number) => {
                setParams({
                  ...params,
                  page
                })
              }}
            />
          </div>
        </div>

        <input
          type="checkbox"
          id="delete-modal"
          className="modal-toggle"
          ref={modalDelete}
        />
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

        <input
          type="checkbox"
          id="modal-import"
          className="modal-toggle"
          ref={modalImport}
        />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="text-lg font-bold">{commonTrans('import')}</h3>
            <form onSubmit={handleImport}>
              <div className="form-control">
                <a
                  href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/files/import-user.xlsx`}
                  className="mb-4 mt-2 w-full rounded-md bg-sky-300 px-2 py-4 font-extrabold text-slate-50 opacity-80 shadow-md"
                >
                  Download Example File
                </a>
                <input
                  type="file"
                  className="file-input w-full max-w-xs"
                  onChange={handleFileInputChange}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </div>
              <div className="modal-action">
                <button className="btn-primary btn-sm btn">
                  {commonTrans('import')}
                </button>
                <label htmlFor="modal-import" className="btn-sm btn">
                  {commonTrans('cancel')}
                </label>
              </div>
            </form>
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

export default Users
