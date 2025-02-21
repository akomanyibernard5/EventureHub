const Event = require('../models/event.model');
const AWS = require('aws-sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID, 
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const rekognition = new AWS.Rekognition();


exports.createEvent = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      title, description, startDate, endDate, startTime, endTime,
      location, venue, category, eventType, ticketPrice, maxAttendees
    } = req.body;


    const eventData = {
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      venue,
      category,
      eventType,
      ticketPrice,
      maxAttendees,
      creator: userId,
      currentAttendees: 0,
      status: 'published',
      createdAt: new Date().toISOString(),
    };


    const event = new Event(eventData);


    if (req.files && req.files.length > 0) {
      event.bannerImage = `uploads/banner-photos/${req.files[0].filename}`;
    }


    await event.save();
    console.log('Event Data', event)

    await event.populate('creator', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};


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

    const totalUploads = events.reduce((sum, event) => sum + (event.uploadCount || 0), 0);

    res.json({
      success: true,
      events,
      totalUploads
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user events',
      error: error.message
    });
  }
};



exports.unregisterForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const isRegistered = event.registrations.includes(req.user._id);
    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }

    event.registrations = event.registrations.filter(userId => userId.toString() !== req.user._id.toString());
    event.currentAttendees -= 1;
    await event.save();

    res.json({
      success: true,
      message: 'Event successfully unregistered',
      event
    });

  } catch (error) {
    console.error('Event unregistration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unregistering from the event',
      error: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

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

    if (event.registrations.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    if (event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is already full'
      });
    }

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
      console.log("No event")
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const comment = {
      user: req.user._id,
      content: req.body.content
    };

    console.log("User", comment)

    event.comments.push(comment);
    await event.save();

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


exports.uploadEventVideos = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (!event.registrations.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You must be registered for this event to upload videos',
      });
    }

    const videoPaths = req.files.map(file => `uploads/event-videos/${file.filename}`);
    event.videos = [...(event.videos || []), ...videoPaths];
    await event.save();

    res.json({
      success: true,
      message: 'Videos uploaded successfully',
      videos: videoPaths,
    });

  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading videos',
      error: error.message,
    });
  }
};


exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const events = await Event.find({ creator: userId });
    const totalEventsCreated = events.length;
    const totalPublishedEvents = events.filter(event => event.status === 'published').length;
    const totalCancelledEvents = events.filter(event => event.status === 'cancelled').length;
    const totalCompletedEvents = events.filter(event => event.status === 'completed').length;
    const totalAttendees = events.reduce((sum, event) => sum + event.currentAttendees, 0);
    const totalUploads = events.reduce((sum, event) => sum + event.uploadCount, 0);
    const totalRevenue = events.reduce((sum, event) => sum + event.ticketPrice * event.currentAttendees, 0);
    const totalComments = events.reduce((sum, event) => sum + event.comments.length, 0);

    const mostFrequentCategory = events.length > 0 ?
      events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {}) : null;

    const mostCommonCategory = mostFrequentCategory ?
      Object.keys(mostFrequentCategory).reduce((a, b) => mostFrequentCategory[a] > mostFrequentCategory[b] ? a : b)
      : 'N/A';
    const averageTicketPrice = events.length > 0 ? (totalRevenue / totalAttendees) || 0 : 0;
    const topEventsRevenue = await generateTopEventsRevenue(userId);
    const dailyStats = await generateDailyStats(userId);
    const hourlyStats = await generateHourlyStats(userId);
    const eventTypes = await generateEventTypeStats(events);

    res.json({
      success: true,
      totalEventsCreated,
      totalPublishedEvents,
      totalCancelledEvents,
      totalCompletedEvents,
      totalAttendees,
      totalUploads,
      totalComments,
      totalRevenue,
      mostFrequentCategory: mostCommonCategory,
      averageTicketPrice,
      hourlyStats,
      eventTypes,
      events
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const generateHourlyStats = async (userId) => {
  const last24Hours = new Date();
  last24Hours.setHours(last24Hours.getHours() - 24);

  const events = await Event.find({ creator: userId, createdAt: { $gte: last24Hours } });
  let hourlyStats = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));

  events.forEach(event => {
    const eventHour = new Date(event.createdAt).getHours();
    hourlyStats[eventHour].count += 1;
  });

  return hourlyStats;
};

const generateEventTypeStats = async (events) => {
  const eventTypeCounts = {
    'in-person': 0,
    'virtual': 0,
    'hybrid': 0
  };

  events.forEach(({ eventType }) => {
    if (eventTypeCounts.hasOwnProperty(eventType)) {
      eventTypeCounts[eventType]++;
    }
  });

  const totalEvents = events.length || 1;
  const eventTypeStats = Object.entries(eventTypeCounts).map(([name, count]) => ({
    name,
    value: parseFloat(((count / totalEvents) * 100).toFixed(2))
  }));

  console.log(eventTypeStats);
  return eventTypeStats;
};

const generateDailyStats = async (userId) => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const events = await Event.find({ creator: userId, createdAt: { $gte: last30Days } });

  let dailyStats = Array.from({ length: 30 }, (_, i) => ({ day: (i + 1).toString(), events: 0 }));

  events.forEach(event => {
    const eventDate = new Date(event.createdAt);
    const eventDay = eventDate.getDate();
    const dayIndex = eventDay - 1;
    dailyStats[dayIndex].events += 1;
  });

  return dailyStats;
};

const generateTopEventsRevenue = async (userId) => {
  const events = await Event.find({ creator: userId });

  const eventsWithRevenue = events.map(event => {
    const revenue = event.ticketPrice * event.currentAttendees;
    return { title: event.title, revenue };
  });

  const sortedEvents = eventsWithRevenue.sort((a, b) => b.revenue - a.revenue).slice(0, 10);


  const topEventsRevenue = sortedEvents.map((event, index) => ({
    event: event.title,
    revenue: event.revenue
  }));

  return topEventsRevenue;
};

async function checkLabelsRelation(labels, category) {
  const prompt = `Given the following labels: ${labels}. Determine if these labels are related to "${category}". Respond with either "True" or "False" only.`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_DEVELOPER_API);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const response = await model.generateContent(prompt);
    const result = response.response.candidates[0].content.parts[0].text.trim();
    return result;
  } catch (error) {
    console.error('Comprehend error:', error);
    return null;
  }
}

exports.uploadEventPhotos = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (!event.registrations.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You must be registered for this event to upload photos' });
    }

    if (!req.files?.length) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files[0];
    const image = fs.readFileSync(file.path);

    const rekognitionParams = { Image: { Bytes: image }, MaxLabels: 10, MinConfidence: 50 };

    const rekognitionResponse = await rekognition.detectLabels(rekognitionParams).promise();

    const mappedLabels = rekognitionResponse.Labels.map(label => ({
      name: label.Name,
      confidence: `${label.Confidence.toFixed(2)}%`,
    }));

    const labelNames = JSON.stringify(mappedLabels.map(label => `${label.name} ${label.confidence}` ));
    category = `Event Title: ${event.title}, description: ${event.description} category:${ event.category}. Make sure to give me the right answer.`
    const Google_Gemini_Result = await checkLabelsRelation(labelNames, category);

    if (!Google_Gemini_Result || Google_Gemini_Result.toLowerCase() !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'The uploaded photo is not related to the event.',
        labels: rekognitionResponse.Labels,
        isRelatedToEvent: Google_Gemini_Result,
      });
    }

    const photoPaths = req.files.map(file => `uploads/event-photos/${file.filename}`);
    event.photos = [...(event.photos || []), ...photoPaths];
    event.uploadCount += photoPaths.length;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Photos uploaded successfully',
      photos: photoPaths,
      labels: rekognitionResponse.Labels,
      isRelatedToEvent: Google_Gemini_Result,
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ success: false, message: 'Error uploading photos', error: error.message });
  }
};
