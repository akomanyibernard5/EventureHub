import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { EventProvider } from './contexts/EventContext'
import { Toaster } from 'react-hot-toast'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Dashboard from './components/Dashboard/Dashboard'
import Profile from "./components/Profile/Profile"
import UpdateProfile from './components/Profile/UpdateProfile'
import EditProfilePage from './components/Profile/EditProfilePage'
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <EventProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Router>
          <Toaster />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </EventProvider>
  )
}

export default App
