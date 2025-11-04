// D:\AspireVmodel2\backend\src\server.js
const express = require('express');
const dotenv = require('dotenv');

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const cors = require('cors');
const db = require('./config/db'); // Certifique-se de que este módulo realmente conecta ao DB
// Se seu db.js tem uma função de conexão que precisa ser chamada, faça aqui:
// db.connect(); // Exemplo: se db.js exporta uma função 'connect'

const userRoutes = require('./routes/userRoutes');
const requirementRoutes = require('./routes/requirementRoutes');

const app = express();

// Configuração de CORS
// Defina os domínios permitidos.
// Para desenvolvimento local, inclua 'http://localhost:5173' (ou a porta do seu frontend local)
// Para produção, inclua o domínio do seu frontend deployado.
const allowedOrigins = [
  'https://aspirevmodel2-frontend.onrender.com', // Seu frontend em produção
  'http://localhost:5173', // Para desenvolvimento local
  // Adicione outros domínios de frontend se houver, como staging, etc.
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (como de Postman, curl, ou apps mobile)
    // E permite origens da nossa lista de 'allowedOrigins'
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Incluindo PATCH para cobrir mais casos
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept'], // IMPORTANTE: 'x-auth-token' foi adicionado aqui!
  credentials: true, // Permite o envio de cookies e headers de autorização
}));

app.use(express.json()); // Middleware para parsear JSON no corpo das requisições

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/requirements', requirementRoutes);

// Rota de teste simples para verificar se a API está online
app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

// Porta do servidor
const PORT = process.env.PORT || 3001; // Use a porta do ambiente ou 3001 como fallback

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});