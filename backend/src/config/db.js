// D:\AspireVmodel2\backend\src\config\db.js
const { Pool } = require('pg');

// Adicione este console.log aqui para depuração


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Testar a conexão (opcional, mas recomendado para depuração)
pool.connect((err, client, done) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
    } else {
        console.log('Conectado ao PostgreSQL!');
        client.release(); // Libera o cliente
    }
});

module.exports = pool;