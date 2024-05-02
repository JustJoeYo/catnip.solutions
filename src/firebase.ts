import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'

const app = firebase.initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASEURL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
})

export const firestoreDB = getFirestore(app)

export const auth = app.auth()
export default app
