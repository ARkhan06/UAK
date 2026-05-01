const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',  // Vite (Frontend)
  'http://localhost:3000',  // Common React Port
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies & authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight response for 10 minutes
};

// Apply CORS Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uak-transport')
  .then(() => console.log('✅ MongoDB Connected - UAK Transport'))
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'UAK Transport Server is running' });
});

// Import Routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/Bookingroutes');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` UAK Transport Server running on port ${PORT}`);
});

module.exports = app;