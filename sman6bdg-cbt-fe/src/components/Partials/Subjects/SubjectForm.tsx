import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { Transition } from '@headlessui/react'
import PrimaryButton from '@/components/PrimaryButton'
import { useRouter } from 'next/router'
import Select from 'react-select'

import { useSubjects } from '@/hooks/subjects'
import { useTranslation } from 'next-i18next'
import { toastHelper } from '@/helpers/toast-helper'
import { AxiosError } from 'axios'

const SubjectForm = ({
  id: subjectId = null
}: {
  id?: string | null
}): JSX.Element => {
  const router = useRouter()

  const { createSubject, updateSubject } = useSubjects()

  const { t: subjectTrans } = useTranslation('subject')
  const { t: commonTrans } = useTranslation('common')

  const [name, setName] = useState('')
  const [teacherId, setTeacherId] = useState(null)
  const [tempClasses, setTempClasses] = useState<Classes | null>(null)
  const [listSubjectClasses, setListSubjectClasses] = useState<Classes[]>([])

  const [listClasses, setListClasses] = useState<ReactSelectOption[]>([])
  const [listTeacher, setListTeacher] = useState<ReactSelectOption[]>([])

  useEffect(() => {
    const fetchClass = async (): Promise<void> => {
      if (subjectId === null || subjectId === undefined) return

      const subject = await axios.get(`api/subjects/${subjectId}`)
      const data = subject.data.data.data
      setName(data.name)
      setTeacherId(data.teacher_id)
      setListSubjectClasses(data.classes)
    }

    fetchClass().catch((err) => {
      toastHelper.error(err)

      if (err.response.status === 404) {
        void router.replace('/subjects')
      }
    })
  }, [subjectId, router])

  const [errors, setErrors] = useState<{
    name?: string[]
    teacher_id?: string[]
  }>({})
  const [status, setStatus] = useState<any>(null)

  useEffect(() => {
    const fetchSubject = async (): Promise<void> => {
      const classes = await axios.get('api/classes', {
        params: {
          limit: 0
        }
      })

      const data = classes.data.data.data

      const listMapClasses = data.data?.map((classes: Classes) => {
        return {
          value: classes,
          label: classes.name
        }
      })

      setListClasses(listMapClasses)
    }
    fetchSubject().catch((err) => {
      toastHelper.error(err)

      if (err instanceof AxiosError && err?.response?.status === 404) {
        void router.replace('/subjects')
      }
    })
  }, [router])

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      const teacher = await axios.get('api/users', {
        params: {
          limit: 0,
          role: 'teacher'
        }
      })

      const data = teacher.data.data.data

      const listMapTeacher = data.data?.map((teacher: User) => {
        return {
          value: teacher,
          label: teacher?.profile?.name ?? teacher?.username
        }
      })

      setListTeacher(listMapTeacher)
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
      teacher_id: teacherId,
      classes_id: listSubjectClasses.map((classes: Classes) => classes.id)
    }
    try {
      if (subjectId != null) {
        await updateSubject(subjectId, data)
        setStatus('submit-success')
      } else {
        await createSubject(data)
      }

      await router.push('/subjects')
    } catch (err: any) {
      toastHelper.error(err)
      if (err.response.status !== 422) return

      setErrors(err.response.data.data)
    }
  }

  const handleAddClassSubject = (): void => {
    if (tempClasses === null || tempClasses === undefined) return

    if (tempClasses.id === undefined || tempClasses.id === null) return

    if (listSubjectClasses.includes(tempClasses)) return

    setListSubjectClasses([...listSubjectClasses, tempClasses])
    setTempClasses(null)
  }

  return (
    <section>
      <header>
        <h2 className="border-b-2 border-b-slate-600 pb-2 text-lg font-medium text-gray-900 ">
          {commonTrans('form')} {subjectTrans('name')}
        </h2>
      </header>
      <div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid">
            {/* Name */}
            <div className="mb-4">
              <Label htmlFor="name">{subjectTrans('label.name')}</Label>
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
                placeholder={subjectTrans('placeholder.name') ?? ''}
              />
              <InputError messages={errors.name} className="mt-2" />
            </div>
            {/* Teacher */}
            <div className="mb-4">
              <Label htmlFor="teacher">{subjectTrans('label.teacher')}</Label>
              <Select
                className="my-react-select-container col-span-2 mt-1 block w-full"
                classNamePrefix="my-react-select"
                instanceId="teacher"
                options={listTeacher}
                onChange={(e: any) => {
                  setTeacherId(e.value.id)
                }}
                value={
                  teacherId != null &&
                  listTeacher.find((item: any) => item.value.id === teacherId)
                }
                placeholder={commonTrans('select', {
                  name: subjectTrans('label.teacher')
                })}
              />
              <InputError messages={errors.teacher_id} className="mt-2" />
            </div>
          </div>
          <div className="grid">
            <h2 className="mb-4 border-b-2 border-b-slate-600 pb-2 text-lg font-medium text-gray-900 ">
              {subjectTrans('label.classes')}
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <Select
                className="my-react-select-container col-span-2 mt-1 block w-full"
                classNamePrefix="my-react-select"
                instanceId="classes"
                options={listClasses.filter((item: any) => {
                  const listClassesId = listSubjectClasses.map(
                    (classes: Classes) => classes.id
                  )
                  return !listClassesId.includes(item.value.id)
                })}
                onChange={(e: any) => {
                  setTempClasses(e.value)
                }}
                value={
                  tempClasses != null &&
                  listClasses.find((item: any) => item.value === tempClasses)
                }
                placeholder={commonTrans('select', {
                  name: subjectTrans('label.classes')
                })}
              />

              <button
                type="button"
                className="btn-primary btn-sm btn w-1/2 self-end"
                onClick={handleAddClassSubject}
              >
                {commonTrans('add')}
              </button>
            </div>

            <div className="my-4 overflow-x-auto">
              <table className="table-zebra mt-4 w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">No</th>
                    <th className="px-4 py-2">
                      {subjectTrans('label.classes')}
                    </th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listSubjectClasses.map((classes: Classes, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{classes.name}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          className="btn-error btn-sm btn text-white"
                          onClick={() => {
                            setListSubjectClasses(
                              listSubjectClasses.filter(
                                (item: any) => item !== classes
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

export default SubjectForm
