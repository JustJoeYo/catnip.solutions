/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ShopContext } from '../../contexts/shopContext'
import { Link } from 'react-router-dom'
export interface IDropdownProps {
  dropDownButtonComponent: JSX.Element
}

export default function Cart(props: IDropdownProps): JSX.Element {
  const { cartItems, removeFromCart } = useContext(ShopContext)

  const listItems = (cartItems || []).map((item, index) => (
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
            <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">
              {item.quantity}
            </p>
          </div>

          <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
            <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
              $
              {item.salePrice
                ? item.salePrice.toFixed(2)
                : item.price.toFixed(2)}
            </p>
          </div>
          <div className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
            <button
              type="button"
              className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900"
              onClick={() => removeFromCart(item.id)}
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
      </div>
    </li>
  ))

  const totalPrice = (cartItems || []).reduce(
    (total, item) => total + (item.salePrice || item.price) * item.quantity,
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
        <Menu.Items className="absolute right-0 z-10 w-max origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-auto">
          <section className="h-max bg-gray-100 py-1 sm:py-2 lg:py-4 rounded-md">
            <div className="mx-auto px-2 sm:px-4 lg:px-6">
              <div className="flex items-center justify-center">
                <h1 className="lg:text-2xl font-semibold text-gray-900 sm:text-xl xs:text-xl">
                  Your Cart
                </h1>
              </div>

              <div className="mx-auto mt-2 max-w-md md:mt-4">
                <div className="rounded-3xl bg-white shadow-lg">
                  <div className="px-4 py-4 sm:px-6 sm:py-8">
                    <div className="flow-root">
                      {cartItems.length === 0 && (
                        <p className="text-lg font-bold justify-center text-center mb-3 text-gray-900">
                          Cart is Empty
                        </p>
                      )}
                      <ul className="-my-8">{listItems}</ul>
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
                      <Link to="/checkout">
                        <button
                          type="button"
                          disabled={cartItems.length === 0}
                          className="group inline-flex w-full items-center justify-center rounded-md bg-popclr px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-mainclr"
                        >
                          Checkout
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
                      </Link>
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
