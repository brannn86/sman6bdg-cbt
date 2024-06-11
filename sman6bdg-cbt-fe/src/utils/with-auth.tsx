import useAuthStore from '@/stores/auth-store'
import { type AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { toastHelper } from '@/helpers/toast-helper'
import { shallow } from 'zustand/shallow'

const withAuth = (
  WrappedComponent: ({ Component, pageProps }: AppProps) => JSX.Element
): ((props: any) => JSX.Element) => {
  const Auth = (props: any): JSX.Element => {
    const router = useRouter()

    const [user, token, isRole] = useAuthStore(
      (state) => [state.user, state.token, state.isRole],
      shallow
    )

    useEffect(() => {
      const adminPage = [
        '/users',
        '/users/create',
        '/users/[id]/edit',
        '/subjects/create',
        '/subjects/[id]/edit',
        '/classes',
        '/classes/*'
      ]
      const guestPage = ['/login']

      if (token === null && !guestPage.includes(router.pathname)) {
        toastHelper.info('You are not logged in.')

        void router.replace('/login')
      } else if (token !== null && guestPage.includes(router.pathname)) {
        toastHelper.info('You are already logged in.')

        void router.replace('/')
      }

      if (
        adminPage.includes(router.pathname) &&
        adminPage.includes(router.asPath) &&
        !isRole(['admin', 'developer'])
      ) {
        toastHelper.info('You are not allowed to access this page.')

        void router.replace('/')
      }
    }, [router, token, user, isRole])

    return <WrappedComponent {...props} />
  }

  return Auth
}

export default withAuth
