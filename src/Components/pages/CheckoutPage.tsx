import React, { useContext, useState } from 'react'
import { ShopContext } from '../../contexts/shopContext'
import { paymentIntent } from '../construction/stripe/payment-intent-utils'
import { useNavigate } from 'react-router-dom'
import PayPal from '../construction/PayPal'

type Props = {}

function CheckoutPage({}: Props) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe')
  const { cartItems, removeFromCart } = useContext(ShopContext)
  const [paypalCheckedOut, setPaypalCheckedOut] = useState(false)

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentMethod(event.target.value)
  }

  const listItems = (cartItems || []).map((item, index) => (
    <li
      className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0"
      key={index}
    >
      <div className="flex flex-col rounded-lg bg-white sm:flex-row">
        <img
          className="m-2 h-24 w-28 rounded-md border object-cover object-center"
          src={item.imageUrl}
          alt={item.name}
        />
        <div className="flex w-full flex-col px-4 py-4">
          <span className="font-semibold">{item.name}</span>
          <span className="float-right text-gray-400">{item.quantity}</span>
          <p className="text-lg font-bold">
            {item.salePrice !== undefined && item.salePrice !== item.price ? (
              <>
                <span className="font-bold">${item.salePrice}</span>
                <span className="text-sm line-through ml-2">${item.price}</span>
              </>
            ) : (
              <span className="font-bold">${item.price}</span>
            )}
          </p>
        </div>
        <div className="flex align-top justify-end self-start items-end text-right">
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
    </li>
  ))

  const totalPrice = (cartItems || []).reduce(
    (total, item) => total + (item.salePrice || item.price) * item.quantity,
    0
  )

  const totalSalePrice = (cartItems || []).reduce(
    (total, item) =>
      total + (item.price - (item.salePrice || item.price)) * item.quantity,
    0
  )

  const navigate = useNavigate()
  const stripeCheckout = async () => {
    try {
      const client_secret: unknown = await paymentIntent(
        'http://localhost:5173/secret',
        totalPrice
      )
      navigate('/checkout', {
        state: {
          client_secret,
        },
      })
    } catch (error) {
      alert('An error has occurred; try again later!')
    }
  }
  const paypalCheckout = async () => {
    setPaypalCheckedOut(true)
    console.log('Paypal checkout')
  }

  const handleClick = () => {
    if (selectedPaymentMethod === 'stripe') {
      stripeCheckout()
    } else if (selectedPaymentMethod === 'paypal') {
      paypalCheckout()
    } else {
      alert('Please select a payment method')
    }
  }

  return (
    <>
      {paypalCheckedOut ? (
        <PayPal totalPrice={totalPrice}></PayPal>
      ) : (
        <div className="bg-white h-full w-full overflow-auto">
          <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 h-full">
            <div className="px-4 pt-8">
              <p className="text-xl font-medium">Order Summary</p>
              <p className="text-gray-400">
                Check your items and your total then continue to payment form.
              </p>
              <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                {listItems}
              </div>
            </div>

            <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0 h-full">
              <p className="text-xl font-medium">Payment Method</p>
              <p className="text-gray-400">
                Complete your order by providing your payment details.
              </p>

              <form className="mt-5 grid gap-6">
                <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_1"
                    type="radio"
                    name="radio"
                    value="stripe"
                    checked={selectedPaymentMethod === 'stripe'}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_1"
                  >
                    <img
                      className="w-20 h-20"
                      src={
                        'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/assets%2FStripe.webp?alt=media&token=7b1ed0f6-b124-477b-8039-8d86e856fa44'
                      }
                      alt="stripe logo"
                    />
                    <div className="ml-3 flex self-center">
                      <span className="mt-2 font-semibold">Stripe</span>
                    </div>
                  </label>
                </div>
                <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_2"
                    type="radio"
                    name="radio"
                    value={'paypal'}
                    checked={selectedPaymentMethod === 'paypal'}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_2"
                  >
                    <img
                      className="w-16 h-16"
                      src={
                        'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/assets%2FPaypal_2014_logo.png?alt=media&token=daec26e2-1263-4bac-b74b-00accc3c8d18'
                      }
                      alt="paypal logo"
                    />
                    <div className="ml-7 flex self-center">
                      <span className="mt-2 font-semibold">Paypal</span>
                    </div>
                  </label>
                </div>
              </form>

              <div className="mt-6 space-y-3 border-t border-b py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-xl font-semibold text-gray-900">
                    <span className="text-xs font-normal text-gray-400">
                      USD
                    </span>{' '}
                    ${`${totalPrice.toFixed(2)}`}
                    <span className="text-sm line-through ml-2">
                      ${totalSalePrice.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <button
                className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
                onClick={handleClick}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CheckoutPage
