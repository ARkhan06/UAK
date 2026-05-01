const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/Bookingcontroller');
const { verifyToken, verifyTokenOptional } = require('../middleware/auth');

// Create a new booking (accepts both authenticated and guest users)
router.post('/', verifyTokenOptional, createBooking);

// Get guest bookings by email (must be before /:id route)
router.get('/guest', getGuestBookings);

// Migrate guest bookings to authenticated (authenticated only)
router.post('/migrate', verifyToken, migrateGuestBookings);

// Get all bookings
router.get('/', getAllBookings);

// Get current/upcoming bookings (authenticated only)
router.get('/current', verifyToken, getBookings);

// Get all bookings for user (authenticated only)
router.get('/all-user', verifyToken, getAllUserBookings);

// Get specific booking by ID (authenticated only)
router.get('/:id', verifyToken, getBookingById);

// Update booking details (authenticated only)
router.put('/:id', verifyToken, updateBooking);

// Cancel a booking (authenticated only)
router.put('/:id/cancel', verifyToken, cancelBooking);

// Admin routes
router.get('/admin/all', getAllBookings);
router.get('/admin/today', getTodayBookings);
router.get('/admin/week', getWeekBookings);
router.get('/admin/month', getMonthBookings);

module.exports = router;