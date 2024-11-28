const Event = require('../models/event.model');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads/event-photos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.createEvent = async (req, res) => {
  try {
    const userId = req.user._id;

    const eventData = {
      ...req.body,
      creator: userId
    }

    console.log('Creating event with data:', eventData);

    const event = new Event(eventData)
    await event.save()

    await event.populate('creator', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    })
  } catch (error) {
    console.error('Event creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    })
  }
}

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('creator', 'fullName email')
      .select('+registrations')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await Event.find({ creator: userId })
      .populate('creator', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user events',
      error: error.message
    });
  }
};

exports.getHourlyStats = async (req, res) => {
  try {
    const now = new Date()
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000)

    const stats = await Event.aggregate([
      {
        $match: {
          createdAt: { $gte: twentyFourHoursAgo }
        }
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          hour: "$_id",
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { hour: 1 }
      }
    ])

    // Fill in missing hours with zero counts
    const hourlyStats = Array.from({ length: 24 }, (_, i) => {
      const existingStat = stats.find(s => s.hour === i)
      return existingStat || { hour: i, count: 0 }
    })

    res.json({
      success: true,
      hourlyStats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hourly stats',
      error: error.message
    })
  }
}

exports.getTopEvents = async (req, res) => {
  try {
    const topEvents = await Event.aggregate([
      {
        $project: {
          title: 1,
          startDate: 1,
          category: 1,
          uploadCount: { $size: { $ifNull: ["$uploads", []] } }, // or any other metric you want to use
        }
      },
      {
        $sort: { uploadCount: -1 }
      },
      {
        $limit: 10
      }
    ])

    res.json({
      success: true,
      topEvents
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top events',
      error: error.message
    })
  }
}

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if the current user is the creator
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is already registered
    if (event.registrations.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check if event is full
    if (event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is already full'
      });
    }

    // Add user to registrations and increment currentAttendees
    event.registrations.push(req.user._id);
    event.currentAttendees += 1;
    await event.save();

    res.json({
      success: true,
      message: 'Successfully registered for event',
      event
    });

  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error.message
    });
  }
};

exports.getRegisteredEvents = async (req, res) => {
  try {
    const events = await Event.find({
      registrations: req.user._id
    })
    .populate('creator', 'fullName email')
    .sort({ startDate: 1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Error fetching registered events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registered events',
      error: error.message
    });
  }
};

exports.uploadEventPhotos = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is registered for this event
    if (!event.registrations.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You must be registered for this event to upload photos'
      });
    }

    // Add photo paths to event with proper URL paths
    const photoPaths = req.files.map(file => `uploads/event-photos/${file.filename}`);
    event.photos = [...(event.photos || []), ...photoPaths];
    await event.save();

    res.json({
      success: true,
      message: 'Photos uploaded successfully',
      photos: photoPaths
    });

  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading photos',
      error: error.message
    });
  }
};

exports.getEventComments = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('comments.user', 'fullName');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      comments: event.comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

exports.addEventComment = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const comment = {
      user: req.user._id,
      content: req.body.content
    };

    event.comments.push(comment);
    await event.save();

    // Populate user info before sending response
    const populatedComment = await Event.findOne(
      { _id: event._id, 'comments._id': event.comments[event.comments.length - 1]._id }
    )
    .populate('comments.user', 'fullName')
    .then(doc => doc.comments[doc.comments.length - 1]);

    res.json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
}; 