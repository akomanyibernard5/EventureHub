import React, { useState } from 'react'
import toast from 'react-hot-toast'

const EventDetailsModal = ({ isOpen, onClose, event, onEventDeleted }) => {
  if (!isOpen || !event) return null

  const currentUser = JSON.parse(localStorage.getItem('userData'));
  // Compare string IDs to ensure consistent comparison
  const isCreator = currentUser?._id === event.creator;
  
  // Check if current user is already registered
  const isRegistered = event.registrations?.includes(currentUser?._id);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/events/${event._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Event deleted successfully');
        onClose(); // Close the modal
        if (onEventDeleted) {
          onEventDeleted(event._id); // Refresh the events list
        }
      } else {
        toast.error(data.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Error deleting event');
    }
  };

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/events/${event._id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully registered for event!');
        event.registrations = [...(event.registrations || []), currentUser._id];
        event.currentAttendees += 1;
        onClose();
      } else {
        toast.error(data.message || 'Failed to register for event');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Error registering for event');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-3xl shadow-xl 
                    border border-white/10 animate-fade-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Event Details</h2>
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
        <div className="p-6">
          <div className="space-y-6">
            {/* Event Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{event.title}</h3>
              <p className="text-gray-400">{event.description}</p>
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Created by</p>
                <p className="font-medium text-white">{event.creator?.fullName || 'Unknown'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.venue}, {event.location}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.currentAttendees}/{event.maxAttendees} Attendees</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M15 9a2 2 0 10-4 0v5a2 2 0 104 0V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M19 9l-7 7-7-7" />
                </svg>
                <span>${event.ticketPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>

            {isCreator && (
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white 
                         rounded-xl transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Event
              </button>
            )}

            {!isCreator && !isRegistered && (
              <button
                onClick={handleRegister}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white 
                         rounded-xl transition-colors"
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsModal