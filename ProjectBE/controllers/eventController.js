const Event = require('../models/event'); // Adjust the path as necessary

class EventController {
  // Create Event
  static async createEvent(req, res) {
    try {
        console.log({reqBody: req, file: req.file});
      const { eventName, location, mode, dateTime, description, eventType, price, maxAttendees } = req.body;

      // Check if image is uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'Event image is required' });
      }

      // Validate date
      const eventDate = new Date(dateTime);
      if (eventDate <= new Date()) {
        return res.status(400).json({ message: 'Event date must be in the future' });
      }

      // Create event
      const event = new Event({
        eventName,
        location,
        mode: mode.toLowerCase(),
        dateTime: eventDate,
        description,
        eventType: eventType.toLowerCase(),
        price: eventType.toLowerCase() === 'paid' ? (price || 0) : 0,
        image: req.file.buffer,
        imageContentType: req.file.mimetype,
        maxAttendees: maxAttendees || null
      });

      await event.save();

      res.status(201).json({
        message: 'Event created successfully',
        event: {
          id: event._id,
          eventName: event.eventName,
          location: event.location,
          mode: event.mode,
          dateTime: event.dateTime,
          description: event.description,
          eventType: event.eventType,
          price: event.price,
          maxAttendees: event.maxAttendees,
          createdAt: event.createdAt
        }
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get All Events
  static async getAllEvents(req, res) {
    try {
      const { page = 1, limit = 10, mode, eventType, search } = req.query;
      
      const query = {};
      
      // Add filters
      if (mode) query.mode = mode.toLowerCase();
      if (eventType) query.eventType = eventType.toLowerCase();
      if (search) {
        query.$or = [
          { eventName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const events = await Event.find(query)
        // .select('-image')
        .sort({ dateTime: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Event.countDocuments(query);

      res.json({
        events,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalEvents: total
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get Event by ID
  static async getEventById(req, res) {
    try {
      const event = await Event.findById(req.params.id)
        // .select('-image')
        // .populate('createdBy', 'username email')
        // .populate('attendees', 'username email');

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ event });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get Event Image
  static async getEventImage(req, res) {
    try {
      const event = await Event.findById(req.params.id);

      if (!event || !event.image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      res.set('Content-Type', event.imageContentType);
      res.send(event.image);

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update Event
  static async updateEvent(req, res) {
    try {
      const { eventName, location, mode, dateTime, description, eventType, price, maxAttendees } = req.body;
      
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Check if user is the creator
      if (event.createdBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to update this event' });
      }

      // Update fields
      if (eventName) event.eventName = eventName;
      if (location) event.location = location;
      if (mode) event.mode = mode.toLowerCase();
      if (dateTime) {
        const newDate = new Date(dateTime);
        if (newDate <= new Date()) {
          return res.status(400).json({ message: 'Event date must be in the future' });
        }
        event.dateTime = newDate;
      }
      if (description) event.description = description;
      if (eventType) {
        event.eventType = eventType.toLowerCase();
        event.price = eventType.toLowerCase() === 'paid' ? (price || 0) : 0;
      }
      if (maxAttendees !== undefined) event.maxAttendees = maxAttendees;

      // Update image if provided
      if (req.file) {
        event.image = req.file.buffer;
        event.imageContentType = req.file.mimetype;
      }

      await event.save();

      res.json({
        message: 'Event updated successfully',
        event: {
          id: event._id,
          eventName: event.eventName,
          location: event.location,
          mode: event.mode,
          dateTime: event.dateTime,
          description: event.description,
          eventType: event.eventType,
          price: event.price,
          maxAttendees: event.maxAttendees,
          updatedAt: event.updatedAt
        }
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete Event
  static async deleteEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Check if user is the creator
      if (event.createdBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to delete this event' });
      }

      await Event.findByIdAndDelete(req.params.id);

      res.json({ message: 'Event deleted successfully' });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = EventController;