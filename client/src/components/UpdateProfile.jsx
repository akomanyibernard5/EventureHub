import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function UpdateProfile() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    bio: ''
  })

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (!userData) {
      navigate('/login')
      return
    }
    
    setFormData({
      fullName: userData.fullName || '',
      email: userData.email || '',
      phone: userData.phone || '',
      organization: userData.organization || '',
      bio: userData.bio || ''
    })
  }, [navigate])

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
        localStorage.setItem('userData', JSON.stringify(data.user))
        toast.success('Profile updated successfully', {
          position: 'top-right',
          duration: 3000,
        })
        navigate('/profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile', {
        position: 'top-right',
        duration: 3000,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Navigation */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-bold text-white">Update Profile Information</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          {/* Profile Header */}
          <div className="px-6 py-8 sm:p-10 border-b border-white/10">
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 
                           flex items-center justify-center text-3xl font-bold text-white">
                {formData.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{formData.fullName}</h2>
                <p className="text-gray-400">{formData.email}</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                         focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 resize-none transition-colors"
                placeholder="Write something about yourself..."
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 
                         transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 
                         transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile 