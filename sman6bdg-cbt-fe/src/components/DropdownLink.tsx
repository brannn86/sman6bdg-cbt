import Link from 'next/link'
import { Menu } from '@headlessui/react'
import React from 'react'

import type { PropsWithChildren, ButtonHTMLAttributes } from 'react'
import type { LinkProps } from 'next/link'

const DropdownLink = ({
  children,
  ...props
}: PropsWithChildren<LinkProps>): JSX.Element => (
  <Menu.Item>
    {({ active }) => (
      <Link
        {...props}
        className={`block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out  hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
          active ? 'bg-gray-100 ' : ''
        }`}
      >
        {children}
      </Link>
    )}
  </Menu.Item>
)

export const DropdownButton = ({
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>): JSX.Element => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={`block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out  hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
          active ? 'bg-gray-100 ' : ''
        }`}
        {...props}
      >
        {children}
      </button>
    )}
  </Menu.Item>
)

export default DropdownLink
