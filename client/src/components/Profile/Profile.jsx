import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')
    if (!storedUserData) {
      navigate('/login')
      return
    }
    setUserData(JSON.parse(storedUserData))
  }, [navigate])

  return (
    <div className="space-y-8">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 
                         flex items-center justify-center text-4xl font-bold text-white">
              {userData?.fullName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">{userData?.fullName}</h2>
            <p className="text-gray-400">{userData?.email}</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300">
                Event Organizer
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-500/20 text-secondary-300">
                Premium Member
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Phone</label>
                  <p className="text-white font-medium">{userData?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Organization</label>
                  <p className="text-white font-medium">{userData?.organization || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Bio</label>
                <p className="text-white font-medium">{userData?.bio || 'No bio provided'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">
                  {new Date(userData?.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Account Type</span>
                <span className="text-primary-400">Premium</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Events Created</span>
                <span className="text-white">{userData?.eventCount ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 