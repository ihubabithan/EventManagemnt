import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, DollarSign, Image, Plus, Search, Filter, Eye, ChevronLeft, Star, Award, Zap, Globe, ArrowRight, Heart, Share2, BookmarkPlus, TrendingUp, CalendarRange, MapPinned } from 'lucide-react';
import { eventsApi } from '../../../utils/api';
import { format } from 'date-fns';
import Input from '../../../components/Input';

// Reusable Input Component with enhanced styling


// Enhanced Button Component with glassmorphism effects
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 backdrop-blur-sm';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 focus:ring-blue-500/50',
    secondary: 'bg-white/80 hover:bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 shadow-lg focus:ring-gray-500/30',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30 focus:ring-emerald-500/50',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/30 focus:ring-red-500/50',
    outline: 'border-2 border-blue-500 bg-blue-50/50 text-blue-600 hover:bg-blue-500 hover:text-white shadow-lg focus:ring-blue-500/50',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 focus:ring-gray-500/30'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </div>
      )}
    </button>
  );
};

// Enhanced Event Card with glassmorphism and animations
const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'EEE, MMM d, yyyy h:mm a');
  };

  const getImageUrl = () => {
    if (event.image) {
      // If image is already a base64 string or URL
      if (typeof event.image === 'string') {
        return event.image;
      }
      
      // If image is binary data
      if (event.image.data) {
        // Convert Uint8Array or array-like object to base64
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

  const getEventStatus = () => {
    const now = new Date();
    const eventDate = new Date(event.dateTime);
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Past Event', color: 'bg-gray-400' };
    } else if (diffDays === 0) {
      return { text: 'Today', color: 'bg-green-400' };
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', color: 'bg-blue-400' };
    } else if (diffDays <= 7) {
      return { text: 'This Week', color: 'bg-purple-400' };
    }
    return { text: 'Upcoming', color: 'bg-indigo-400' };
  };

  const status = getEventStatus();

  return (
    <div 
      className="group relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay for card */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Image section with enhanced styling */}
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
          {getImageUrl() ? (
            <img
              src={getImageUrl()}
              alt={event.eventName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Image className="w-16 h-16 text-white/60" />
            </div>
          )}
        </div>
        
        {/* Floating badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
            event.eventType === 'free' 
              ? 'from-emerald-400 to-green-500' 
              : 'from-amber-400 to-orange-500'
          } shadow-lg backdrop-blur-sm`}>
            {event.eventType === 'free' ? (
              <>
                <Star className="w-3 h-3 mr-1" />
                FREE
              </>
            ) : (
              <>
                <DollarSign className="w-3 h-3 mr-1" />
                ${event.price}
              </>
            )}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white ${status.color} shadow-lg backdrop-blur-sm`}>
            {status.text}
          </span>
        </div>
        
        <div className="absolute top-4 right-4">
          <div className={`w-3 h-3 rounded-full ${event.mode === 'online' ? 'bg-green-400' : 'bg-blue-400'} animate-pulse`}></div>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {event.eventName}
          </h3>
        </div>

        <div className="space-y-3 text-sm text-gray-600 mb-5">
          <div className="flex items-center group-hover:text-blue-600 transition-colors duration-300">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 mr-3">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium">{formatDate(event.dateTime)}</span>
          </div>
          
          <div className="flex items-center group-hover:text-purple-600 transition-colors duration-300">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 mr-3">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-medium truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center group-hover:text-emerald-600 transition-colors duration-300">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 mr-3">
              <Globe className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-medium capitalize">{event.mode}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-5 line-clamp-2 leading-relaxed">{event.description}</p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 mr-2">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <span className="font-medium">
              {event.attendees?.length || 0}/{event.maxAttendees || 'Unlimited'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500 font-medium">Popular</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/events/${event._id}`)}
            className="flex-1"
            icon={<Eye className="w-4 h-4" />}
          >
            View Details
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-3"
            icon={<Heart className="w-4 h-4" />}
          />
          <Button
            variant="ghost"
            size="sm"
            className="px-3"
            icon={<Share2 className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
};

// Main App Component with enhanced UI
const EventManagementApp = () => {
  const [currentView, setCurrentView] = useState('list');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const filterDateByOption = (dateTime, option) => {
    const eventDate = new Date(dateTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    switch (option) {
      case 'today':
        return eventDate >= today && eventDate < tomorrow;
      case 'tomorrow':
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        return eventDate >= tomorrow && eventDate < dayAfterTomorrow;
      case 'thisWeek':
        return eventDate >= today && eventDate <= nextWeek;
      case 'thisMonth':
        return eventDate >= today && eventDate <= nextMonth;
      default:
        return true;
    }
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventsApi.getEvents();
        const fetchedEvents = response.data.events || [];
        setEvents(fetchedEvents);
        
        // Extract unique locations for the filter
        const uniqueLocations = [...new Set(fetchedEvents.map(event => event.location))];
        setLocations(uniqueLocations);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Only fetch once when component mounts

  // Apply all filters locally
  const getFilteredEvents = () => {
    return events.filter(event => {
      // Search term filter
      const matchesSearch = !searchTerm || 
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Mode filter
      const matchesMode = filterMode === 'all' || event.mode === filterMode;

      // Type filter
      const matchesType = filterType === 'all' || event.eventType === filterType;

      // Location filter
      const matchesLocation = filterLocation === 'all' || event.location === filterLocation;

      // Date filter
      const matchesDate = filterDate === 'all' || filterDateByOption(event.dateTime, filterDate);

      return matchesSearch && matchesMode && matchesType && matchesLocation && matchesDate;
    });
  };

  // Calculate pagination
  const ITEMS_PER_PAGE = 9;
  const filteredEvents = getFilteredEvents();
  const paginatedEvents = filteredEvents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const calculatedTotalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  // Update total pages whenever filtered results change
  useEffect(() => {
    setTotalPages(calculatedTotalPages);
    // Reset to first page if current page is out of bounds
    if (page > calculatedTotalPages) {
      setPage(1);
    }
  }, [calculatedTotalPages, page]);

  // No need for additional filtering since it's handled in getFilteredEvents
  const displayedEvents = paginatedEvents;

  // Enhanced Event List View
  const EventListView = () => (
    <div>
      {/* Hero Section */}
      <div className="relative mb-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
        <div className="relative py-6 px-8">
          <h1 className="text-xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect, learn, and grow with events that matter to you
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
        <div className="flex flex-col gap-6">
          {/* Search Bar */}
          <div className="flex-1">
  
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5 text-gray-400" />}
                className="mb-0"
              />
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Mode Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline-block mr-2" />
                Event Mode
              </label>
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
              >
                <option value="all">All Modes</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline-block mr-2" />
                Event Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
              >
                <option value="all">All Types</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinned className="w-4 h-4 inline-block mr-2" />
                Location
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarRange className="w-4 h-4 inline-block mr-2" />
                Date Range
              </label>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filterMode !== 'all' || filterType !== 'all' || filterLocation !== 'all' || filterDate !== 'all') && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filterMode !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Globe className="w-4 h-4 mr-1" />
              {filterMode === 'online' ? 'Online' : 'Offline'}
            </span>
          )}
          {filterType !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <DollarSign className="w-4 h-4 mr-1" />
              {filterType === 'free' ? 'Free' : 'Paid'}
            </span>
          )}
          {filterLocation !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              <MapPinned className="w-4 h-4 mr-1" />
              {filterLocation}
            </span>
          )}
          {filterDate !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              <CalendarRange className="w-4 h-4 mr-1" />
              {filterDate === 'today' ? 'Today' :
               filterDate === 'tomorrow' ? 'Tomorrow' :
               filterDate === 'thisWeek' ? 'This Week' :
               'This Month'}
            </span>
          )}
          <button
            onClick={() => {
              setFilterMode('all');
              setFilterType('all');
              setFilterLocation('all');
              setFilterDate('all');
            }}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
            <div className="absolute inset-2 animate-pulse rounded-full bg-blue-500/20"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayedEvents.map(event => (
            <EventCard
              key={event._id}
              event={event}
            />
          ))}
        </div>
      )}

      {!loading && displayedEvents.length === 0 && (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">🎪</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No events found</h3>
          <p className="text-gray-600 text-lg mb-8">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {currentView === 'list' && <EventListView />}
        {currentView === 'view' && <EventDetailView />}
      </main>
    </div>
  );
};

export default EventManagementApp;