import type { ButtonHTMLAttributes } from 'react'

const DangerButton = ({
  type = 'submit',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => (
  <button
    type={type}
    className={`inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2  focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 ${
      className ?? ''
    }`}
    {...props}
  />
)

export default DangerButton
