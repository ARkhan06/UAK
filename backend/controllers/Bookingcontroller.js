const Booking = require('../models/booking');
const User = require('../models/User');

// Create a new booking (works for both authenticated and guest users)
const createBooking = async (req, res) => {
  try {
    const {
      pickupDate,
      pickupTime,
      pickupLocation,
      dropoffLocation,
      passengers,
      luggage,
      phoneNumber,
      email,
      selectedCar,
      routeDetails
    } = req.body;

    // Check if selectedCar exists and has required properties
    if (!selectedCar || !selectedCar.id || !selectedCar.name || !selectedCar.price) {
      return res.status(400).json({
        error: 'Invalid car selection',
        details: 'Car selection must include id, name, and price'
      });
    }

    // Validate required fields
    const requiredFields = {
      pickupDate,
      pickupTime,
      pickupLocation,
      dropoffLocation,
      phoneNumber,
      email,
      selectedCar
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // If user is authenticated, use their ID
    // If not authenticated (guest), use email as identifier
    const userId = req.user ? req.user.id : `guest_${email}`;
    const bookingType = req.user ? 'authenticated' : 'guest';

    // Create new booking
    const booking = new Booking({
      user_id: userId,
      booking_type: bookingType,
      email: email, // Always store email for guest identification
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      passengers: passengers || 1,
      luggage: luggage || 0,
      phone_number: phoneNumber,
      car_id: selectedCar.id,
      car_name: selectedCar.name,
      car_price: selectedCar.price,
      status: 'pending',
      routeDetails: routeDetails || null
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: bookingType === 'guest' 
        ? 'Booking created! Check your email for confirmation.' 
        : 'Booking created successfully!',
      booking: savedBooking,
      booking_type: bookingType,
      user_id: userId
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      error: 'Failed to create booking',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get bookings for authenticated user (including previous guest bookings)
const getBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Fetch user to get their email
    const user = await User.findById(userId).select('email');
    
    // Build query to get both authenticated AND previous guest bookings by email
    const queries = [
      {
        user_id: userId.toString(),
        booking_type: 'authenticated',
        pickup_date: { $gte: currentDate },
        status: { $ne: 'cancelled' }
      }
    ];

    // Also fetch previous guest bookings using user's email
    if (user && user.email) {
      queries.push({
        user_id: `guest_${user.email}`,
        booking_type: 'guest',
        pickup_date: { $gte: currentDate },
        status: { $ne: 'cancelled' }
      });
    }

    // Fetch bookings from both queries and combine
    const bookingsArray = await Promise.all(
      queries.map(query => Booking.find(query).lean())
    );

    // Merge all bookings and sort
    const bookings = bookingsArray
      .flat()
      .sort((a, b) => {
        // Sort by status first, then date, then time
        const statusOrder = { 'pending': 0, 'confirmed': 1, 'in_progress': 2, 'completed': 3 };
        const statusDiff = (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999);
        if (statusDiff !== 0) return statusDiff;
        
        const dateDiff = new Date(a.pickup_date) - new Date(b.pickup_date);
        if (dateDiff !== 0) return dateDiff;
        
        return a.pickup_time.localeCompare(b.pickup_time);
      });

    const formattedBookings = bookings.map(booking => ({
      ...booking,
      statusText: getStatusText(booking.status)
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details: error.message
    });
  }
};
    
// Get guest bookings by email (no authentication required)
const getGuestBookings = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const guestId = `guest_${email}`;

    const bookings = await Booking.find({
      user_id: guestId,
      booking_type: 'guest'
    })
      .sort({ created_at: -1 })
      .lean();

    res.json({
      success: true,
      email: email,
      booking_count: bookings.length,
      bookings: bookings
    });
  } catch (error) {
    console.error('Error fetching guest bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details: error.message
    });
  }
};

// Helper function to get user-friendly status text
const getStatusText = (status) => {
  const statusMap = {
    'confirmed': 'Confirmed',
    'pending': 'Pending Confirmation',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'in_progress': 'In Progress'
  };
  return statusMap[status] || status;
};

// Get all bookings for authenticated user (including past AND previous guest bookings)
const getAllUserBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;

    // Fetch user to get their email
    const user = await User.findById(userId).select('email');
    
    // Build query to get both authenticated AND previous guest bookings by email
    const queries = [
      {
        user_id: userId.toString(),
        booking_type: 'authenticated'
      }
    ];

    // Also fetch previous guest bookings using user's email
    if (user && user.email) {
      queries.push({
        user_id: `guest_${user.email}`,
        booking_type: 'guest'
      });
    }

    // Fetch bookings from both queries and combine
    const bookingsArray = await Promise.all(
      queries.map(query => Booking.find(query).lean())
    );

    // Merge all bookings and sort by date descending
    const bookings = bookingsArray
      .flat()
      .sort((a, b) => {
        const dateDiff = new Date(b.pickup_date) - new Date(a.pickup_date);
        if (dateDiff !== 0) return dateDiff;
        return b.pickup_time.localeCompare(a.pickup_time);
      });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details: error.message
    });
  }
};

// Update a booking (authenticated users only)
const updateBooking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization: either authenticated user with matching ID or guest booking with matching email
    const isOwner = booking.user_id.toString() === userId.toString() || 
                    booking.user_id === `guest_${booking.email}`;
    
    if (!isOwner) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    const {
      pickup_date,
      pickup_time,
      pickup_location,
      dropoff_location,
      passengers,
      luggage,
      phone_number,
      email
    } = req.body;

    // Validate required fields
    const requiredFields = {
      pickup_date,
      pickup_time,
      pickup_location,
      dropoff_location,
      phone_number,
      email
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        pickup_date,
        pickup_time,
        pickup_location,
        dropoff_location,
        passengers: passengers || null,
        luggage: luggage || null,
        phone_number,
        email,
        updated_at: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      error: 'Failed to update booking',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Cancel a booking (authenticated users only)
const cancelBooking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization: either authenticated user with matching ID or guest booking with matching email
    const isOwner = booking.user_id.toString() === userId.toString() || 
                    booking.user_id === `guest_${booking.email}`;
    
    if (!isOwner) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    const cancelledBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: 'cancelled',
        updated_at: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      booking: cancelledBooking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      error: 'Failed to cancel booking',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get booking by ID (authenticated users only)
const getBookingById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization: either authenticated user with matching ID or guest booking with matching email
    const isOwner = booking.user_id.toString() === userId.toString() || 
                    booking.user_id === `guest_${booking.email}`;
    
    if (!isOwner) {
      return res.status(403).json({ error: 'Booking not found or unauthorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      error: 'Failed to fetch booking',
      details: error.message
    });
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .sort({ created_at: -1 })
      .lean();

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get today's bookings
const getTodayBookings = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      created_at: { $gte: startOfDay, $lte: endOfDay }
    })
      .sort({ created_at: -1 })
      .lean();

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching today bookings:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s bookings' });
  }
};

// Get this week's bookings
const getWeekBookings = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const bookings = await Booking.find({
      created_at: { $gte: startOfWeek, $lt: endOfWeek }
    })
      .sort({ created_at: -1 })
      .lean();

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching week bookings:', error);
    res.status(500).json({ error: 'Failed to fetch this week\'s bookings' });
  }
};

// Get this month's bookings
const getMonthBookings = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      created_at: { $gte: startOfMonth, $lte: endOfMonth }
    })
      .sort({ created_at: -1 })
      .lean();

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching month bookings:', error);
    res.status(500).json({ error: 'Failed to fetch this month\'s bookings' });
  }
};

// Migrate guest bookings to authenticated when user logs in/signs up
const migrateGuestBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;
    
    // Fetch user to get their email
    const user = await User.findById(userId).select('email');
    
    if (!user || !user.email) {
      return res.status(400).json({ error: 'User email not found' });
    }

    const guestUserId = `guest_${user.email}`;

    // Find all guest bookings with this email
    const guestBookings = await Booking.find({
      user_id: guestUserId,
      booking_type: 'guest'
    });

    if (guestBookings.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No guest bookings to migrate',
        migratedCount: 0
      });
    }

    // Update all guest bookings to authenticated
    const result = await Booking.updateMany(
      {
        user_id: guestUserId,
        booking_type: 'guest'
      },
      {
        user_id: userId.toString(),
        booking_type: 'authenticated',
        updated_at: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: `Successfully migrated ${result.modifiedCount} guest bookings to authenticated`,
      migratedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error migrating guest bookings:', error);
    res.status(500).json({
      error: 'Failed to migrate guest bookings',
      details: error.message
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getGuestBookings,
  getAllUserBookings,
  updateBooking,
  cancelBooking,
  getBookingById,
  getAllBookings,
  getTodayBookings,
  getWeekBookings,
  getMonthBookings,
  migrateGuestBookings
};