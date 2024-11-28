import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import CreateEventModal from './CreateEventModal'
import LiveGraph from './LiveGraph'
import toast from 'react-hot-toast'
import ProfileModal from './ProfileModal'
import EventDetailsModal from './EventDetailsModal'
import EventPhotoUploadModal from './EventPhotoUploadModal'
import EventCommentsModal from './EventCommentsModal'

const StatCard = ({ label, value, icon, color, trend }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10 group">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{value}</h3>
          {trend && (
            <span className={`text-sm ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  </div>
)

const SidebarItem = ({ icon, label, isActive, onClick, count }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group
      ${isActive 
        ? 'bg-primary-500/10 text-primary-400 shadow-lg border border-primary-500/20' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-500/20' : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
    {count && (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
        isActive ? 'bg-primary-500/20 text-primary-400' : 'bg-white/10 text-gray-400 group-hover:bg-white/20'
      } transition-colors`}>
        {count}
      </span>
    )}
  </button>
)

const EventCard = ({ event }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isPhotoUploadModalOpen, setIsPhotoUploadModalOpen] = useState(false)
  const currentUser = JSON.parse(localStorage.getItem('userData'))
  const isRegistered = event.registrations?.includes(currentUser?._id)

  const attendancePercentage = (event.currentAttendees / event.maxAttendees) * 100

  return (
    <>
      <div className="group relative bg-[#0c4a6e]/20 rounded-xl overflow-hidden 
                    hover:bg-[#0c4a6e]/30 transition-all duration-300">
        <div className="flex h-[180px]">
          <div className="w-1/3 relative">
            <img 
              src={event.bannerImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0c4a6e]/95" />
          </div>

          <div className="flex-1 p-5 relative bg-[#0c4a6e]/40 backdrop-blur-sm">
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                ${event.status === 'upcoming' ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' :
                  event.status === 'live' ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30' :
                  'bg-gray-500/20 text-gray-400 ring-1 ring-gray-500/30'}`}>
                {event.status}
              </span>
            </div>

            <div className="h-full flex flex-col">
              <div className="mb-auto">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 
                             group-hover:text-sky-400 transition-colors">
                  {event.title}
                </h3>

                <div className="flex items-center gap-2 text-sky-200/80 mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="space-y-3">
                {/* Attendees Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Attendee Icons */}
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} 
                             className="w-6 h-6 rounded-full bg-[#0c4a6e] border-2 border-sky-900 
                                      flex items-center justify-center">
                          <svg className="w-3 h-3 text-sky-300" fill="none" stroke="currentColor" 
                               viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-sky-200/80">
                      {event.currentAttendees}/{event.maxAttendees} Attendees
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsDetailsModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-medium text-sky-400 
                             hover:text-white hover:bg-sky-500/20 rounded-lg 
                             transition-colors duration-300 flex items-center gap-1"
                  >
                    View Details
                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="h-1 bg-[#0c4a6e]/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400/60 to-sky-400 
                             rounded-full transition-all duration-300"
                    style={{ 
                      width: `${attendancePercentage}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={event}
      />

      <EventPhotoUploadModal 
        isOpen={isPhotoUploadModalOpen}
        onClose={() => setIsPhotoUploadModalOpen(false)}
        event={event}
      />
    </>
  )
}

const ProfileDropdown = ({ userData, navigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Logout failed')

      localStorage.clear()
      sessionStorage.clear()
      toast.success('Successfully signed out')
      navigate('/login')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Error signing out. Please try again.')
    }
  }

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
                onClick={() => {
                  setIsProfileModalOpen(true)
                  setIsOpen(false)
                }}
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
  )
}

function Dashboard() {
  const [userData, setUserData] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [events, setEvents] = useState([])
  const [isEventsLoading, setIsEventsLoading] = useState(true)
  const [menuItems, setMenuItems] = useState([
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    },
    {
      id: 'events',
      label: 'My Events',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    },
    {
      id: 'registered',
      label: 'Registered Events',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    },
    {
      id: 'livegraph',
      label: 'Analytics',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    }
  ])

  const [registeredEvents, setRegisteredEvents] = useState([]);

  const fetchRegisteredEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/events/registered', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setRegisteredEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching registered events:', error);
      toast.error('Failed to fetch registered events');
    }
  };

  useEffect(() => {
    if (userData && activeSection === 'registered') {
      fetchRegisteredEvents();
    }
  }, [userData, activeSection]);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')
    if (!storedUserData) {
      navigate('/login')
      return
    }
    setUserData(JSON.parse(storedUserData))
    setIsLoading(false)
  }, [navigate])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:8000/api/events', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          const sortedEvents = data.events.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setEvents(sortedEvents);
        } else {
          throw new Error(data.message || 'Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to fetch events. Please try again.');
      } finally {
        setIsEventsLoading(false);
      }
    };

    if (userData) {
      fetchEvents()
    }
  }, [userData])

  const eventCounts = React.useMemo(() => {
    if (!events.length || !userData) return { total: 0, upcoming: 0, live: 0, past: 0 };

    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.startDate) > now);
    const liveEvents = events.filter(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      return now >= startDate && now <= endDate;
    });
    const pastEvents = events.filter(event => new Date(event.endDate) < now);

    return {
      total: events.length,
      upcoming: upcomingEvents.length,
      live: liveEvents.length,
      past: pastEvents.length
    };
  }, [events, userData]);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpenComments = (event) => {
    setSelectedEvent(event);
    setIsCommentModalOpen(true);
  };

  const handleOpenPhotoUpload = async (event) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('photos', file);
      });

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/events/${event._id}/photos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          toast.success('Photos uploaded successfully!');
          // Refresh the event data to show new photos
          fetchRegisteredEvents();
        } else {
          toast.error(data.message || 'Failed to upload photos');
        }
      } catch (error) {
        console.error('Photo upload error:', error);
        toast.error('Error uploading photos');
      }
    };

    input.click();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard()
      case 'events':
        return renderEvents()
      case 'registered':
        return renderRegisteredEvents()
      case 'livegraph':
        return <LiveGraph />
      default:
        return null
    }
  }

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 
                       flex items-center justify-center text-xl font-bold text-white">
            {userData?.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {userData?.fullName}!</h1>
            <p className="text-gray-400">Here's what's happening with your events today.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Events"
          value={eventCounts.total}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>}
          color="bg-primary-500/20 text-primary-500"
        />
        <StatCard
          label="Live Events"
          value={eventCounts.live}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>}
          color="bg-rose-500/20 text-rose-500"
        />
        <StatCard
          label="Upcoming Events"
          value={eventCounts.upcoming}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
          color="bg-emerald-500/20 text-emerald-500"
        />
        <StatCard
          label="Past Events"
          value={0}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>}
          color="bg-blue-500/20 text-blue-500"
        />
      </div>

      {/* Recent Events */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Recent Events</h2>
            <p className="text-gray-400 mt-1">Your latest event activities</p>
          </div>
          <button 
            onClick={() => setActiveSection('events')}
            className="px-4 py-2 text-primary-400 hover:text-white hover:bg-primary-500/10 
                     rounded-xl transition-all duration-300 flex items-center gap-2"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <EventCard
              key={event._id}
              event={event}
            />
          ))}
        </div>
      </div>
    </div>
  )

  const renderEvents = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">All Events</h2>
          <p className="text-gray-400 mt-1">Browse and manage your events</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl 
                   transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
          />
        ))}
      </div>
    </div>
  )

  

  const renderRegisteredEvents = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Registered Events</h2>
        <p className="text-gray-400 mt-1">Events you're participating in</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registeredEvents.map((event) => (
          <div key={event._id} 
               className="group bg-gray-800/50 backdrop-blur-sm border border-white/10 
                        rounded-2xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300">
            {/* Event Image Banner */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={event.bannerImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"} 
                alt={event.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full
                ${event.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 
                  event.status === 'cancelled' ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30' : 
                  'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30'}`}>
                {event.status}
              </span>
            </div>

            {/* Event Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Title and Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-gray-400 text-sm line-clamp-2">
                    {event.description}
                  </p>
                </div>

                {/* Event Details */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{event.venue}, {event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{event.currentAttendees}/{event.maxAttendees} Attendees</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => handleOpenComments(event)}
                    className="w-full px-4 py-2.5 bg-primary-500/10 hover:bg-primary-500/20 
                             text-primary-400 rounded-xl transition-colors flex items-center justify-center gap-2
                             hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    View Comments & Discussion
                  </button>
                  <button
                    onClick={() => handleOpenPhotoUpload(event)}
                    className="w-full px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 
                             text-emerald-400 rounded-xl transition-colors flex items-center justify-center gap-2
                             hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Share Your Photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-gray-800 min-h-screen p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-white">EventureHub</h1>
              <p className="text-gray-400 text-sm mt-1">Event Management Dashboard</p>
            </div>
            
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  count={item.count}
                  isActive={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                />
              ))}
            </nav>
          </div>

          {/* Profile Section */}
          <div className="border-t border-gray-700 pt-2">
            <ProfileDropdown userData={userData} navigate={navigate} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-900 p-8">
          {renderContent()}
        </div>
      </div>
      
      <CreateEventModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <EventCommentsModal 
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  )
}

export default Dashboard 