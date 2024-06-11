import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { Transition } from '@headlessui/react'
import PrimaryButton from '@/components/PrimaryButton'
import { useRouter } from 'next/router'
import Select from 'react-select'

import { useClasses } from '@/hooks/classes'
import { toastHelper } from '@/helpers/toast-helper'
import { AxiosError } from 'axios'
import { useTranslation } from 'next-i18next'

const ClassForm = ({
  id: classId = null
}: {
  id?: string | null
}): JSX.Element => {
  const router = useRouter()
  const { t: commonTrans } = useTranslation('common')

  const { createClasses, updateClasses } = useClasses()

  const [name, setName] = useState('')
  const [tempStudent, setTempStudent] = useState<User>({
    id: 0,
    username: '',
    email: ''
  })
  const [listStudentClass, setListStudentClass] = useState<User[]>([])
  const [listStudent, setListStudent] = useState<ReactSelectOption[]>([])

  useEffect(() => {
    const fetchClass = async (): Promise<void> => {
      if (classId === null || classId === undefined) return

      const classes = await axios.get(`api/classes/${classId}`)

      const data = classes.data.data.data
      setName(data.name)
      setListStudentClass(data.students)
    }

    fetchClass().catch((err) => {
      toastHelper.error(err)

      if (err instanceof AxiosError && err?.response?.status === 404) {
        void router.replace('/classes')
      }
    })
  }, [classId, router])

  const [errors, setErrors] = useState<{
    name?: string[]
  }>({})
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      const student = await axios.get('api/users', {
        params: {
          limit: 0,
          role: 'student'
        }
      })

      const data = student.data.data.data

      const listMapStudent = data.data?.map((student: User) => {
        return {
          value: student,
          label: student?.profile?.name ?? student.username
        }
      })

      setListStudent(listMapStudent)
    }
    fetchUsers().catch((err) => {
      toastHelper.error(err)
    })
  }, [])

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setErrors({})

    const data = {
      name,
      student_id: listStudentClass.map((student: User) => student.id)
    }
    try {
      if (classId != null) {
        await updateClasses(classId, data)
        setStatus('submit-success')
      } else {
        await createClasses(data)
      }

      await router.push('/classes')
    } catch (err: any) {
      toastHelper.error(err)
      if (err.response.status !== 422) return

      setErrors(err.response.data.data)
    }
  }

  const handleAddStudent = (): void => {
    if (tempStudent === null || tempStudent === undefined) return

    if (tempStudent.id === 0) return

    if (listStudentClass.includes(tempStudent)) return

    setListStudentClass([...listStudentClass, tempStudent])
    setTempStudent({
      id: 0,
      username: '',
      email: ''
    })
  }

  return (
    <section>
      <header>
        <h2 className="border-b-2 border-b-slate-600 pb-2 text-lg font-medium text-gray-900">
          {commonTrans('form')} Class
        </h2>
      </header>
      <div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
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
                placeholder="Name"
              />
              <InputError messages={errors.name} className="mt-2" />
            </div>
          </div>

          <div className="grid">
            <h2 className="mb-4 border-b-2 border-b-slate-600 pb-2 text-lg font-medium text-gray-900">
              Student
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <Select
                instanceId="student"
                options={listStudent.filter((student: any) => {
                  const listStudentClassId = listStudentClass.map(
                    (student: User) => student.id
                  )
                  return !listStudentClassId.includes(student.value.id)
                })}
                onChange={(e: any) => {
                  setTempStudent(e.value)
                }}
                value={
                  tempStudent != null &&
                  listStudent.find(
                    (student: any) => student.value.id === tempStudent.id
                  )
                }
                className="col-span-2 mt-1 block w-full"
                placeholder="Select Student"
              />

              <button
                type="button"
                className="btn-primary btn-sm btn w-1/2 self-end"
                onClick={handleAddStudent}
              >
                Add
              </button>
            </div>

            <div className="my-4 overflow-x-auto">
              <table className="table-zebra mt-4 w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">No</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listStudentClass.map((student: User, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{student?.profile?.name}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          className="btn-error btn-sm btn text-white"
                          onClick={() => {
                            setListStudentClass(
                              listStudentClass.filter(
                                (item: any) => item !== student
                              )
                            )
                          }}
                        >
                          {commonTrans('delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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

export default ClassForm
