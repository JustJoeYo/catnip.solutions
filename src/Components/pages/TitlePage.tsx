import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import BGparticles from '../particles/particles'

const TitlePage: React.FC = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) navigate('/dashboard')
  }, [])

  return (
    <div className="bg-black">
      <BGparticles />
      <div className="text-white min-h-full h-screen flex flex-col relative items-center justify-center pb-20">
        <h1 className="font-extrabold font-mono text-4xl sm:text-6xl">
          Catnip.Solutions
        </h1>
        <div className="flex-row mt-2">
          <Link
            className="font-medium text-xl bg-mainclr border border-outlineclr px-5 hover:bg-popclr mx-5 w-48"
            to="/login"
          >
            Login
          </Link>
          <Link
            className="font-medium text-xl bg-mainclr border border-outlineclr px-5 hover:bg-popclr w-48"
            to="/signup"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TitlePage
