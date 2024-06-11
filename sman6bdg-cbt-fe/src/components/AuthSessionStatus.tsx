import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string
  status?: string | null
}

const AuthSessionStatus = ({
  status,
  className,
  ...props
}: Props): JSX.Element => (
  <>
    {status != null && status !== '' && (
      <div
        className={`${className ?? ''} text-sm font-medium text-green-600`}
        {...props}
      >
        {status}
      </div>
    )}
  </>
)

export default AuthSessionStatus
