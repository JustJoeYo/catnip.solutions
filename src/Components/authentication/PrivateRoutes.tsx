import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DashNavbar from '../navbar/DashNavbar'

export default function PrivateRoutes() {
  const { currentUser } = useAuth()

  return currentUser ? (
    <>
      <div className="flex flex-col h-screen">
        <DashNavbar />
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  )
}
