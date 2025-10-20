// D:\AspireVmodel2\backend\src\routes\userRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');  
const User = require('../models/userModel'); // Seu modelo de usuário

// Rota de Registro
router.post('/register', authController.register);

// Rota de Login
router.post('/login', authController.login);

// Rota protegida para obter os dados do usuário logado
router.get('/me', authMiddleware, authController.getMe);

// Rota protegida de exemplo
router.get('/protected', authMiddleware, authController.protected);

// NOVA ROTA: Obter lista de usuários (apenas informações públicas)
// Esta rota é protegida e exige autenticação
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.findAllPublicInfo(); // Método que vamos criar no userModel
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar usuários.' });
    }
});

module.exports = router;