const User = require('../models/User'); 
const jwt = require('jsonwebtoken');

class AuthController {
  // Sign Up
  static async signUp(req, res) {
    console.log('Comming')
    try {
      const { username, email, password , role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      const user = new User({ username, email, password , role});
      await user.save();

      const token = user.generateAuthToken();

      res.status(201).json({
        message: 'User created successfully',
        user: { id: user._id, username: user.username, email: user.email , role: user.role },
        token
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = user.generateAuthToken();

      res.json({
        message: 'Login successful',
        user: { id: user._id, username: user.username, email: user.email , role: user.role },
        token
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get Profile (protected route)
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Verify Token
  static async verifyToken(req, res) {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = AuthController;