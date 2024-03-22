import { Table } from 'react-bootstrap'
import { getDatabase, onValue, ref, set, get } from 'firebase/database'
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
} from 'react'

const db = getDatabase()
var cartId = 1

type Props = {}

type State = {}

// Setting the data.
/*const data = {
  cartId: cartId,
  products: [
    {
      title: 'product1',
      price: 50,
    },
    {
      title: 'product2',
      price: 30,
    },
    {
      title: 'product3',
      price: 70,
    },
  ],
}
set(ref(database, 'cart/' + cartId), data)
  .then(() => {
    console.log('lmfaoooo')
    // Success.
  })
  .catch((error) => {
    console.log(error)
  })*/

const cartRef = ref(db, 'cart/' + cartId)

export default function RealtimeDB() {
  useEffect(() => {
    return () => {
      onValue(cartRef, (snapshot) => {
        const data = snapshot.val()
        if (!!data) {
          console.log(data)
        } else {
          console.log('Data not found')
        }
      })
    }
  })

  return (
    <>
      <div className="bg-popclr text-textclr outline outline-outlineclr h-full m-5 p-5">
        <Table className="bg-black outline outline-outlineclr">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Fullname</th>
              <th>Phone Number</th>
              <th>Date of Birth</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>frick</td>
              <td>you</td>
              <td>dummy</td>
              <td>face</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  )
}
