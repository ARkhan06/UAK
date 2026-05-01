import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Filter, Download, MoreVertical, AlertCircle, CheckCircle, Clock4 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const NAVY = "#0a1e3d";
const RED = "#c8102e";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('recent'); // recent, today, week, month, upcoming
  const [selectedDate, setSelectedDate] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [expandedBooking, setExpandedBooking] = useState(null);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!user?.isAdmin) {
      navigate('/booking');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch bookings based on filter
  useEffect(() => {
    if (!user?.isAdmin) return;

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        let endpoint = 'http://localhost:5000/api/bookings/admin/all';

        if (filterType === 'today') {
          endpoint = 'http://localhost:5000/api/bookings/admin/today';
        } else if (filterType === 'week') {
          endpoint = 'http://localhost:5000/api/bookings/admin/week';
        } else if (filterType === 'month') {
          endpoint = 'http://localhost:5000/api/bookings/admin/month';
        }

        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [filterType, user]);

  // Filter bookings based on active filters
  useEffect(() => {
    let filtered = [...bookings];

    // Filter by upcoming dates (pickup_date is in future)
    if (filterType === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(booking => {
        const pickupDate = new Date(booking.pickup_date);
        return pickupDate > today;
      });
    }

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.pickup_date).toISOString().split('T')[0];
        return bookingDate === selectedDate;
      });
    }

    // Filter by email search
    if (searchEmail) {
      filtered = filtered.filter(booking =>
        booking.email?.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, filterType, selectedDate, searchEmail]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock4 className="w-4 h-4" /> },
      'confirmed': { bg: 'bg-blue-100', text: 'text-blue-700', icon: <CheckCircle className="w-4 h-4" /> },
      'completed': { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle className="w-4 h-4" /> }
    };

    const style = statusMap[status] || statusMap['pending'];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
        {style.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar />

      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: NAVY }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#6b7280' }}>Manage all bookings and view detailed information</p>
          </motion.div>

          {/* Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {/* Filter Type Tabs */}
              <div className="md:col-span-5 flex flex-wrap gap-2">
                {['recent', 'today', 'week', 'month', 'upcoming'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setSelectedDate('');
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      filterType === type
                        ? 'text-white'
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: filterType === type ? RED : undefined
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  style={{ borderColor: '#e5e7eb' }}
                />
              </div>

              {/* Email Search */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>
                  Search by Email
                </label>
                <input
                  type="text"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Enter email..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  style={{ borderColor: '#e5e7eb' }}
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedDate('');
                    setSearchEmail('');
                    setFilterType('recent');
                  }}
                  className="w-full px-4 py-2 rounded-lg font-semibold text-white transition-all"
                  style={{ backgroundColor: NAVY }}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Booking Count */}
            <div className="mt-4 text-sm font-semibold" style={{ color: NAVY }}>
              Total Bookings: {filteredBookings.length}
            </div>
          </motion.div>

          {/* Bookings List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg" style={{ color: '#6b7280' }}>Loading bookings...</div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: RED }} />
              <p className="text-lg font-semibold" style={{ color: NAVY }}>
                No bookings found
              </p>
              <p style={{ color: '#6b7280' }}>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Booking Card Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedBooking(expandedBooking === booking._id ? null : booking._id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-lg font-bold" style={{ color: NAVY }}>
                            {booking.car_name}
                          </h3>
                          <p style={{ color: '#6b7280' }} className="text-sm">
                            {booking.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(booking.status)}
                        <MoreVertical className="w-5 h-5" style={{ color: '#9ca3af' }} />
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Date</p>
                        <p className="text-sm font-semibold" style={{ color: NAVY }}>
                          {formatDate(booking.pickup_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Time</p>
                        <p className="text-sm font-semibold" style={{ color: NAVY }}>
                          {formatTime(booking.pickup_time)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Passengers</p>
                        <p className="text-sm font-semibold" style={{ color: NAVY }}>
                          {booking.passengers}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Price</p>
                        <p className="text-sm font-semibold" style={{ color: RED }}>
                          ${booking.car_price}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedBooking === booking._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 p-6"
                      style={{ backgroundColor: '#f9fafb' }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pickup Details */}
                        <div>
                          <h4 className="font-bold mb-3" style={{ color: NAVY }}>
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Pickup
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Location</p>
                              <p className="text-sm" style={{ color: NAVY }}>{booking.pickup_location}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Time</p>
                              <p className="text-sm" style={{ color: NAVY }}>
                                {formatDate(booking.pickup_date)} at {formatTime(booking.pickup_time)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Dropoff Details */}
                        <div>
                          <h4 className="font-bold mb-3" style={{ color: NAVY }}>
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Dropoff
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Location</p>
                              <p className="text-sm" style={{ color: NAVY }}>{booking.dropoff_location}</p>
                            </div>
                          </div>
                        </div>

                        {/* Passenger Details */}
                        <div>
                          <h4 className="font-bold mb-3" style={{ color: NAVY }}>
                            <Users className="w-4 h-4 inline mr-2" />
                            Contact
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Email</p>
                              <p className="text-sm" style={{ color: NAVY }}>{booking.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Phone</p>
                              <p className="text-sm" style={{ color: NAVY }}>{booking.phone_number}</p>
                            </div>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div>
                          <h4 className="font-bold mb-3" style={{ color: NAVY }}>
                            Details
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Type</p>
                              <p className="text-sm" style={{ color: NAVY }}>
                                {booking.booking_type === 'guest' ? 'Guest Booking' : 'Authenticated'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Created</p>
                              <p className="text-sm" style={{ color: NAVY }}>
                                {formatDate(booking.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6">
                        <button
                          className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all"
                          style={{ backgroundColor: NAVY }}
                        >
                          Edit Booking
                        </button>
                        <button
                          className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all"
                          style={{ backgroundColor: RED }}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
