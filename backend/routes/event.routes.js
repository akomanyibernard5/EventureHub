const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const eventController = require('../controllers/event.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (file.fieldname === 'bannerImage') {
      cb(null, path.join(__dirname, '../uploads/banner-photos'));
    }
    else if (file.fieldname === "images") {
      cb(null, path.join(__dirname, '../uploads/event-photos'));
    }
    else if (file.fieldname === "videos") {
      cb(null, path.join(__dirname, '../uploads/event-videos'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    let prefix = "event-media";
    if (file.fieldname === 'bannerImage') {
      prefix = "banner-photo"
    }
    else if (file.fieldname === "images") {
      prefix = "event-photo"
    }
    else {
      prefix = "event-video"
    }

    cb(null, prefix + uniqueSuffix + ext);
  }
});


const upload_photo = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

const videoUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|mkv|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Videos only!');
    }
  }
});



router.get('/', protect, eventController.getEvents);
router.post('/', protect, upload_photo.array('bannerImage'), eventController.createEvent);
router.delete('/:id', protect, eventController.deleteEvent);
router.post('/:id/register', protect, eventController.registerForEvent);
router.get('/registered', protect, eventController.getRegisteredEvents);
router.post('/:id/unregister', protect, eventController.unregisterForEvent);
router.post('/:id/photos', protect, upload_photo.array('images', 10), eventController.uploadEventPhotos);
router.post('/:id/videos', protect, videoUpload.array('videos', 10), eventController.uploadEventVideos);
router.get('/:id/comments', protect, eventController.getEventComments);
router.post('/:id/comments', protect, eventController.addEventComment);
router.get('/stats', protect, eventController.getUserStats);
router.get('/stats/user', protect, eventController.getUserEvents);

module.exports = router;
