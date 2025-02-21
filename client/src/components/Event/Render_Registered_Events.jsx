import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { EventContext } from "../../contexts/EventContext.jsx";
import { CircleCheckBig, Ban } from "lucide-react";


function Render_Registered_Events({ registeredEvents, fetchRegisteredEvents, isEventsLoading }) {
  const { selectedEvent, setSelectedEvent, isCommentModalOpen, setIsCommentModalOpen, activeSection , url} = useContext(EventContext);
  const [previewImage, setPreviewImage] = useState(null);
  const [detectedLabels, setDetectedLabels] = useState([]);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [isRelatedToEvents, setIsRelatedToEvents] = useState(null);
  const handleOpenComments = (event) => {
    setSelectedEvent(event);
    setIsCommentModalOpen(true);
  };


  const handleOpenMediaUpload = async (event) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/*';

    input.onchange = async (e) => {
      const files = Array.from(e.target.files);

      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      const videoFiles = files.filter(file => file.type.startsWith('video/'));

      const imageFormData = new FormData();
      imageFiles.forEach(file => imageFormData.append('images', file));

      const videoFormData = new FormData();
      videoFiles.forEach(file => videoFormData.append('videos', file));


      try {
        const token = localStorage.getItem('token');

        if (imageFiles.length > 0) {
          const firstImageFile = imageFiles[0];
          setPreviewImage(URL.createObjectURL(firstImageFile));

          const imageResponse = await fetch(`${url}/api/events/${event._id}/photos`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: imageFormData
          });

          const imageData = await imageResponse.json();

          console.log(imageData)

          if (imageData.success) {
            setDetectedLabels(imageData.labels);
            setBoundingBoxes(imageData.labels.map(label => label.Instances));
            setIsRelatedToEvents(imageData.isRelatedToEvents)
            toast.success(imageData.message);
          }
          else if (!imageData.setisRelatedToEvents) {
            setIsRelatedToEvents(imageData.isRelatedToEvents)
            toast.error(imageData.message);
          }
          else {
            toast.error(imageData.message);
          }
        }

        if (videoFiles.length > 0) {
          const videoResponse = await fetch(`${url}/api/events/${event._id}/videos`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: videoFormData
          });

          const videoData = await videoResponse.json();
          if (videoData.success) {
            toast.success('Videos uploaded successfully!');
          } else {
            toast.error(videoData.message || 'Failed to upload videos');
          }
        }
        fetchRegisteredEvents();
      } catch (error) {
        console.error('Media upload error:', error);
        toast.error('Error uploading media');
      }
    };

    input.click();
  };

  const closePreview = () => {
    setPreviewImage(null);
    setDetectedLabels([]);
    setBoundingBoxes([]);
    fetchRegisteredEvents();
  };

  useEffect(() => {
    document.title = "EventureHub - Registered Events";
  }, [activeSection]);



  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Registered Events</h2>
        <p className="text-gray-400 mt-1">Events you're participating in</p>
      </div>

      {isEventsLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map((event) => (
            <div key={event._id}
              className="group bg-gray-800/50 backdrop-blur-sm border border-white/10 
                            rounded-2xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`${url}/${event.bannerImage}` || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"}
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

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-gray-400 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>

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
                      onClick={() => handleOpenMediaUpload(event)}
                      className="w-full px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 
                                 text-emerald-400 rounded-xl transition-colors flex items-center justify-center gap-2
                                 hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Share Your Media
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg w-[80%] md:w-[60%] lg:w-[40%]">
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 text-black font-bold text-xl"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold text-center mb-4 text-black">Analyzing your photo</h3>
            {isRelatedToEvents ?
              (
                <CircleCheckBig />
              ) : (
                <Ban />
              )
            }

            <div className="relative">
              <img
                src={previewImage}
                alt="Uploaded Preview"
                className="max-w-full max-h-[400px] object-contain mx-auto"
              />

              {detectedLabels.map((label) =>
                label.Instances &&
                label.Instances.map((instance, index) => (
                  <div
                    key={index}
                    className="rounded-md"
                    style={{
                      position: "absolute",
                      top: `${instance.BoundingBox.Top * 100}%`,
                      left: `${instance.BoundingBox.Left * 100}%`,
                      width: `${instance.BoundingBox.Width * 100}%`,
                      height: `${instance.BoundingBox.Height * 100}%`,
                      border: "2px solid yellow",
                    }}
                  >
                    <label
                      className="absolute bg-black text-white text-xs px-1 rounded-md"
                      style={{
                        top: "-1.2rem",
                        left: "0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label.Name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}



    </div>
  )
}


export default Render_Registered_Events;
