import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.min.css'

import {
  Dashboard,
  NumberGuesser,
  PageNotFound,
  Login,
  Signup,
  PrivateRoutes,
  ForgotPassword,
  UpdateProfile,
  StratRoulette,
  TitlePage,
  Store,
  CheckoutPage,
} from './types'

import {
  ToastProvider,
  AuthProvider,
  ApiProvider,
  AppContextProviders,
  ShopProvider,
} from '../contexts/types'

function App() {
  const providers = [ToastProvider, AuthProvider, ApiProvider]
  return (
    <>
      <ShopProvider>
        <Router>
          <AppContextProviders components={providers}>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route element={<Dashboard />} path="/dashboard" />
                <Route path="/store" element={<Store />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route path="/numberguesser" element={<NumberGuesser />} />
                <Route path="/stratroulette" element={<StratRoulette />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Route>
              <Route path="/" element={<TitlePage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </AppContextProviders>
        </Router>
      </ShopProvider>
    </>
  )
}

export default App
function createBrowserRouter(
  arg0: { path: string; children: { path: string; element: JSX.Element }[] }[]
) {
  throw new Error('Function not implemented.')
}
