const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  mode: {
    type: String,
    required: true,
    enum: ['online', 'offline'],
    lowercase: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['paid', 'free'],
    lowercase: true
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: Buffer,
    required: true
  },
  imageContentType: {
    type: String,
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

// Index for better search performance
eventSchema.index({ eventName: 'text', description: 'text' });
eventSchema.index({ dateTime: 1 });
eventSchema.index({ mode: 1 });
eventSchema.index({ eventType: 1 });

module.exports = mongoose.model('Event', eventSchema);