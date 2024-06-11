import AppLayout from '@/components/Layouts/AppLayout'
import type { GetStaticProps } from 'next'

import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { shallow } from 'zustand/shallow'
import Image from 'next/image'
import useAuthStore from '@/stores/auth-store'

export default function Home(): JSX.Element {
  const [pickedImage, setPickedImage] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)

  const [user, getUser] = useAuthStore(
    (state) => [state.user, state.getUser],
    shallow
  )
  const { t: commonTrans } = useTranslation('common')

  useEffect(() => {
    if (user === null) void getUser()
  }, [getUser, user])

  const tmpImg = user?.profile?.images_local

  useEffect(() => {
    if (tmpImg !== undefined && tmpImg !== null && tmpImg.length > 0) {
      setPickedImage(URL.createObjectURL(tmpImg[0]))
    }
  }, [tmpImg, user])

  useEffect(() => {
    const now = new Date().getHours()

    if (now < 12) {
      setTime(commonTrans('welcome.time.morning'))
    } else if (now < 18) {
      setTime(commonTrans('welcome.time.afternoon'))
    } else {
      setTime(commonTrans('welcome.time.night'))
    }
  }, [commonTrans])

  return (
    <>
      <AppLayout
        header={
          <h2 className="text-xl font-semibold leading-tight text-gray-800 ">
            Dashboard
          </h2>
        }
        title="Dashboard"
      >
        <div className="m-auto max-w-7xl p-4">
          <div className="flex w-full flex-col items-center rounded-lg bg-white px-4 py-8">
            <Image
              src={
                pickedImage ??
                user?.profile?.image_path ??
                '/assets/images/user.png'
              }
              alt="profile"
              width={128}
              height={128}
              className="mb-4 aspect-square rounded-full object-cover"
            />
            <span>{commonTrans('welcome.text', { time })}</span>
            <h1 className="text-xl font-bold leading-none">
              {user?.profile?.name}
            </h1>
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
