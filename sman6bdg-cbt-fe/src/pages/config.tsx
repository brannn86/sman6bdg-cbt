import AppLayout from '@/components/Layouts/AppLayout'
import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import PrimaryButton from '@/components/PrimaryButton'
import ProgressCircular from '@/components/ProgressCircular'
import Label from '@/components/Label'
import useConfigStore from '@/stores/config-store'

interface Logo {
  logo_local?: FileList | null
}

const Config = (): JSX.Element => {
  const { t: commonTrans } = useTranslation('common')

  const [logo, getLogo, updateLogo] = useConfigStore((state) => [
    state.logo,
    state.getLogo,
    state.updateLogo
  ])

  useEffect(() => {
    void getLogo()
  }, [getLogo])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pickedImage, setPickedImage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = useForm<Logo>({
    defaultValues: {
      logo_local: null
    }
  })

  const tmpImg = watch('logo_local')

  useEffect(() => {
    if (tmpImg !== undefined && tmpImg !== null && tmpImg.length > 0) {
      setPickedImage(URL.createObjectURL(tmpImg[0]))
    }
  }, [tmpImg])

  const submitForm: SubmitHandler<Logo> = async (data): Promise<void> => {
    setIsLoading(true)

    const file = data.logo_local?.[0]

    if (file === undefined) {
      setError('logo_local', {
        type: 'required',
        message: `${commonTrans('form_validation.photo.required')}`
      })
      setIsLoading(false)
      return
    }

    if (
      file?.type !== 'image/jpeg' &&
      file?.type !== 'image/png' &&
      file?.type !== 'image/jpg'
    ) {
      setError('logo_local', {
        type: 'filetype',
        message: ` ${commonTrans('form_validation.photo.file_type')}`
      })
      setIsLoading(false)
      return
    }

    if (file?.size > 1024 * 1024 * 4) {
      setError('logo_local', {
        type: 'filesize',
        message: `${commonTrans('form_validation.photo.file_size')}`
      })
      setIsLoading(false)
      return
    }

    await updateLogo(file)
    setIsLoading(false)
  }

  return (
    <>
      <AppLayout
        header={
          <h2 className="text-xl font-semibold leading-tight text-gray-800 ">
            {commonTrans('configuration')}
          </h2>
        }
        title={`${commonTrans('configuration')}`}
      >
        <div className="mx-4 my-2">
          <div className="tabs">
            <a className="tab-lifted tab tab-active">Logo</a>
          </div>
          <div className="w-full rounded-b-xl rounded-r-xl bg-white px-4 py-2">
            <form
              onSubmit={handleSubmit(submitForm)}
              className="mt-6 space-y-6"
            >
              <div className="h-full w-full ">
                <div>
                  <Label htmlFor="logo">Logo Aplikasi</Label>
                  <div className="mt-4 flex items-center">
                    <div>
                      <Image
                        width={128}
                        height={128}
                        priority
                        className="aspect-square rounded-full object-cover"
                        src={
                          pickedImage ?? logo ?? '/assets/images/LOGOCBT6.png'
                        }
                        alt="Profile"
                      />
                    </div>
                    <div className="ml-4">
                      <input
                        {...register('logo_local')}
                        id="logo"
                        type="file"
                        accept="image/*"
                      />
                      <div className="text-sm text-error">
                        {errors.logo_local?.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <PrimaryButton disabled={isLoading}>
                  {isLoading ? <ProgressCircular /> : commonTrans('save')}
                </PrimaryButton>
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
      ...(await serverSideTranslations(locale ?? 'id', ['common']))
    }
  }
}

export default Config
