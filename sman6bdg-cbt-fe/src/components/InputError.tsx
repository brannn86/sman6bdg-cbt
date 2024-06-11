import type { HTMLAttributes } from 'react'
interface Props extends HTMLAttributes<HTMLParagraphElement> {
  messages?: string[]
}

const InputError = ({
  messages = [],
  className = '',
  ...props
}: Props): JSX.Element => (
  <>
    {messages?.length > 0 && (
      <>
        {messages.map((message, index) => (
          <p
            {...props}
            className={`text-sm text-red-600 ${className ?? ''}`}
            key={index}
          >
            {message}
          </p>
        ))}
      </>
    )}
    {/* <p {...props} className={`text-sm text-red-600 ${className ?? ''}`}>
      {message}
    </p> */}
  </>
)

export default InputError
