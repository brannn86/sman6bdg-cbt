import {
  useEffect,
  type PropsWithChildren,
  type ReactNode,
  useState
} from 'react'
import Navigation from '@/components/Layouts/Navigation'
import Link from 'next/link'
import useAuthStore from '@/stores/auth-store'
import { shallow } from 'zustand/shallow'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import Progress from '../Progress'

interface Props {
  header: ReactNode
  title?: string | null
  modal?: ReactNode
}

const AppLayout = ({
  header,
  title = null,
  modal = null,
  children
}: PropsWithChildren<Props>): JSX.Element => {
  const { t: commonTrans } = useTranslation('common')

  const [user, isRole, getUser] = useAuthStore(
    (state) => [state.user, state.isRole, state.getUser],
    shallow
  )

  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    if (isRole(['admin', 'developer'])) {
      setIsAdmin(true)
    }
  }, [isRole, user])

  useEffect(() => {
    if (user === null) void getUser()
  }, [getUser, user])

  const titleHead = `${commonTrans('website_name')} ${
    title !== null ? `| ${title}` : ''
  }`
  return (
    <>
      <Head>
        <title>{titleHead}</title>
      </Head>
      {user === null ? <Progress /> : null}
      <div className="min-h-screen bg-gray-100 ">
        <Navigation />

        {/* Page Heading */}
        <div className="drawer-mobile drawer">
          <input
            id="my-drawer-2"
            type="checkbox"
            className="drawer-toggle hidden"
          />
          <div className="drawer-content">
            {/* <!-- Page content here --> */}

            <header className="bg-white shadow ">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {header}
              </div>
            </header>

            {/* Page Content */}
            <main>{children}</main>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <ul className="menu w-80 bg-base-100 p-4 text-base-content">
              {/* <!-- Sidebar content here --> */}
              <li>
                <Link href="/">Dashboard</Link>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <Link href="/users">Users</Link>
                  </li>
                  <li>
                    <Link href="/classes">Classes</Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/subjects">Subjects</Link>
              </li>
              <li>
                <Link href="/exams">Exams</Link>
              </li>
              <li>
                <Link href="/config">Config</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {modal}
    </>
  )
}

export default AppLayout
