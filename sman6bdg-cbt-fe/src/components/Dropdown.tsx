import React from 'react'
import { Menu, Transition } from '@headlessui/react'

import type { PropsWithChildren } from 'react'

interface Props {
  align?: 'left' | 'right' | 'top'
  width?: '48'
  contentClasses?: string
  trigger: React.ReactNode
}

const Dropdown = ({
  align = 'right',
  width = '48',
  contentClasses = 'py-1 bg-white',
  trigger,
  children
}: PropsWithChildren<Props>): JSX.Element => {
  let alignmentClasses = ''

  switch (align) {
    case 'left':
      alignmentClasses = 'origin-top-left left-0'
      break
    case 'top':
      alignmentClasses = 'origin-top'
      break
    case 'right':
    default:
      alignmentClasses = 'origin-top-right right-0'
      break
  }

  let widthClasses = ''

  if (width === '48') {
    widthClasses = 'w-48'
  }

  // const [open, setOpen] = useState(false)

  return (
    <Menu as="div" className="relative z-10">
      {({ open }) => (
        <>
          <Menu.Button as={React.Fragment}>{trigger}</Menu.Button>

          <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div
              className={`absolute mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
            >
              <Menu.Items
                className={`rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none ${contentClasses}`}
                static
              >
                {children}
              </Menu.Items>
            </div>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default Dropdown
