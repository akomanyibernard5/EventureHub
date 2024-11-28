import { useState } from 'react'
import { toast } from 'react-hot-toast'

const InputField = ({ label, type = "text", value, onChange, name, placeholder, required = false }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-300">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary-500 
               text-white rounded-xl focus:ring-2 focus:ring-primary-500/30 
               transition-colors duration-200"
    />
  </div>
)

const CreateEventModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    venue: '',
    category: '',
    eventType: '',
    ticketPrice: 0,
    maxAttendees: '',
    bannerImage: '',
    tags: []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('userData'))
      
      // Format dates and times properly
      const eventData = {
        ...formData,
        creator: userData._id,
        startDate: `${formData.startDate}T${formData.startTime}:00.000Z`,
        endDate: `${formData.endDate}T${formData.endTime}:00.000Z`,
        currentAttendees: 0, // Add initial attendees count
        status: 'published', // Add default status
        createdAt: new Date().toISOString(),
        ticketPrice: Number(formData.ticketPrice),
        maxAttendees: Number(formData.maxAttendees)
      }

      console.log('Sending event data:', eventData) // Debug log

      const response = await fetch('http://localhost:8000/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      })

      const data = await response.json()
      console.log('Server response:', data) // Debug log

      if (data.success) {
        toast.success('Event created successfully!')
        onClose()
        window.location.reload()
      } else {
        toast.error(data.message || 'Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Error creating event. Please try again.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-xl 
                    border border-white/10 animate-fade-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Create New Event</h2>
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
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                             text-black focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                  >
                    <option value="">Select Category</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Networking">Networking</option>
                    <option value="Concert">Concert</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Tech Meetup">Tech Meetup</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                           text-black focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                  placeholder="Enter event description"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Date and Time</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Start Time"
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="End Time"
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                />

                <InputField
                  label="Venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Enter venue"
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Event Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                             text-black focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                  >
                    <option value="">Select Type</option>
                    <option value="in-person">In Person</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Capacity and Pricing */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Capacity and Pricing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Maximum Attendees"
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  placeholder="Enter maximum capacity"
                  required
                />

                <InputField
                  label="Ticket Price"
                  type="number"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  placeholder="Enter ticket price"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white 
                         rounded-lg transition-colors"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateEventModal 