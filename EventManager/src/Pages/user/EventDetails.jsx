import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, Image, ChevronLeft, Star, Award, Globe, Share2, BookmarkPlus, Heart, Clock, User, Mail, Phone, ExternalLink } from 'lucide-react';
import { eventsApi } from '../../../utils/api';
import { format } from 'date-fns';
import Button from '../../../components/Button';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await eventsApi.getEventById(id);
        setEvent(response.data.event);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const getImageUrl = () => {
    if (event?.image) {
      if (typeof event.image === 'string') {
        return event.image;
      }
      
      if (event.image.data) {
        const uint8Array = new Uint8Array(event.image.data);
        const base64String = btoa(
          Array.from(uint8Array)
            .map(byte => String.fromCharCode(byte))
            .join('')
        );
        return `data:${event.imageContentType};base64,${base64String}`;
      }
    }
    return null;
  };

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.eventName,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 hover:bg-gray-100">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 overflow-hidden">
            {getImageUrl() ? (
              <img
                src={getImageUrl()}
                alt={event.eventName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" style={{display: getImageUrl() ? 'none' : 'flex'}}>
              <Image className="w-16 h-16 text-white/40" />
            </div>
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Price Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                event.eventType === 'free' 
                  ? 'bg-green-500' 
                  : 'bg-orange-500'
              }`}>
                {event.eventType === 'free' ? 'FREE' : `$${event.price}`}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Event Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.eventName}</h1>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="mr-4">{formatDate(event.dateTime)}</span>
                <Clock className="w-4 h-4 mr-2" />
                <span>{formatTime(event.dateTime)}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-xs text-blue-600 font-medium">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Globe className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-xs text-purple-600 font-medium">Mode</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{event.mode}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-xs text-green-600 font-medium">Attendees</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {event.attendees?.length || 0} / {event.maxAttendees || '∞'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Organizer Info (if available) */}
            {event.organizer && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Organizer</h3>
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{event.organizer.name}</p>
                    {event.organizer.email && (
                      <p className="text-sm text-gray-600">{event.organizer.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant={isRegistered ? "secondary" : "success"} 
                size="md" 
                className="flex-1"
                onClick={handleRegister}
              >
                {isRegistered ? (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Registered
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 mr-2" />
                    Register Now
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="md"
                onClick={handleSave}
                className={isSaved ? "bg-red-50 border-red-200 text-red-700" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              
              <Button variant="outline" size="md" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Registration Status */}
            {event.maxAttendees && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Registration Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(((event.attendees?.length || 0) / event.maxAttendees) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(((event.attendees?.length || 0) / event.maxAttendees) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Event Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Event Type:</span>
                <span className="font-medium capitalize">{event.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{event.duration || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{event.category || 'General'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;