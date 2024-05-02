/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { CartItem } from '../pages/store'
export interface IDropdownProps {
  dropDownButtonComponent: JSX.Element
  options: Array<IMenuOption>
}

export interface IMenuOption {
  label: string
  icon?: JSX.Element
  onClick: (e: any | void) => void
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export interface CartProps extends IDropdownProps {
  cartItems: CartItem[]
}

export default function Cart(props: CartProps): JSX.Element {
  const listItems2 = (props.cartItems || []).map((item, index) => (
    <li
      className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0"
      key={index}
    >
      <div className="shrink-0 relative">
        <span className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-sm font-medium text-gray-500 shadow sm:-top-2 sm:-right-2">
          {index + 1}
        </span>
        <img
          className="h-24 w-24 max-w-full rounded-lg object-cover"
          src={item.imageUrl}
          alt={item.name}
        />
      </div>

      <div className="relative flex flex-1 flex-col justify-between">
        <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
          <div className="pr-8 sm:pr-5">
            <p className="text-base font-semibold text-gray-900">{item.name}</p>
            <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">{item.id}</p>
          </div>

          <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
            <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
              ${item.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </li>
  ))

  const listItems = props.options.map((option, index) => (
    <Menu.Item key={index}>
      {({ active }) => (
        <button
          onClick={option.onClick}
          className={classNames(
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
            'flex w-full px-4 py-2 gap-2 text-sm items-center'
          )}
        >
          {option.icon}
          {option.label}
        </button>
      )}
    </Menu.Item>
  ))

  const totalPrice = (props.cartItems || []).reduce(
    (total, item) => total + item.price,
    0
  )

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>{props.dropDownButtonComponent}</div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <section className="h-max bg-gray-100 py-1 sm:py-2 lg:py-4">
            <div className="mx-auto px-2 sm:px-4 lg:px-6">
              <div className="flex items-center justify-center">
                <h1 className="lg:text-2xl font-semibold text-gray-900 sm:text-xl xs:text-xl">
                  Your Cart
                </h1>
              </div>

              <div className="mx-auto mt-2 max-w-md md:mt-4">
                <div className="rounded-3xl bg-white shadow-lg">
                  <div className="px-4 py-6 sm:px-8 sm:py-10">
                    <div className="flow-root">
                      <ul className="-my-8">
                        {listItems2}
                        <li className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
                          <div className="shrink-0 relative">
                            <span className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-sm font-medium text-gray-500 shadow sm:-top-2 sm:-right-2">
                              1
                            </span>
                            <img
                              className="h-24 w-24 max-w-full rounded-lg object-cover"
                              src="https://images.unsplash.com/photo-1588484628369-dd7a85bfdc38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHNuZWFrZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=150&q=60"
                              alt=""
                            />
                          </div>

                          <div className="relative flex flex-1 flex-col justify-between">
                            <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                              <div className="pr-8 sm:pr-5">
                                <p className="text-base font-semibold text-gray-900">
                                  Nike Air Max 2019
                                </p>
                                <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">
                                  36EU - 4US
                                </p>
                              </div>

                              <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                                <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
                                  $1259.00
                                </p>
                              </div>
                            </div>

                            <div className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
                              <button
                                type="button"
                                className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900"
                              >
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                    className=""
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </li>
                        <li className="flex flex-col space-y-3 pb-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
                          <div className="shrink-0 relative">
                            <span className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-sm font-medium text-gray-500 shadow sm:-top-2 sm:-right-2">
                              1
                            </span>
                            <img
                              className="h-24 w-24 max-w-full rounded-lg object-cover"
                              src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=150&q=60"
                              alt=""
                            />
                          </div>

                          <div className="relative flex flex-1 flex-col justify-between">
                            <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                              <div className="pr-8 sm:pr-5">
                                <p className="text-base font-semibold text-gray-900">
                                  Nike Air Max 2019
                                </p>
                                <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">
                                  36EU - 4US
                                </p>
                              </div>

                              <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                                <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
                                  $1259.00
                                </p>
                              </div>
                            </div>

                            <div className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
                              <button
                                type="button"
                                className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900"
                              >
                                <svg
                                  className="block h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                    className=""
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 space-y-3 border-t border-b py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          Total
                        </p>
                        <p className="text-xl font-semibold text-gray-900">
                          <span className="text-xs font-normal text-gray-400">
                            USD
                          </span>{' '}
                          ${totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <button
                        type="button"
                        className="group inline-flex w-full items-center justify-center rounded-md bg-popclr px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                      >
                        Place Order
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="group-hover:ml-8 ml-4 h-6 w-6 transition-all"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
