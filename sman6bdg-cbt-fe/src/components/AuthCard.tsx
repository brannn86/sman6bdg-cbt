import type { PropsWithChildren } from 'react'
import Link from 'next/link'
import ApplicationLogo from './ApplicationLogo'

const AuthCard = ({ children }: PropsWithChildren): JSX.Element => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 pt-6 sm:pt-0">
    <div>
      <Link href="/">
        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
      </Link>
    </div>

    <div className="mt-6 w-full max-w-md overflow-hidden rounded-lg bg-white px-6 py-4 shadow-md">
      {children}
    </div>
  </div>
)

export default AuthCard
