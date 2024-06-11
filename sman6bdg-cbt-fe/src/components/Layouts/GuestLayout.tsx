import type { PropsWithChildren } from 'react'

const GuestLayout = ({ children }: PropsWithChildren): JSX.Element => {

  return (
    <div>
      <div className="font-sans text-gray-200 antialiased">{children}</div>
    </div>
  )
}

export default GuestLayout
