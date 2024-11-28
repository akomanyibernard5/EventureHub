import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import UpdateProfile from './components/UpdateProfile'
import EditProfilePage from './components/EditProfilePage'
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
