import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus, Wand2 } from 'lucide-react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { eventsApi } from '../../../utils/api';

const GEMINI_API_KEY = 'AIzaSyBHUUCq_XOpANOU2BCC40ciGa5p69N9Yxc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Add helper function to convert buffer to base64 image
const bufferToBase64ImageUrl = (buffer) => {
  if (!buffer || !buffer.data) return null;
  const base64String = btoa(
    buffer.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  return `data:image/jpeg;base64,${base64String}`;
};

const CreateEventPage = () => {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState('create');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch events when component mounts and when switching to list view
  useEffect(() => {
    const fetchEvents = async () => {
      if (currentView === 'list') {
        setIsLoading(true);
        try {
          const response = await eventsApi.getEvents();
          setEvents(response.data.events || []);
        } catch (error) {
          console.error('Error fetching events:', error);
          alert('Failed to fetch events. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();
  }, [currentView]);

  // Cleanup image preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const formik = useFormik({
    initialValues: {
      eventName: '',
      location: '',
      mode: 'offline',
      date: '',
      time: '',
      description: '',
      eventType: 'free',
      price: '',
      maxAttendees: '',
      image: null
    },
    validationSchema: Yup.object({
      eventName: Yup.string().required('Required'),
      location: Yup.string().required('Required'),
      mode: Yup.string().required('Required'),
      date: Yup.string().required('Required'),
      time: Yup.string().required('Required'),
      description: Yup.string().required('Required').min(20, 'Description must be at least 20 characters'),
      eventType: Yup.string().required('Required'),
      price: Yup.number(),
      maxAttendees: Yup.number().min(1, 'Minimum 1 attendee').nullable(),
      image: Yup.mixed().required('Image is required')
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const formData = new FormData();

        // Combine date and time into dateTime
        const dateTime = new Date(`${values.date}T${values.time}`).toISOString();

        // Append all fields
        formData.append('eventName', values.eventName);
        formData.append('location', values.location);
        formData.append('mode', values.mode);
        formData.append('dateTime', dateTime);
        formData.append('description', values.description);
        formData.append('eventType', values.eventType);
        formData.append('price', values.eventType === 'free' ? 0 : values.price);
        formData.append('maxAttendees', values.maxAttendees || '');

        // Append the image file
        if (values.image) {
          formData.append('image', values.image);
        }

        // Send the request
        const response = await eventsApi.createEvent(formData);
        
        // Fetch updated events list
        const updatedEventsResponse = await eventsApi.getEvents();
        setEvents(updatedEventsResponse.data.events || []);
        
        // Clear the image preview
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }
        resetForm();
        setCurrentView('list');
      } catch (error) {
        console.error('Error creating event:', error);
        alert('Failed to create event. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file instanceof File) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        e.target.value = ''; // Reset file input
        formik.setFieldValue('image', null);
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }
        return;
      }
      
      formik.setFieldValue('image', file);
      // Revoke the previous preview URL to avoid memory leaks
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      // Clear the image if invalid
      e.target.value = ''; // Reset file input
      formik.setFieldValue('image', null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
  };

  const generateDescription = async () => {
    setIsGeneratingDescription(true);
    try {
      const { eventName, location, mode, dateTime, eventType, price, maxAttendees } = formik.values;
      
      const prompt = `Generate a compelling event description for the following event:
      - Event Name: ${eventName}
      - Location: ${location}
      - Mode: ${mode}
      - Date and Time: ${new Date(dateTime).toLocaleString()}
      - Type: ${eventType === 'free' ? 'Free Event' : `Paid Event ($${price})`}
      ${maxAttendees ? `- Maximum Attendees: ${maxAttendees}` : ''}
      
      Please write an engaging and professional description that highlights the key aspects of this event. Do not include any markdown formatting or asterisks in the response.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        // Clean up the response by removing asterisks and any extra whitespace
        const cleanedText = data.candidates[0].content.parts[0].text
          .replace(/\*+/g, '') // Remove all asterisks
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim(); // Remove leading/trailing whitespace
        
        formik.setFieldValue('description', cleanedText);
      } else {
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again or write manually.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  if (currentView === 'list') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <Button onClick={() => setCurrentView('create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Event
          </Button>
        </div>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events created yet</p>
            <Button onClick={() => setCurrentView('create')} className="mt-4">
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map(event => (
              <div key={event._id || event.id} className="bg-white rounded-xl shadow-lg p-6 border">
                <div className="flex gap-4">
                  {event.image && (
                    <img
                      src={bufferToBase64ImageUrl(event.image) || 'https://via.placeholder.com/150?text=No+Image'}
                      alt={event.eventName}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.eventName}</h3>
                    <p className="text-gray-600 mb-2">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📍 {event.location}</span>
                      <span>📅 {new Date(event.dateTime).toLocaleString()}</span>
                      <span>🎯 {event.mode}</span>
                      <span>💰 {event.eventType === 'free' ? 'Free' : `$${event.price}`}</span>
                      {event.maxAttendees && <span>👥 Max {event.maxAttendees}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Event Name"
              name="eventName"
              value={formik.values.eventName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.eventName && formik.errors.eventName}
            />
            <Input
              label="Location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && formik.errors.location}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <select
                name="mode"
                value={formik.values.mode}
                onChange={formik.handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </div>
            
            {/* Date and Time Fields */}
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && formik.errors.date}
                min={new Date().toISOString().split('T')[0]}
              />
              <Input
                label="Time"
                name="time"
                type="time"
                value={formik.values.time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.time && formik.errors.time}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                name="eventType"
                value={formik.values.eventType}
                onChange={formik.handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            {formik.values.eventType === 'paid' && (
              <Input
                label="Price ($)"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && formik.errors.price}
              />
            )}
          </div>

          {/* Description Textarea */}
          <div className="relative mt-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
              {formik.touched.description && formik.errors.description && (
                <span className="text-red-500 ml-2 text-xs">{formik.errors.description}</span>
              )}
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={6}
                className={`w-full px-4 py-3 text-sm border-2 rounded-lg resize-none transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  ${formik.touched.description && formik.errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
                placeholder="Provide a detailed description of your event..."
              />
              <Button
                type="button"
                onClick={generateDescription}
                disabled={isGeneratingDescription || !formik.values.eventName || !formik.values.date}
                className="absolute right-2 top-2 px-3 py-1 text-sm"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGeneratingDescription ? 'Generating...' : 'Generate Description'}
              </Button>
              <div className="mt-1 text-xs text-gray-500">
                {formik.values.description.length} characters
                {formik.values.description.length < 20 && " (minimum 20 required)"}
              </div>
            </div>
          </div>

          <Input
            label="Max Attendees"
            name="maxAttendees"
            type="number"
            value={formik.values.maxAttendees}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.maxAttendees && formik.errors.maxAttendees}
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
            {formik.errors.image && formik.touched.image && (
              <div className="text-sm text-red-500">{formik.errors.image}</div>
            )}
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" loading={formik.isSubmitting} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCurrentView('list')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
