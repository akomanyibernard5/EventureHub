import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

const PasswordInput = ({ label, value, onChange, name, required = true }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-400 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl
                   text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                   hover:text-white transition-colors"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

const ProfileModal = ({ isOpen, onClose, userData }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Password updated successfully')
        setIsChangingPassword(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(data.message || 'Failed to update password')
      }
    } catch (error) {
      console.error('Password change error:', error)
      toast.error('Error updating password')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl shadow-xl 
                    border border-white/10 animate-fade-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Profile Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 
                         flex items-center justify-center text-3xl font-bold text-white">
              {userData?.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{userData?.fullName}</h3>
              <p className="text-gray-400">{userData?.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-sm">
                  Event Organizer
                </span>
                <span className="px-2 py-1 bg-secondary-500/20 text-secondary-400 rounded-lg text-sm">
                  Premium Member
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Full Name</label>
              <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white">{userData?.fullName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white">{userData?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Member Since</label>
              <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white">2024</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Events Created</label>
              <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white">{userData?.eventsCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Password Settings</h3>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="px-4 py-2 text-sm text-primary-400 hover:text-white 
                         hover:bg-primary-500/10 rounded-lg transition-colors"
              >
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <PasswordInput
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  name="currentPassword"
                />

                <PasswordInput
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  name="newPassword"
                />

                <PasswordInput
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  name="confirmPassword"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white 
                           rounded-xl transition-colors duration-200"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-white bg-primary-500 hover:bg-primary-600 
                       rounded-xl transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal 