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
} from './types'

import {
  ToastProvider,
  AuthProvider,
  ApiProvider,
  AppContextProviders,
} from '../contexts/types'

function App() {
  const providers = [ToastProvider, AuthProvider, ApiProvider]
  return (
    <>
      <Router>
        <AppContextProviders components={providers}>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route element={<Dashboard />} path="/dashboard" />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/numberguesser" element={<NumberGuesser />} />
              <Route path="/stratroulette" element={<StratRoulette />} />
            </Route>
            <Route path="/" element={<TitlePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </AppContextProviders>
      </Router>
    </>
  )
}

export default App
function createBrowserRouter(
  arg0: { path: string; children: { path: string; element: JSX.Element }[] }[]
) {
  throw new Error('Function not implemented.')
}
