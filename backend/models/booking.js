const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true
      // Can be either MongoDB ObjectId (for authenticated users) or email-based string (for guests)
    },
    booking_type: {
      type: String,
      enum: ['authenticated', 'guest'],
      default: 'guest',
      index: true
    },
    pickup_date: {
      type: Date,
      required: true
    },
    pickup_time: {
      type: String,
      required: true
    },
    pickup_location: {
      type: String,
      required: true
    },
    dropoff_location: {
      type: String,
      required: true
    },
    passengers: {
      type: Number,
      default: 1,
      min: 1,
      max: 50
    },
    luggage: {
      type: Number,
      default: 0,
      min: 0,
      max: 16
    },
    phone_number: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    car_id: {
      type: Number,
      required: true
    },
    car_name: {
      type: String,
      required: true
    },
    car_price: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    routeDetails: {
      distance: String,
      duration: String
    },
    created_at: {
      type: Date,
      default: Date.now,
      index: true
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Index for user bookings
bookingSchema.index({ user_id: 1, pickup_date: -1 });
bookingSchema.index({ email: 1, booking_type: 1 });

module.exports = mongoose.model('Booking', bookingSchema);