// AspireVmodel2/backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const requirementRoutes = require('./routes/requirementRoutes');
const authMiddleware = require('./middleware/authMiddleware'); // <--- CORREÇÃO: Importa a função diretamente
const pool = require('./config/db'); // <--- Mantenha a importação do pool para a conexão


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas de Autenticação
app.use('/api/auth', authRoutes);
app.use('/api', requirementRoutes);

// Exemplo de rota protegida
app.get('/api/protected', authMiddleware, (req, res) => { // <--- CORREÇÃO: Usa 'authMiddleware' diretamente
    res.json({ message: `Bem-vindo, usuário ${req.userId}! Esta é uma rota protegida.` });
});

app.get('/', (req, res) => {
    res.send('Servidor AspireVmodel2 rodando! 🚀');
});

// Adicionando um console.log para testar a conexão com o banco de dados
pool.query('SELECT NOW()')
    .then(() => console.log('Conectado ao PostgreSQL!'))
    .catch(err => console.error('Erro ao conectar ao PostgreSQL:', err));


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});