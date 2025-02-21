import { React, useState, useContext } from "react";
import { EventContext } from "../../contexts/EventContext";
import EventDetailsModal from "../Event/EventDetailsModal";
import EventPhotoUploadModal from "../Event/EventPhotoUploadModal";

function Event_card({ event }) {
  const { url } = useContext(EventContext)
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
              src={`${url}/${event.bannerImage}` || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"}
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
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

export default Event_card