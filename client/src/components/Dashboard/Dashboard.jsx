import React, { useEffect, useState, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { EventContext } from "../../contexts/EventContext.jsx";
import CreateEventModal from '../Event/CreateEventModal.jsx'
import LiveGraph from '../Mini_features/LiveGraph.jsx'
import toast from 'react-hot-toast'
import EventCommentsModal from '../Comments/EventCommentsModal.jsx'
import SidebarItem from '../Mini_features/Sidebar_item.jsx'
import Profile_drop_down from '../Profile/Profile_drop_down.jsx'
import Render_Dashboard from './Render_Dashboard.jsx';
import Render_Events from '../Event/Render_Events.jsx'
import Render_Registered_Events from '../Event/Render_Registered_Events.jsx'
import UpdateProfile from '../Profile/UpdateProfile.jsx';
import Profile from '../Profile/Profile.jsx';



function Dashboard() {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
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

  const { selectedEvent, setSelectedEvent, isCommentModalOpen, setIsCommentModalOpen, setIsCreateModalOpen, isCreateModalOpen, setActiveSection, activeSection, url} = useContext(EventContext);

  const [registeredEvents, setRegisteredEvents] = useState([]);

  const fetchRegisteredEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${url}/api/events/registered`, {
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
        setIsLoading(false)
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
  }, [navigate])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${url}/api/events`, {
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
      const startDate = new Date(event.startDate).getTime();
      const endDate = new Date(event.endDate).getTime();
      const nowTime = now.getTime();
      return nowTime >= startDate && nowTime <= endDate;
    });

    const pastEvents = events.filter(event => new Date(event.endDate) < now);

    return {
      total: events.length,
      upcoming: upcomingEvents.length,
      live: liveEvents.length,
      past: pastEvents.length
    };
  }, [events, userData]);


  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Render_Dashboard userData={userData} eventCounts={eventCounts} events={events} />;
      case 'events':
        return <Render_Events events={events} isEventsLoading={isEventsLoading} />;
      case 'registered':
        return <Render_Registered_Events
          registeredEvents={registeredEvents}
          fetchRegisteredEvents={fetchRegisteredEvents}
          isEventsLoading={isEventsLoading}
        />;
      case 'livegraph':
        return <LiveGraph />;
      case 'updateProfile':
        return <UpdateProfile />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  }


  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        <div className="w-72 bg-gray-800 min-h-screen p-6 flex flex-col justify-between">
          <div>
            <a href="/dashboard"><div className="mb-4">
              <h1 className="text-2xl font-bold text-white">EventureHub</h1>
            </div>
            </a>

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

          <div className="border-t border-gray-700 pt-2">
            <Profile_drop_down userData={userData} navigate={navigate} />
          </div>
        </div>

        <div className="flex-1 bg-gray-900 p-8">
          {isEventsLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            renderContent({ userData, eventCounts, events, registeredEvents })
          )}
        </div>

      </div>

      <CreateEventModal
        isCreateModalOpen={isCreateModalOpen}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userData={userData}
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