import AuthCard from '@/components/AuthCard'
import GuestLayout from '@/components/Layouts/GuestLayout'
import Label from '@/components/Label'
import { type SubmitHandler, useForm } from 'react-hook-form'
import PrimaryButton from '@/components/PrimaryButton'
import { useState } from 'react'
import useAuthStore from '@/stores/auth-store'
import ProgressCircular from '@/components/ProgressCircular'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps } from 'next'

const Login = (): JSX.Element => {
  const { t: commonTrans } = useTranslation('common')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const login = useAuthStore((state) => state.logIn)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Credentials>()

  const onSubmit: SubmitHandler<Credentials> = async (data) => {
    setIsLoading(true)
    await login(data)
    setIsLoading(false)
  }

  const title = `${commonTrans('website_name')} - Login`

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <GuestLayout>
        <AuthCard>
          {/* Session Status */}
          {/* <AuthSessionStatus className="mb-4" status={status} /> */}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username Address */}
            <div>
              <Label htmlFor="username">Username or Email</Label>

              <input
                {...register('username', {
                  required: 'Please enter your name.'
                })}
                id="username"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm text-error">
                {errors.username?.message}
              </span>
            </div>

            {/* Password */}
            <div className="mt-4">
              <Label htmlFor="password">Password</Label>
              <input
                {...register('password', {
                  required: 'Please enter your password.',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters.'
                  }
                })}
                id="password"
                type="password"
                autoComplete="current-password"
                className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm text-error">
                {errors.password?.message}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <PrimaryButton
                disabled={isLoading}
                className="flex w-full justify-center"
              >
                {isLoading ? <ProgressCircular /> : 'Login'}
              </PrimaryButton>
            </div>
          </form>
        </AuthCard>
      </GuestLayout>
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

export default Login
