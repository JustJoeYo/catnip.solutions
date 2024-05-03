import React, { useEffect, useRef } from 'react'

type Props = {}

declare global {
  interface Window {
    paypal: any
  }
}

function PayPal({}: Props) {
  const paypal = useRef<HTMLDivElement>(null)

  const loadPaypalScript = () => {
    if (window.paypal) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src =
        'https://www.paypal.com/sdk/js?client-id=AQ3NoYwjIqSyXwZujgAHSWb5zZcsaZN0pPp_-cf1EC6Z8FDSzbWo49biPIud4d3G7_4o2ESjPOzgmuOL&currency=USD'
      script.addEventListener('load', resolve)
      script.addEventListener('error', reject)
      document.body.appendChild(script)
    })
  }

  useEffect(() => {
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
                  description: 'Your description',
                  amount: {
                    currency_code: 'USD',
                    value: 100.0,
                  },
                },
              ],
            })
          },
        })
        .render(paypal.current)
    })
  }, [])

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  )
}

export default PayPal
