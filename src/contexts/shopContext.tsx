import React, { useState, useEffect } from 'react'
import { CartItem } from '../Components/pages/store'
import { auth, firestoreDB } from '../firebase'
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore'

export const ShopContext = React.createContext({
  cartItems: [] as CartItem[],
  addToCart: (item: CartItem) => {},
  removeFromCart: (itemId: number) => {},
})

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = async (item: CartItem) => {
    const user = auth.currentUser
    if (user) {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === item.id)

        if (item.salePrice === undefined) {
          item.salePrice = item.price
        }
        let newItems
        if (existingItem) {
          // Increase the quantity of the existing item
          newItems = prevItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        } else {
          // Add the new item to the cart
          newItems = [...prevItems, { ...item, quantity: 1 }]
        }

        const cartRef = doc(firestoreDB, 'carts', user.uid)
        updateDoc(cartRef, { items: newItems })

        return newItems
      })
    }
  }

  const removeFromCart = async (itemId: number) => {
    const user = auth.currentUser
    if (user) {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === itemId)

        let newItems
        if (existingItem && existingItem.quantity > 1) {
          // Decrease the quantity of the existing item
          newItems = prevItems.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          )
        } else {
          // Remove the item from the cart
          newItems = prevItems.filter((i) => i.id !== itemId)
        }

        const cartRef = doc(firestoreDB, 'carts', user.uid)
        updateDoc(cartRef, { items: newItems })

        return newItems
      })
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const cartRef = doc(firestoreDB, 'carts', user.uid)

        // Listen for changes to the cart in Firestore
        const unsubscribeSnapshot = onSnapshot(cartRef, (docSnap) => {
          if (docSnap.exists()) {
            // Update the cart from Firestore
            setCartItems(docSnap.data().items)
          } else {
            // Initialize the cart in Firestore
            setDoc(cartRef, { items: [] })
          }
        })

        // Unsubscribe from the snapshot when the user logs out
        return unsubscribeSnapshot
      } else {
        setCartItems([])
      }
    })

    return unsubscribe
  }, [])

  return (
    <ShopContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </ShopContext.Provider>
  )
}
