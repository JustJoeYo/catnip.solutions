import { useEffect, useRef, useState } from 'react'

type Props = { totalPrice: number }

declare global {
  interface Window {
    paypal: any
  }
}

function PayPal({ totalPrice }: Props) {
  const paypal = useRef<HTMLDivElement>(null)
  const [paypalRendered, setPaypalRendered] = useState(false)

  const loadPaypalScript = () => {
    if (window.paypal) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src =
        'https://www.paypal.com/sdk/js?client-id=ASA0QIfztVlL5ChhfxGRNr2JDxRIzjvMaU7UB5_VM8q7rWvt3KDEb_t-mgpLqisGmQthDheeoFqriNyv&currency=USD'
      script.addEventListener('load', resolve)
      script.addEventListener('error', reject)
      document.body.appendChild(script)
    })
  }

  useEffect(() => {
    let isMounted = true
    if (!paypalRendered) {
      loadPaypalScript().then(() => {
        window.paypal
          .Buttons({
            createOrder: (
              data: any,
              actions: {
                order: {
                  create: (arg0: {
                    intent: string
                    purchase_units: {
                      description: string
                      amount: { currency_code: string; value: number }
                    }[]
                  }) => any
                }
              },
              err: any
            ) => {
              return actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [
                  {
                    description: 'Your purchase from Catnip.Solutions',
                    amount: {
                      currency_code: 'USD',
                      value: totalPrice,
                    },
                  },
                ],
              })
            },
            onApprove: async (data: any, actions: any) => {
              const order = await actions.order.capture()
              console.log(order)
            },
            onError: (err: any) => {
              console.log(err)
            },
          })
          .render(paypal.current)
        setPaypalRendered(true)
      })
    }
    return () => {
      isMounted = false
    }
  }, [paypalRendered])

  return (
    <>
      <div className="h-full w-full bg-white overflow-auto absolute">
        <div className="h-full w-full flex justify-center mt-20">
          <div
            className="flex justify-center self-center w-2/5"
            ref={paypal}
          ></div>
        </div>
      </div>
    </>
  )
}

export default PayPal

/*

import { useState, useRef } from 'react'
import styles from './PaymentForm.module.css'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import {
  PayPalHostedFieldsProvider,
  PayPalHostedField,
  PayPalButtons,
  usePayPalHostedFields,
} from '@paypal/react-paypal-js'

async function createOrderCallback(): Promise<string> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        cart: [
          {
            id: 'YOUR_PRODUCT_ID',
            quantity: 'YOUR_PRODUCT_QUANTITY',
          },
        ],
      }),
    })

    const orderData = await response.json()

    if (orderData.id) {
      return orderData.id
    } else {
      const errorDetail = orderData?.details?.[0]
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
        : JSON.stringify(orderData)

      throw new Error(errorMessage)
    }
  } catch (error) {
    console.error(error)
    return `Could not initiate PayPal Checkout...${error}`
  }
}

async function onApproveCallback(data: any, actions?: any): Promise<string> {
  try {
    const response = await fetch(`/api/orders/${data.orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const orderData = await response.json()
    // Three cases to handle:
    //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
    //   (2) Other non-recoverable errors -> Show a failure message
    //   (3) Successful transaction -> Show confirmation or thank you message

    const transaction =
      orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
      orderData?.purchase_units?.[0]?.payments?.authorizations?.[0]
    const errorDetail = orderData?.details?.[0]

    // this actions.restart() behavior only applies to the Buttons component
    if (errorDetail?.issue === 'INSTRUMENT_DECLINED' && !data.card && actions) {
      // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
      return actions.restart()
    } else if (
      errorDetail ||
      !transaction ||
      transaction.status === 'DECLINED'
    ) {
      // (2) Other non-recoverable errors -> Show a failure message
      let errorMessage
      if (transaction) {
        errorMessage = `Transaction ${transaction.status}: ${transaction.id}`
      } else if (errorDetail) {
        errorMessage = `${errorDetail.description} (${orderData.debug_id})`
      } else {
        errorMessage = JSON.stringify(orderData)
      }

      throw new Error(errorMessage)
    } else {
      // (3) Successful transaction -> Show confirmation or thank you message
      // Or go to another URL:  actions.redirect('thank_you.html');
      console.log(
        'Capture result',
        orderData,
        JSON.stringify(orderData, null, 2)
      )
      return `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
    }
  } catch (error) {
    return `Sorry, your transaction could not be processed...${error}`
  }
}

const SubmitPayment: React.FC<{
  onHandleMessage: (message: string) => void
}> = ({ onHandleMessage }) => {
  const { cardFields } = usePayPalHostedFields()
  const cardHolderName = useRef<HTMLInputElement>(null)

  const submitHandler = () => {
    if (!cardFields || typeof cardFields.submit !== 'function') return
    cardFields
      .submit({
        cardholderName: cardHolderName?.current?.value,
      })
      .then(async (data) => onHandleMessage(await onApproveCallback(data)))
      .catch((orderData) => {
        onHandleMessage(
          `Sorry, your transaction could not be processed...${JSON.stringify(
            orderData
          )}`
        )
      })
  }

  return (
    <button onClick={submitHandler} className="btn btn-primary">
      Pay
    </button>
  )
}

const Message: React.FC<{ content: string }> = ({ content }) => {
  return <p>{content}</p>
}

export const PaymentForm: React.FC = () => {
  const [message, setMessage] = useState<string>('')
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          'ASA0QIfztVlL5ChhfxGRNr2JDxRIzjvMaU7UB5_VM8q7rWvt3KDEb_t-mgpLqisGmQthDheeoFqriNyv',
      }}
    >
      <div className={styles.form}>
        <PayPalButtons
          style={{
            shape: 'rect',
            layout: 'vertical',
          }}
          className="mt-4 mb-4"
          createOrder={createOrderCallback}
          onApprove={async (data, actions) =>
            setMessage(await onApproveCallback(data, actions))
          }
        />

        <PayPalHostedFieldsProvider createOrder={createOrderCallback}>
          <div className="mt-4 mb-4">
            <PayPalHostedField
              id="card-number"
              hostedFieldType="number"
              options={{
                selector: '#card-number',
                placeholder: 'Card Number',
              }}
              className={styles.input}
            />
            <div className={styles.container}>
              <PayPalHostedField
                id="expiration-date"
                hostedFieldType="expirationDate"
                options={{
                  selector: '#expiration-date',
                  placeholder: 'Expiration Date',
                }}
                className={styles.input}
              />
              <PayPalHostedField
                id="cvv"
                hostedFieldType="cvv"
                options={{
                  selector: '#cvv',
                  placeholder: 'CVV',
                }}
                className={styles.input}
              />
            </div>
            <div className={styles.container}>
              <input
                id="card-holder"
                type="text"
                placeholder="Name on Card"
                className={styles.input}
              />

              <input
                id="card-billing-address-country"
                type="text"
                placeholder="Country Code"
                className={styles.input}
              />
            </div>
            <SubmitPayment onHandleMessage={setMessage} />
          </div>
        </PayPalHostedFieldsProvider>
        <Message content={message} />
      </div>
    </PayPalScriptProvider>
  )
}
*/
