import { useEffect, useState } from 'react'
import { Disclosure, Menu } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import DropdownMenu, { IMenuOption } from '../Atoms/DropdownMenu'
import Cart from '../construction/cart'
import { FiLogOut, FiEdit2 } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import userIcon from '../../assets/1077114.png'

import { useAuth, useToast, EToastTypes } from '../../contexts/types'

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

export default function DashNavbar() {
  const { logout } = useAuth()
  const { showError } = useToast()

  const [navigation, setNavigation] = useState([
    { name: 'Dashboard', href: '/dashboard', current: false },
    { name: 'Store', href: '/store', current: false },
    { name: 'Number Guesser', href: '/numberguesser', current: false },
    { name: 'Strat Roulette', href: '/stratroulette', current: false },
  ])

  useEffect(() => {
    const newObj = navigation.map((e) => {
      return {
        name: e.name,
        href: e.href,
        current: e.href === window.location.pathname,
      }
    })
    setNavigation(newObj)
  }, [window.location.pathname])

  const navigate = useNavigate()

  const menuOptions: Array<IMenuOption> = [
    {
      icon: <FiEdit2 />,
      label: 'Edit Profile',
      onClick: () => navigate('/update-profile'),
    },
    {
      icon: <FiLogOut />,
      label: `Log Out`,
      onClick: () => handleLogout(),
    },
  ]

  async function handleLogout(): Promise<void> {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      showError(err)
    }
  }

  const ProfilePicture = (
    <Menu.Button className="flex rounded-full bg-slate-100 text-sm outline-none ring-2 ring-outlineclr ring-offset-2 ring-offset-gray-800">
      <span className="sr-only">Open user menu</span>
      <img className="h-8 w-8 rounded-full" src={userIcon} alt="" />
    </Menu.Button>
  )

  const ShoppingCartPicture = (
    <Menu.Button className="flex rounded-full text-sm outline-none ring-1 ring-outlineclr ring-offset-2 ring-offset-gray-800 w-8 h-8 justify-center pt-1">
      <span className="sr-only">Open cart</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current text-white rounded-full"
        width="24"
        height="24"
      >
        <path d="M5.508 12.591a.499.499 0 0 1-.003-.017l-1.22-7.32A1.5 1.5 0 0 0 2.805 4H2.5a.5.5 0 0 1 0-1h.306a2.5 2.5 0 0 1 2.45 2H21.5a.5.5 0 0 1 .48.637l-2 7a.5.5 0 0 1-.48.363H6.59l.125.747A1.5 1.5 0 0 0 8.195 15H19.5a.5.5 0 1 1 0 1H8.194a2.5 2.5 0 0 1-2.466-2.089l-.22-1.32zM5.424 6l1 6h12.699l1.714-6zM8 21a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 1a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </svg>
    </Menu.Button>
  )

  return (
    <Disclosure as="nav" className="bg-popclr outline outline-outlineclr">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:popclr hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
                    alt="Catnip.Solutions"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
                    alt="Catnip.Solutions"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-mainclr outline-outlineclr outline text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute gap-4 inset-y-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 right-12">
                {/* Cart dropdown */}
                <Cart dropDownButtonComponent={ShoppingCartPicture} />
              </div>
              <div className="absolute gap-4 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <DropdownMenu
                  dropDownButtonComponent={ProfilePicture}
                  options={menuOptions}
                />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 flex flex-col gap-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Disclosure.Button
                    className={classNames(
                      item.current
                        ? 'bg-mainclr outline-outlineclr outline text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      ' px-3 w-full py-2 rounded-md text-base font-medium flex'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
