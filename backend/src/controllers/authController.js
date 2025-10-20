// D:\AspireVmodel2\backend\src\controllers\authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!JWT_SECRET) {
    console.error('ERRO: JWT_SECRET não está definido nas variáveis de ambiente!');
    process.exit(1);
}

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

// @desc    Registrar um novo usuário
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
    const { name, email, password } = req.body; // 'name' é o valor vindo do frontend

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Usuário com este e-mail já existe.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- CORREÇÃO AQUI: Inserir em 'username' e retornar 'username' ---
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email', // ALTERADO: name -> username
            [name, email, hashedPassword] // '$1' receberá o valor da variável 'name'
        );

        const user = newUser.rows[0];

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: {
                id: user.id,
                name: user.username, // ALTERADO: user.name -> user.username (para o frontend)
                email: user.email,
            },
            token: generateToken(user.id),
        });

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao registrar usuário.' });
    }
};

// @desc    Autenticar usuário e obter token
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const foundUser = user.rows[0];

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: {
                id: foundUser.id,
                name: foundUser.username, // ALTERADO: foundUser.name -> foundUser.username (para o frontend)
                email: foundUser.email,
            },
            token: generateToken(foundUser.id),
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao fazer login.' });
    }
};

// @desc    Obter dados do usuário logado (perfil)
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        // --- CORREÇÃO AQUI: Selecionar 'username' ---
        const user = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.id]); // ALTERADO: name -> username
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json({ user: user.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar dados do usuário.' });
    }
};

// @desc    Rota protegida de exemplo
// @route   GET /api/users/protected
// @access  Private
exports.protected = (req, res) => {
    res.status(200).json({
        message: `Você acessou uma rota protegida, ${req.user.username || req.user.email || 'usuário'}!`, // ALTERADO: req.user.name -> req.user.username
        user: req.user
    });
};