import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useUserStore } from './store/userStore'
import Navbar from './components/Navbar/Navbar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import LandingPage from './pages/LandingPage/LandingPage'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import AvatarSetup from './pages/AvatarSetup/AvatarSetup'
import Generator from './pages/Generator/Generator'
import History from './pages/History/History'
import Profile from './pages/Profile/Profile'
import Cart from './pages/Cart/Cart'
import Orders from './pages/Orders/Orders'

export default function App() {
  const location = useLocation()
  const { initialize, loading } = useUserStore()
  const hideNavbar = location.pathname === '/'

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/avatar-setup" element={<ProtectedRoute><AvatarSetup /></ProtectedRoute>} />
        <Route path="/generator" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      </Routes>
    </>
  )
}
