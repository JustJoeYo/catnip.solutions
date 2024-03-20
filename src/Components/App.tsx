import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.min.css'

import {
  Dashboard,
  Projects,
  Login,
  Signup,
  PrivateRoutes,
  ForgotPassword,
  UpdateProfile,
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
    <Router>
      <AppContextProviders components={providers}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Dashboard />} path="/" />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="projects" element={<Projects />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </AppContextProviders>
    </Router>
  )
}

export default App
