import AppLayout from '@/components/Layouts/AppLayout'
import Link from 'next/link'
import ClassForm from '@/components/Partials/Classes/ClassForm'

import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const ClassesCreate = (): JSX.Element => {
  const { t: commonTrans } = useTranslation('common')

  return (
    <>
      <AppLayout
        header={
          <h2 className="text-xl font-semibold leading-tight text-gray-800 ">
            {commonTrans('create')} Class
          </h2>
        }
        title="Class"
      >
        <div className="pt-12">
          <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                {/* Back */}
                <Link href="/classes" className="flex gap-4">
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
                    <Link href={'/classes'}>Class</Link>
                  </li>
                  <li>{commonTrans('create')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
              <div>
                <ClassForm />
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
      ...(await serverSideTranslations(locale ?? 'id', ['classes', 'common']))
    }
  }
}

export default ClassesCreate
