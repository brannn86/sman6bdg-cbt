import type { InputHTMLAttributes } from 'react'

const Checkbox = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>): JSX.Element => (
  <input
    {...props}
    type="checkbox"
    className={`rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 ${
      className ?? ''
    }`}
  />
)

export default Checkbox
