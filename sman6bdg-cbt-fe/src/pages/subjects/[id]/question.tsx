import axios from '@/lib/axios'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import AppLayout from '@/components/Layouts/AppLayout'
import { useQuestion } from '@/hooks/subjects'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toastHelper } from '@/helpers/toast-helper'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const SubjectsQuestion = (): JSX.Element => {
  const router = useRouter()

  const { t: subjectTrans } = useTranslation('subject')
  const { t: commonTrans } = useTranslation('common')

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [options, setOptions] = useState<any>([''])
  const [imagesOption, setImagesOption] = useState<any>([null])
  const [imagesOptionUrl, setImagesOptionUrl] = useState<any>([null])
  const [images, setImages] = useState<any>([])
  const [imageUrl, setImageUrl] = useState<any>([])

  const [listQuestions, setListQuestions] = useState<any>({})
  const [selectedId, setSelectedId] = useState<number>(0)

  const [errors, setErrors] = useState<{
    question?: string[]
    answer?: string[]
    options?: string[][]
    images?: string[]
  }>({})

  const [params, setParams] = useState({
    limit: 0,
    page: 1,
    search: ''
  })

  const {
    createQuestion: fetchCreateQuestion,
    updateQuestion: fetchUpdateQuestion,
    deleteQuestion
  } = useQuestion()

  useEffect(() => {
    const fetchQuestions = async (): Promise<void> => {
      const questions = await axios.get('api/questions', {
        params: {
          ...params,
          subject_id: router.query.id
        }
      })

      const data = questions.data.data.data
      setListQuestions(data)
    }
    fetchQuestions().catch((err) => {
      toastHelper.error(err)
    })
  }, [params, router.query.id])

  const handleAddOption = (): void => {
    if (options.length === 5) {
      toastHelper.warning('Maksimal 5 opsi')
      return
    }

    setOptions([...options, ''])
    setImagesOption([...imagesOption, null])
  }

  const handleAddImage = (): void => {
    setImages([...images, null])
  }

  const handleShowModalUpdate = (id: number): void => {
    const question = listQuestions.data?.find(
      (questionItem: Question) => questionItem.id === id
    )

    if (question != null) {
      setQuestion(question.question)
      setAnswer(question.answer.answer)
      setOptions(question.options)
      if (question.images != null) {
        setImages([...question.images])
        setImageUrl([...question.image_url])
      }
      if (question.images_options != null) {
        setImagesOption([...question.images_options])
        setImagesOptionUrl([...question.image_options_url])
      }
    }

    const checkbox = document.getElementById(
      'form-question'
    ) as HTMLInputElement
    checkbox.checked = true

    setSelectedId(id)
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setErrors({})

    const formData = new FormData()
    formData.append('question', question)
    formData.append('answer', answer)
    formData.append('subject_id', router.query.id as string)

    if (images != null) {
      images.forEach((item: any, key: number) => {
        formData.append(`images[${key}]`, item)
      })
    }

    options.forEach((item: any, key: number) => {
      formData.append(`options[${key}]`, item)
    })

    if (imagesOption != null) {
      imagesOption.forEach((item: any, key: number) => {
        formData.append(`images_options[${key}]`, item)
      })
    }

    try {
      if (selectedId !== 0) {
        await fetchUpdateQuestion(selectedId, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        await fetchCreateQuestion(formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      setQuestion('')
      setAnswer('')
      setOptions([''])
      setImages([])
      setImagesOptionUrl([])
      setParams({ ...params, page: 1 })

      setSelectedId(0)

      const checkbox = document.getElementById(
        'form-question'
      ) as HTMLInputElement
      checkbox.checked = false
    } catch (err: any) {
      toastHelper.error(err)
      if (err.response.status !== 422) return

      setErrors(err.response.data.data)
    }
  }

  const handleDelete = (id: number): void => {
    deleteQuestion(id).then(() => {
      listQuestions.data = listQuestions.data?.filter(
        (questionItem: Question) => questionItem.id !== id
      )

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
            {commonTrans('create')} {subjectTrans('question.name')}
          </h2>
        }
        title={`${commonTrans('create')} ${subjectTrans('question.name')}`}
        modal={
          <>
            {/* Modal - Form Question */}
            <div>
              <input
                type="checkbox"
                id="form-question"
                className="modal-toggle"
              />
              <div className="modal z-[1000]">
                <div className="modal-box w-11/12 max-w-full">
                  <h3 className="text-lg font-bold">
                    {commonTrans('add')} {subjectTrans('question.name')}
                  </h3>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="py-4">
                      <div className="grid">
                        {/* Question */}
                        <div className="mb-4">
                          <Label htmlFor="question">
                            {subjectTrans('question.name')}
                          </Label>
                          <Input
                            id="question"
                            type="text"
                            name="question"
                            value={question}
                            className="mt-1 block w-full"
                            onChange={(event) => {
                              setQuestion(event.target.value)
                            }}
                            required
                            autoFocus
                            placeholder="Question"
                          />
                          <InputError
                            className="mt-2"
                            messages={errors.question}
                          />
                        </div>
                        <div className="mb-4">
                          <Label htmlFor="answer">
                            {subjectTrans('question.label.answer')}
                          </Label>
                          <table className="mt-1 table w-full">
                            <thead>
                              <tr>
                                <th className="w-1/12 px-4 py-2">No</th>
                                <th className="px-4 py-2">
                                  {subjectTrans('question.label.answer')}
                                </th>
                                <th className="px-4 py-2">
                                  {subjectTrans('question.label.correct')}
                                </th>
                                <th className="px-4 py-2">
                                  {subjectTrans('question.label.image')}
                                </th>
                                <th className="px-4 py-2 text-center">
                                  {subjectTrans('question.label.action')}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {options.map((item: any, key: number) => (
                                <tr key={key}>
                                  <td className="w-1/12 px-4 py-2">
                                    {key + 1}
                                  </td>
                                  <td className="px-4 py-2">
                                    <Input
                                      type="text"
                                      name="answer"
                                      value={item}
                                      className="mt-1 block w-full"
                                      onChange={(event) => {
                                        const newOptions = [...options]
                                        newOptions[key] = event.target.value
                                        setOptions(newOptions)
                                      }}
                                      required
                                      autoFocus
                                      placeholder="Answer"
                                    />
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    <input
                                      type="radio"
                                      name="answer"
                                      value={key}
                                      className="checkbox-primary checkbox"
                                      onChange={(event) => {
                                        setAnswer(event.target.value)
                                      }}
                                      required
                                      autoFocus
                                      placeholder="Answer"
                                      defaultChecked={answer === key.toString()}
                                    />
                                    <InputError
                                      className="mt-2"
                                      messages={errors.answer}
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    {typeof imagesOption[key] === 'string' && (
                                      <a
                                        href={imagesOptionUrl[key]}
                                        className="btn-primary btn"
                                        target="_blank"
                                      >
                                        {imagesOption[key]}
                                      </a>
                                    )}
                                    {typeof imagesOption[key] !== 'string' && (
                                      <span>
                                        <Input
                                          id={`image-option-${key}`}
                                          type="file"
                                          onChange={(event) => {
                                            if (event.target.files == null)
                                              return

                                            const newImages = [...imagesOption]
                                            newImages[key] =
                                              event.target.files[0]
                                            setImagesOption(newImages)
                                          }}
                                          autoFocus
                                          placeholder="Image"
                                          accept="image/*"
                                          className="hidden"
                                          hidden
                                        />
                                        <label
                                          htmlFor={`image-option-${key}`}
                                          className="mt-1 w-full cursor-pointer px-4 py-2"
                                        >
                                          <span className="rounded-l-md bg-neutral px-4 py-2 text-white">
                                            Choose a file...
                                          </span>
                                          <span className="rounded-r-md bg-primary px-4 py-2 text-white">
                                            {imagesOption[key]?.name !==
                                            undefined
                                              ? imagesOption[key]?.name?.substr(
                                                  0,
                                                  20
                                                )
                                              : 'No file chosen'}
                                          </span>
                                        </label>
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    {key !== 0 && (
                                      <button
                                        type="button"
                                        className="btn-error btn-sm btn text-white"
                                        onClick={() => {
                                          setOptions(
                                            options.filter(
                                              (item: any, index: number) =>
                                                index !== key
                                            )
                                          )
                                          setImagesOption(
                                            imagesOption.filter(
                                              (item: any, index: number) =>
                                                index !== key
                                            )
                                          )
                                        }}
                                      >
                                        {commonTrans('delete')}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  colSpan={4}
                                  className="mx-auto flex w-full justify-center px-4 py-2"
                                >
                                  <button
                                    type="button"
                                    className="btn-primary btn-sm btn text-white"
                                    onClick={handleAddOption}
                                  >
                                    Add Option
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mb-4">
                          <Label htmlFor="answer">Images</Label>
                          <table className="mt-1 table w-full">
                            <thead>
                              <tr>
                                <th className="px-4 py-2">No</th>
                                <th className="px-4 py-2">Image</th>
                                <th className="px-4 py-2 text-center">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {images?.map(
                                (
                                  item: {
                                    name: string
                                  },
                                  key: number
                                ) => (
                                  <tr key={key}>
                                    <td className="px-4 py-2">{key + 1}</td>
                                    <td className="px-4 py-2">
                                      {typeof item === 'string' && (
                                        <a
                                          href={imageUrl[key]}
                                          className="btn-primary btn"
                                          target="_blank"
                                        >
                                          {item}
                                        </a>
                                      )}
                                      {typeof item !== 'string' && (
                                        <span>
                                          <Input
                                            id={`image-${key}`}
                                            type="file"
                                            onChange={(event) => {
                                              if (event.target.files == null)
                                                return

                                              const newImages = [...images]
                                              newImages[key] =
                                                event.target.files[0]
                                              setImages(newImages)
                                            }}
                                            autoFocus
                                            placeholder="Image"
                                            accept="image/*"
                                            className="hidden"
                                            hidden
                                          />
                                          <label
                                            htmlFor={`image-${key}`}
                                            className="mt-1 w-full cursor-pointer px-4 py-2"
                                          >
                                            <span className="rounded-l-md bg-neutral px-4 py-2 text-white">
                                              Choose a file...
                                            </span>
                                            <span className="rounded-r-md bg-primary px-4 py-2 text-white">
                                              {item?.name !== undefined
                                                ? item?.name?.substr(0, 20)
                                                : 'No file chosen'}
                                            </span>
                                          </label>
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                      <button
                                        type="button"
                                        className="btn-error btn-sm btn text-white"
                                        onClick={() => {
                                          const newImages = [...images]
                                          newImages.splice(key, 1)
                                          setImages(newImages)
                                        }}
                                      >
                                        {commonTrans('delete')}
                                      </button>
                                    </td>
                                  </tr>
                                )
                              )}
                              <tr>
                                <td
                                  colSpan={4}
                                  className="mx-auto flex w-full justify-center px-4 py-2"
                                >
                                  <button
                                    type="button"
                                    className="btn-primary btn-sm btn text-white"
                                    onClick={handleAddImage}
                                  >
                                    Add Image
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="modal-action">
                      <label
                        htmlFor="form-question"
                        className="btn-secondary btn-sm btn text-white"
                        onClick={() => {
                          setQuestion('')
                          setAnswer('')
                          setOptions([''])
                          setImages([])
                          setSelectedId(0)
                          setImagesOption([])
                        }}
                      >
                        {commonTrans('cancel')}
                      </label>
                      <button type="submit" className="btn-primary btn-sm btn">
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Modal - Delete Question */}
            <div>
              <input
                type="checkbox"
                id="delete-modal"
                className="modal-toggle"
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
            </div>
          </>
        }
      >
        <div className="pt-12">
          <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                {/* Back */}
                <Link href="/subjects" className="flex gap-4">
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
                    <Link href={'/subjects'}>{subjectTrans('name')}</Link>
                  </li>
                  <li>
                    <span>{subjectTrans('question.name')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
              <div>
                <div className="grid">
                  <h2 className="mb-4 flex justify-between border-b-2 border-b-slate-600 pb-2 text-lg font-medium text-gray-900 ">
                    <span>{subjectTrans('question.name')}</span>
                    <span>
                      <label htmlFor="form-question" className="btn-sm btn">
                        {commonTrans('add')} {subjectTrans('question.name')}
                      </label>
                    </span>
                  </h2>

                  {/* Table - List Question */}
                  <div className="overflow-x-auto">
                    <table className="mt-1 table w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">No</th>
                          <th className="px-4 py-2">
                            {subjectTrans('question.name')}
                          </th>
                          <th className="px-4 py-2">
                            {subjectTrans('question.label.answer')}
                          </th>
                          <th className="px-4 py-2 text-center">
                            {subjectTrans('question.label.action')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listQuestions.data?.map((item: any, key: number) => (
                          <tr key={key}>
                            <td className="px-4 py-2">{key + 1}</td>
                            <td className="px-4 py-2">{item.question}</td>
                            <td className="px-4 py-2">
                              {item.options[item.answer.answer]}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                className="btn-primary btn-sm btn mx-2 text-white"
                                onClick={() => {
                                  handleShowModalUpdate(item.id)
                                }}
                              >
                                {commonTrans('edit')}
                              </button>
                              <label
                                htmlFor="delete-modal"
                                className="btn-error btn-sm btn mx-2 text-white"
                                onClick={() => {
                                  setSelectedId(item.id)
                                }}
                              >
                                {commonTrans('delete')}
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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
      ...(await serverSideTranslations(locale ?? 'id', ['common', 'subject']))
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export default SubjectsQuestion
