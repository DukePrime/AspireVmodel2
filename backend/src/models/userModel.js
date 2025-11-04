// D:\AspireVmodel2\backend\src\models\userModel.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

module.exports = {
  // Cria usuário e retorna somente dados públicos
  async create({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error('username, email e password são obrigatórios');
    }

    // Hash da senha antes de salvar
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Importante: inserir na coluna password_hash (não "password")
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
    `;
    const values = [username, email, passwordHash];

    const { rows } = await pool.query(query, values);
    return rows[0]; // { id, username, email }
  },

  // Busca por email, retornando também o hash da senha
  async findByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        username,
        email,
        password_hash,
        password_hash AS password -- campo alternativo para compatibilidade com controllers diferentes
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1 LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async findAll() {
    const { rows } = await pool.query(
      'SELECT id, username, email FROM users ORDER BY username ASC'
    );
    return rows;
  }
};