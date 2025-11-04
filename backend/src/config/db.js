// D:\AspireVmodel2\backend\src\config\db.js
const { Pool } = require('pg');
const dotenv = require('dotenv'); 

dotenv.config(); 

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { 
        rejectUnauthorized: false
    }
});


pool.connect((err, client, done) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
    } else {
        console.log('Conectado ao PostgreSQL!');
        
        done(); 
    }
});

pool.on('error', (err) => {
    console.error('Erro geral do pool de conexão com o banco de dados:', err);
});

module.exports = pool;
