// D:\AspireVmodel2\backend\src\controllers\userController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Usando 'bcryptjs' para consistência com o model

// Register User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Agora, o hash da senha é feito DENTRO do User.create (no model).
        // Então, passamos a senha BRUTA para o método create do User.
        const newUser = await User.create(username, email, password); 
        
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUser, token });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        if (error.code === '23505' && error.constraint === 'users_email_key') {
            return res.status(400).json({ message: 'Este e-mail já está em uso.' });
        }
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        // CORREÇÃO: Comparar a senha bruta com o user.password_hash (que vem do banco)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido', user: { id: user.id, username: user.username, email: user.email }, token });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        res.status(500).json({ message: 'Erro ao buscar perfil do usuário', error: error.message });
    }
};

// Listar todos os usuários (para atribuição de requisitos)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users.map(user => ({ id: user.id, username: user.username })));
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao listar usuários.' });
    }
};