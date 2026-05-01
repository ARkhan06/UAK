import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Briefcase, Phone, Mail, Edit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/Authcontext';

// UAK Transport Colors
const COLORS = {
  NAVY: "#0a1e3d",
  RED: "#c8102e",
  WHITE: "#ffffff",
  LIGHT_GRAY: "#f8f9fa",
  DARK_GRAY: "#2d3748",
  BORDER: "#e2e8f0"
};

const BookingsDisplay = ({ inModal = false, showAll = false }) => {
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      if (isAuthenticated) {
        // Fetch authenticated user bookings
        const token = localStorage.getItem('token');
        
        // Check if token exists
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setBookings([]);
          setIsLoading(false);
          return;
        }
        
        // Use /all-user for history view, /current for upcoming bookings
        const endpoint = showAll ? 'http://localhost:5000/api/bookings/all-user' : 'http://localhost:5000/api/bookings/current';
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setError('Your session has expired. Please log in again.');
          setBookings([]);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data);
      } else {
        // Fetch guest bookings by email
        const guestEmail = localStorage.getItem('guestEmail');
        if (!guestEmail) {
          setError('No guest session found. Please enter your email to view your bookings.');
          setBookings([]);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/bookings/guest?email=${encodeURIComponent(guestEmail)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch guest bookings');
        }

        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated, showAll]);

  const handleUpdateBooking = async (bookingId, updatedData) => {
    try {
      if (!isAuthenticated) {
        setError('You must be logged in to update bookings');
        return;
      }

      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        setError('Your session has expired. Please log in again.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking');
      }

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      fetchBookings();
      setEditingBooking(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      if (!isAuthenticated) {
        setError('You must be logged in to cancel bookings');
        return;
      }

      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        setError('Your session has expired. Please log in again.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const BookingCard = ({ booking }) => {
    const isEditing = editingBooking?.id === booking._id;
    const [formData, setFormData] = useState({
      pickup_date: booking.pickup_date?.split('T')[0] || booking.pickup_date,
      pickup_time: booking.pickup_time,
      pickup_location: booking.pickup_location,
      dropoff_location: booking.dropoff_location,
      passengers: booking.passengers,
      luggage: booking.luggage,
      phone_number: booking.phone_number,
      email: booking.email
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="rounded-xl shadow-lg p-6 mb-4"
        style={{ backgroundColor: COLORS.WHITE }}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold" style={{ color: COLORS.NAVY }}>{booking.car_name}</h3>
          <div className="flex items-center space-x-2">
            {!isEditing && isAuthenticated && (
              <>
                <button
                  onClick={() => setEditingBooking(booking)}
                  className="p-2 rounded-full transition hover:opacity-70"
                  style={{ backgroundColor: COLORS.LIGHT_GRAY, color: COLORS.NAVY }}
                >
                  <Edit className="w-5 h-5" />
                </button>
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="p-2 rounded-full transition hover:opacity-70"
                    style={{ backgroundColor: '#fee2e2', color: COLORS.RED }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {booking.status === 'cancelled' && (
          <div className="px-4 py-2 rounded-lg mb-4" style={{ backgroundColor: '#fee2e2', color: COLORS.RED }}>
            Cancelled
          </div>
        )}

        {isEditing && isAuthenticated ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>Pickup Date</label>
                <input
                  type="date"
                  name="pickup_date"
                  value={formData.pickup_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none transition"
                  style={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.WHITE }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>Pickup Time</label>
                <input
                  type="time"
                  name="pickup_time"
                  value={formData.pickup_time}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none transition"
                  style={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.WHITE }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>Pickup Location</label>
              <input
                type="text"
                name="pickup_location"
                value={formData.pickup_location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none transition"
                style={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.WHITE }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>Dropoff Location</label>
              <input
                type="text"
                name="dropoff_location"
                value={formData.dropoff_location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none transition"
                style={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.WHITE }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>Passengers</label>
                <input
                  type="number"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  min="1"
                  max="16"
                  className="w-full p-2 border rounded-lg focus:outline-none transition"
                  style={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.WHITE }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>Luggage</label>
                <input
                  type="number"
                  name="luggage"
                  value={formData.luggage}
                  onChange={handleInputChange}
                  min="0"
                  max="16"
                  className="w-full p-2 border rounded-lg focus:outline-none transition"
                  style={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.WHITE }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>Phone</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none transition"
                  style={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.WHITE }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none transition"
                  style={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.WHITE }}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setEditingBooking(null)}
                className="px-4 py-2 rounded-lg transition"
                style={{ color: COLORS.NAVY, backgroundColor: COLORS.LIGHT_GRAY }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateBooking(booking._id, formData)}
                className="px-4 py-2 text-white rounded-lg transition hover:opacity-90"
                style={{ backgroundColor: COLORS.RED }}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2" style={{ color: COLORS.DARK_GRAY }}>
                <Calendar className="w-5 h-5" style={{ color: COLORS.NAVY }} />
                <span>{new Date(booking.pickup_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2" style={{ color: COLORS.DARK_GRAY }}>
                <Clock className="w-5 h-5" style={{ color: COLORS.NAVY }} />
                <span>{booking.pickup_time}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2" style={{ color: COLORS.DARK_GRAY }}>
                <MapPin className="w-5 h-5" style={{ color: COLORS.NAVY }} />
                <span>From: {booking.pickup_location}</span>
              </div>
              <div className="flex items-center space-x-2" style={{ color: COLORS.DARK_GRAY }}>
                <MapPin className="w-5 h-5" style={{ color: COLORS.NAVY }} />
                <span>To: {booking.dropoff_location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2" style={{ color: COLORS.DARK_GRAY }}>
                <Users className="w-5 h-5" style={{ color: COLORS.NAVY }} />
                <span>{booking.passengers} Passengers</span>
              </div>
              <div className="flex items-center space-x-2" style={{ color: COLORS.DARK_GRAY }}>
                <Briefcase className="w-5 h-5" style={{ color: COLORS.NAVY }} />
                <span>{booking.luggage} Luggage</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2" style={{ color: COLORS.DARK_GRAY }}>
                <Phone className="w-5 h-5" style={{ color: COLORS.NAVY }} />
                <span>{booking.phone_number}</span>
              </div>
              <div className="flex items-center space-x-2" style={{ color: COLORS.DARK_GRAY }}>
                <Mail className="w-5 h-5" style={{ color: COLORS.NAVY }} />
                <span>{booking.email}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: inModal ? '200px' : '400px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.RED }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div style={{ color: COLORS.RED }} className="mb-4">{error}</div>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition"
          style={{ backgroundColor: COLORS.NAVY }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={inModal ? '' : 'max-w-4xl mx-auto px-4 py-8'}>
      {!inModal && <h2 className="text-3xl font-bold mb-8" style={{ color: COLORS.NAVY }}>Your Bookings</h2>}
      
      {updateSuccess && (
        <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
          Booking updated successfully!
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-8 rounded-xl" style={{ backgroundColor: COLORS.LIGHT_GRAY }}>
          <p style={{ color: COLORS.DARK_GRAY }}>
            {isAuthenticated ? 'No upcoming bookings found.' : 'No bookings found for this email.'}
          </p>
        </div>
      ) : (
        <AnimatePresence>
          {bookings.map(booking => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default BookingsDisplay;