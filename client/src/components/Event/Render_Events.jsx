import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../contexts/EventContext.jsx";
import Event_card from "../Mini_features/Event_card";

function Render_Events({ events }) {
  const { IsCreateModalOpen, setIsCreateModalOpen, isEventsLoading, activeSection } = useContext(EventContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    document.title = "EventureHub - Events";
  }, [activeSection]);


  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = events.filter((event) =>
        event.title.toLowerCase().includes(lowerCaseQuery) ||
        event.description.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredEvents(events);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = events.filter((event) =>
        event.title.toLowerCase().includes(lowerCaseQuery) ||
        event.description.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredEvents(filtered);
    }
  };

  return (
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

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <input
          type="text"
          placeholder="Search for events..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Event_card key={event._id} event={event} />
          ))
        ) : (
          <p className="text-right font-bold mt-10 mr-10 whitespace-nowrap">
            No events match your search. Please check for spelling mistakes :)
          </p>

        )
        }
      </div>
    </div>
  )
}

export default Render_Events