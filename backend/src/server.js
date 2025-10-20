// D:\AspireVmodel2\backend\src\server.js
const express = require('express');
const dotenv = require('dotenv');

// É CRÍTICO que dotenv.config() seja chamado O MAIS CEDO POSSÍVEL
// para garantir que process.env esteja populado antes de outros módulos que dependem dele.
dotenv.config(); // <--- AGORA ESTÁ NO TOPO!

const cors = require('cors'); // Para permitir requisições do frontend
const db = require('./config/db'); // Importa o pool de conexão do banco de dados

// Importar arquivos de rota
const userRoutes = require('./routes/userRoutes');
const requirementRoutes = require('./routes/requirementRoutes');

const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para todas as origens
app.use(express.json()); // Permite que o servidor entenda JSON

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/requirements', requirementRoutes);

// Rota principal (opcional, apenas para testar se o servidor está online)
app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});