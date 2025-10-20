// D:\AspireVmodel2\backend\src\controllers\authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create(username, email, hashedPassword);
        res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser });
    } catch (error) {
        console.error('Erro no registro:', error);
        if (error.code === '23505') { // Erro de violação de unique constraint (email ou username já existem)
            return res.status(409).json({ message: 'Nome de usuário ou e-mail já registrado.' });
        }
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login bem-sucedido!', token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId); // req.userId vem do authMiddleware
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.protected = (req, res) => {
    res.status(200).json({ message: `Bem-vindo à rota protegida, ${req.userId}!`, userId: req.userId });
};