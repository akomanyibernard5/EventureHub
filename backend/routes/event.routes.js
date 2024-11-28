const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const eventController = require('../controllers/event.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/event-photos'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'event-photo-' + uniqueSuffix + ext);
  }
});


const upload = multer({ 
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

router.get('/', protect, eventController.getEvents);
router.post('/', protect, eventController.createEvent);
router.delete('/:id', protect, eventController.deleteEvent);
router.post('/:id/register', protect, eventController.registerForEvent);
router.get('/registered', protect, eventController.getRegisteredEvents);
router.post('/:id/photos', protect, upload.array('photos', 10), eventController.uploadEventPhotos);
router.get('/:id/comments', protect, eventController.getEventComments);
router.post('/:id/comments', protect, eventController.addEventComment);
router.get('/stats/hourly', protect, eventController.getHourlyStats);
router.get('/stats/top', protect, eventController.getTopEvents);


module.exports = router; 