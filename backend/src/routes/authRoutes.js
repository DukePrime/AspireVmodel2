// D:\AspireVmodel2\backend\src\routes\authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas de Autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe); // Linha 9 do erro
router.get('/protected', authMiddleware, authController.protected);

module.exports = router;