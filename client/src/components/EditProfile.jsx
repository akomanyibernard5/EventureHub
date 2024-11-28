import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function EditProfile() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                         focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 resize-none"
                placeholder="Write a short bio..."
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 
                         transition-all duration-300"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 
                         transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile 