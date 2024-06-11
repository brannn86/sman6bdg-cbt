import '@/styles/global.css'
import 'react-toastify/dist/ReactToastify.css'

import React from 'react'
import type { AppProps } from 'next/app'
import withAuth from '@/utils/with-auth'
import { appWithTranslation } from 'next-i18next'
import { ToastContainer } from 'react-toastify'
import Head from 'next/head'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  )
}

export default appWithTranslation(withAuth(App))
