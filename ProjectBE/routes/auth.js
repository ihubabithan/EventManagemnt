const express = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.login);

// Protected routes
router.get('/verify-token', authMiddleware, AuthController.verifyToken);
router.get('/profile', authMiddleware, AuthController.getProfile);

module.exports = router;