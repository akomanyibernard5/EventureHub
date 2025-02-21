const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const eventSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: String,
  endTime: String,
  location: {
    type: String,
    required: function() { return this.eventType !== 'virtual'; }
  },
  venue: {
    type: String,
    required: function() { return this.eventType !== 'virtual'; }
  },
  category: {
    type: String,
    required: true,
    enum: ['Conference', 'Workshop', 'Seminar', 'Networking', 'Concert', 
           'Exhibition', 'Sports', 'Cultural', 'Tech Meetup', 'Other']
  },
  eventType: {
    type: String,
    required: true,
    enum: ['in-person', 'virtual', 'hybrid']
  },
  ticketPrice: {
    type: Number,
    default: 0
  },
  maxAttendees: {
    type: Number,
    required: true
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  uploadCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  bannerImage: {
    type: String,
    default: null
  },
  tags: [String],
  registrations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  photos: [{
    type: String
  }],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

eventSchema.index({ creator: 1 });

module.exports = mongoose.model('Event', eventSchema); 