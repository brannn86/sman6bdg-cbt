import AppLayout from '@/components/Layouts/AppLayout'
import UpdateProfileInformationForm from '@/components/Partials/Profile/UpdateProfileInformationForm'
import UpdatePasswordForm from '@/components/Partials/Profile/UpdatePasswordForm'
import useAuthStore from '@/stores/auth-store'
import { shallow } from 'zustand/shallow'
import { useEffect } from 'react'
import Progress from '@/components/Progress'
import { type GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Profile = (): JSX.Element => {
  const { t: profileTrans } = useTranslation('profile')

  const [user, getUser] = useAuthStore(
    (state) => [state.user, state.getUser],
    shallow
  )

  useEffect(() => {
    if (user === null) void getUser()
  }, [getUser, user])

  return (
    <>
      {user !== null ? (
        <AppLayout
          header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800 ">
              {profileTrans('title')}
            </h2>
          }
          title={profileTrans('title')}
        >
          <div className="py-12">
            <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
              <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                <div className="max-w-xl">
                  <UpdateProfileInformationForm />
                </div>
              </div>

              <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                <div className="max-w-xl">
                  <UpdatePasswordForm />
                </div>
              </div>
            </div>
          </div>
        </AppLayout>
      ) : (
        <Progress />
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'id', ['profile', 'common']))
  }
})

export default Profile
