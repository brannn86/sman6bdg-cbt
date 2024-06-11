import type { PropsWithChildren, LabelHTMLAttributes } from 'react'

const Label = ({
  className,
  children,
  ...props
}: PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>>): JSX.Element => (
  <label
    {...props}
    className={`block text-sm font-medium text-gray-700 ${className ?? ''}`}
  >
    {children}
  </label>
)

export default Label
