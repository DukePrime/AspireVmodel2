// D:\AspireVmodel2\backend\src\server.js
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const cors = require('cors'); 
const db = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const requirementRoutes = require('./routes/requirementRoutes');

const app = express();

const frontendUrl = 'https://aspirevmodel2-frontend.onrender.com'; 

app.use(cors({ 
  origin: frontendUrl, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/requirements', requirementRoutes);

app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});