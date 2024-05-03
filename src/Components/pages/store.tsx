import { useContext, useState } from 'react'
import { ShopContext } from '../../contexts/shopContext'

export interface CartItem {
  id: number
  name: string
  price: number
  salePrice?: number
  quantity: number
  imageUrl: string
  secondimageUrl?: string
}

const items: CartItem[] = [
  {
    id: 1,
    name: 'Cat',
    price: 7.99,
    salePrice: 4.99,
    quantity: 1,
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG4.jpeg?alt=media&token=27e09ea2-dd8c-4854-b409-34b0b1156f12',
    secondimageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG2.jpeg?alt=media&token=4c8f05a9-5bea-4049-b72d-2f32e8ce591b',
  },
  {
    id: 2,
    name: 'Bear',
    price: 5.99,
    salePrice: 2.99,
    quantity: 1,
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG2%20(1).jpeg?alt=media&token=7ef8006b-e8a7-4f91-ab0b-68fc2b97d78c',
    secondimageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG2.jpeg?alt=media&token=4c8f05a9-5bea-4049-b72d-2f32e8ce591b',
  },
  {
    id: 3,
    name: 'T-rex',
    price: 299,
    salePrice: 249,
    quantity: 1,
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG2.8_dC07tQGIeP.jpeg?alt=media&token=1d340c63-c719-4c2a-bcfd-3ea0713f1ec5',
    secondimageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG2.jpeg?alt=media&token=4c8f05a9-5bea-4049-b72d-2f32e8ce591b',
  },
  {
    id: 4,
    name: 'Dog',
    price: 9.99,
    quantity: 1,
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG3.jpeg?alt=media&token=b49ab06b-12dd-40a2-a027-e51f3da68941',
    secondimageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG2.jpeg?alt=media&token=4c8f05a9-5bea-4049-b72d-2f32e8ce591b',
  },
  {
    id: 5,
    name: 'Gecko',
    price: 34.99,
    quantity: 1,
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG1.jpeg?alt=media&token=43693c80-2e58-4a6d-b8ef-88cd2f182d5f',
    secondimageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG2.jpeg?alt=media&token=4c8f05a9-5bea-4049-b72d-2f32e8ce591b',
  },
  {
    id: 6,
    name: 'Moto Cat',
    price: 699,
    salePrice: 449,
    quantity: 1,
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG2.v.jpeg?alt=media&token=d9f14ff0-42a7-4e2c-9fc3-ea80fff1d767',
    secondimageUrl:
      'https://firebasestorage.googleapis.com/v0/b/catnip-4c373.appspot.com/o/imgix%2FOIG2.jpeg?alt=media&token=4c8f05a9-5bea-4049-b72d-2f32e8ce591b',
  },
]

type Props = {}

function Store({}: Props) {
  const { addToCart } = useContext(ShopContext)
  return (
    <>
      <div className="bg-popclr text-textclr outline outline-outlineclr h-full m-5 max-h-full flex-col justify-center overflow-scroll">
        <div className="grid lg:grid-cols-3 justify-center align-middle self-center pt-5">
          {items.map((item, index) => {
            const isPastThirdItem = index >= 3

            return (
              <div
                key={item.id}
                className={
                  isPastThirdItem
                    ? 'group border-gray-100/30 my-5 h-max overflow-hidden rounded-lg border bg-mainclr shadow-md mx-5'
                    : 'group border-gray-100/30 h-max overflow-hidden rounded-lg border bg-mainclr shadow-md mx-5'
                }
              >
                <a className="relative mx-3 flex h-60 overflow-hidden rounded-xl">
                  <img
                    className="peer top-0 right-0 h-full w-full object-cover"
                    src={item.imageUrl}
                    alt="product image"
                  />
                  <img
                    className="peer peer-hover:right-0 absolute top-0 -right-96 h-full w-full object-cover transition-all delay-100 duration-1000 hover:right-0"
                    src={item.secondimageUrl}
                    alt="product image"
                  />
                  <svg
                    className="group-hover:animate-ping group-hover:opacity-30 peer-hover:opacity-0 pointer-events-none absolute inset-x-0 bottom-5 mx-auto text-3xl text-white transition-opacity"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="currentColor"
                      d="M2 10a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v10a4 4 0 0 1-2.328 3.635a2.996 2.996 0 0 0-.55-.756l-8-8A3 3 0 0 0 14 17v7H6a4 4 0 0 1-4-4V10Zm14 19a1 1 0 0 0 1.8.6l2.7-3.6H25a1 1 0 0 0 .707-1.707l-8-8A1 1 0 0 0 16 17v12Z"
                    />
                  </svg>
                </a>
                <div className="mt-4 px-5 pb-5">
                  <a>
                    <h5 className="text-xl tracking-tight text-white">
                      {item.name}
                    </h5>
                  </a>
                  <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                      {item.salePrice !== undefined ? (
                        <>
                          <span className="text-3xl font-bold text-white">
                            ${item.salePrice}
                          </span>
                          <span className="text-sm text-white line-through">
                            ${item.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-white">
                          ${item.price}
                        </span>
                      )}
                    </p>
                  </div>
                  <a
                    className="hover:border-white/40 flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
                    onClick={() =>
                      addToCart({
                        id: index,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        salePrice: item.salePrice,
                        imageUrl: item.imageUrl,
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <h1 className="cursor-pointer">Add to cart</h1>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Store
