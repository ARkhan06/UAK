const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '3h' }
  );
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Create user with default role 'user'
    const user = new User({
      firstname,
      lastname,
      email,
      password,
      role: 'user'  // Always set to 'user' on signup
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    // Compare password (simple string comparison)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Login successful - return role information and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      isAdmin: user.role === 'admin',  // True if admin, false otherwise
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};