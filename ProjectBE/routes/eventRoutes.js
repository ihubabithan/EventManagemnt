const express = require('express');
const multer = require('multer');
const EventController = require('../controllers/eventController'); 

const router = express.Router();

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Public routes
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);
router.get('/:id/image', EventController.getEventImage);

// Protected routes (require authentication)
router.post('/create', upload.single('image'), EventController.createEvent);
router.put('/:id',  upload.single('image'), EventController.updateEvent);
router.delete('/:id',  EventController.deleteEvent);

module.exports = router;