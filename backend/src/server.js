// AspireVmodel2/backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware'); // Importa o middleware
// const db = require('./config/db'); // Apenas para testar a conexão no início, pode remover depois

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas de Autenticação
app.use('/api/auth', authRoutes);

// Exemplo de rota protegida
app.get('/api/protected', protect, (req, res) => {
    res.json({ message: `Bem-vindo, usuário ${req.userId}! Esta é uma rota protegida.` });
});

app.get('/', (req, res) => {
    res.send('Servidor AspireVmodel2 rodando! 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});