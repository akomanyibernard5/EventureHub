import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const InputField = ({ label, type = "text", value, onChange, name }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      name={name}
      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary-500 
               text-white rounded-xl focus:ring-2 focus:ring-primary-500/30 
               transition-colors duration-200"
    />
  </div>
)

const EditProfileModal = ({ isOpen, onClose, userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    bio: ''
  })

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        organization: userData.organization || '',
        bio: userData.bio || ''
      })
    }
  }, [userData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/user/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Profile updated successfully', {
          position: 'top-right',
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
        })
        onUpdate(data.user)
        onClose()
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile', {
        position: 'top-right',
        duration: 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl shadow-xl 
                    border border-white/10 animate-fade-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <InputField
              label="Organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary-500 
                       text-white rounded-xl focus:ring-2 focus:ring-primary-500/30 
                       transition-colors duration-200 resize-none"
              placeholder="Write a short bio..."
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <button
              type="submit"
              className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 
                       transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M5 13l4 4L19 7" />
              </svg>
              Update Profile
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 
                       transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal 