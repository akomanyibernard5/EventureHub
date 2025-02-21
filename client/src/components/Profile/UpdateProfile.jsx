import { useState, useEffect, useContext } from 'react';
import { EventContext } from '../../contexts/EventContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function UpdateProfile() {
  const { activeSection, setActiveSection, url } = useContext(EventContext)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    bio: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      navigate('/login');
      return;
    }

    setFormData({
      fullName: userData.fullName || '',
      email: userData.email || '',
      phone: userData.phone || '',
      organization: userData.organization || '',
      bio: userData.bio || ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${url}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('userData', JSON.stringify(data.user));
        toast.success('Profile updated successfully', {
          position: 'top-right',
          duration: 3000,
        });
        setActiveSection("profile")
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile', {
        position: 'top-right',
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="ml-4 text-xl font-bold text-white">Update Profile Information</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
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

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-colors"
                />
              </div>
            </div>

            <div className="space-x-4 flex justify-end">
              <button
                className="px-8 py-3 text-sm text-gray-400 bg-transparent border border-gray-400 
                           rounded-xl hover:bg-gray-800/30 focus:ring-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 text-sm text-white bg-primary-500 rounded-xl 
                           hover:bg-primary-400 focus:ring-2 focus:ring-primary-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
