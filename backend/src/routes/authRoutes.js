// D:\AspireVmodel2\backend\src\routes\authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.loginUser);

// @route   GET /api/auth/me
// @desc    Get user profile
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

// --- NOVO: Rota para listar todos os usuários ---
// @route   GET /api/auth/users
// @desc    Get all users (for assignment in requirements)
// @access  Private (somente usuários autenticados podem ver a lista de outros usuários)
router.get('/users', authMiddleware, authController.getAllUsers);

module.exports = router;