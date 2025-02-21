import { React, useState, useEffect, useRef, useContext } from "react";
import toast from "react-hot-toast";
import { EventContext} from "../../contexts/EventContext.jsx";
import ProfileModal from "./ProfileModal";
import UpdateProfile from "./UpdateProfile";

function Profile_drop_down({ userData, navigate }) {
  const { setIsUpdatingProfile, isUpdatingProfile, url } = useContext(EventContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${url}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Logout failed');

      localStorage.clear();
      sessionStorage.clear();
      toast.success('Successfully signed out');
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out. Please try again.');
    }
  };

  const handleViewProfile = () => {
    setIsProfileModalOpen(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 
                     transition-colors duration-200 w-full"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 
                         flex items-center justify-center text-lg font-bold text-white">
            {userData?.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm font-medium text-white">{userData?.fullName}</h3>
            <p className="text-xs text-gray-400">{userData?.email}</p>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 
                       ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900/95 backdrop-blur-sm 
                          rounded-xl border border-white/10 shadow-xl overflow-hidden">
            <div className="p-1">
              <button
                onClick={handleViewProfile}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white 
                           hover:bg-white/5 rounded-lg transition-colors duration-200"
              >
                View Profile
              </button>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 
                           rounded-lg transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userData={userData}
      />

    </>
  );
}

export default Profile_drop_down;
