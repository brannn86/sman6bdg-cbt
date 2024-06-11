import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import ResponsiveNavLink, {
  ResponsiveNavButton
} from '@/components/ResponsiveNavLink'
import DropdownLink, { DropdownButton } from '@/components/DropdownLink'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useAuthStore from '@/stores/auth-store'
import Image from 'next/image'

const Navigation = (): JSX.Element => {
  const router = useRouter()

  const [user, logOut] = useAuthStore((state) => [state.user, state.logOut])

  const [open, setOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)
  const [pickedImage, setPickedImage] = useState<string | null>(null)

  const handlerLogout = async (): Promise<void> => {
    await logOut()
  }

  const tmpImg = user?.profile?.images_local

  useEffect(() => {
    if (tmpImg !== undefined && tmpImg !== null && tmpImg.length > 0) {
      setPickedImage(URL.createObjectURL(tmpImg[0]))
    }
  }, [tmpImg, user])

  return (
    <nav className="border-b border-gray-100 bg-white ">
      {/* Primary Navigation Menu */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex gap-2">
            {/* Sidebar Mobile */}
            <div className="flex shrink-0 items-center lg:hidden">
              <label
                htmlFor="my-drawer-2"
                onClick={() => {
                  setOpenMobile((setOpenMobile) => !setOpenMobile)
                }}
              >
                <span className="inline-flex rounded-md">
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    {openMobile ? (
                      <path
                        className="inline-flex"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        className="inline-flex"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </span>
              </label>
            </div>

            {/* Logo */}
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 " />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex"></div>
          </div>

          {/* Settings Dropdown */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative ml-3">
              <Dropdown
                align="right"
                width="48"
                trigger={
                  <span className="inline-flex rounded-md">
                    <button className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none">
                      <span className="mr-2">{user?.profile?.name}</span>

                      <Image
                        src={
                          pickedImage ??
                          user?.profile?.image_path ??
                          '/assets/images/User.png'
                        }
                        alt="User Profile"
                        width={24}
                        height={24}
                        priority
                        className="aspect-square rounded-full object-cover"
                      />
                      <svg
                        className="-mr-0.5 ml-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                }
              >
                {/* Authentication */}
                {/* TODO: add active state */}
                <DropdownLink href="/profile">Profile</DropdownLink>
                <DropdownButton onClick={handlerLogout}>Logout</DropdownButton>
              </Dropdown>
            </div>
          </div>

          {/* Hamburger */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => {
                setOpen((open) => !open)
              }}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path
                    className="inline-flex"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    className="inline-flex"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Navigation Menu */}
      {open && (
        <div className="block sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            <ResponsiveNavLink href="/" active={router.pathname === '/login'}>
              Dashboard
            </ResponsiveNavLink>
          </div>

          {/* Responsive Settings Options */}
          <div className="border-t border-gray-200 pb-1 pt-4">
            <div className="px-4">
              <div className="text-base font-medium text-gray-800 ">
                {user?.profile?.name}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {user?.email}
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <ResponsiveNavLink
                href="/profile"
                active={router.pathname === '/profile'}
              >
                Profile
              </ResponsiveNavLink>
              <ResponsiveNavButton onClick={handlerLogout}>
                Logout
              </ResponsiveNavButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
