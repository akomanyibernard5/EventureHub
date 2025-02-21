import React, {useContext} from "react";
import { EventContext } from "../../contexts/EventContext.jsx";
import Stats_card from "../Mini_features/Stats_card";
import Event_card from "../Mini_features/Event_card";


function Render_Dashboard({userData, eventCounts, events, isEventsLoading}){
  const { setActiveSection, activeSection  } = useContext(EventContext);
    return (
    <div className="space-y-8">
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


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stats_card
          label="Total Events"
          value={eventCounts.total}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>}
          color="bg-primary-500/20 text-primary-500"
        />
        <Stats_card
          label="Live Events"
          value={eventCounts.live}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>}
          color="bg-rose-500/20 text-rose-500"
        />
        <Stats_card
          label="Upcoming Events"
          value={eventCounts.upcoming}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
          color="bg-emerald-500/20 text-emerald-500"
        />
        <Stats_card
          label="Past Events"
          value={eventCounts.past}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>}
          color="bg-blue-500/20 text-blue-500"
        />
      </div>

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
            <Event_card
              key={event._id}
              event={event}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Render_Dashboard