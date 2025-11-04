// D:\AspireVmodel2\backend\src\models\userModel.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

module.exports = {
  // Cria usuário e retorna apenas dados públicos
  async create({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error('username, email e password são obrigatórios');
    }

    // Usando bcryptjs (API síncrona para evitar callbacks)
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const passwordHash = bcrypt.hashSync(password, salt);

    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
    `;
    const values = [username, email, passwordHash];

    const { rows } = await pool.query(query, values);
    return rows[0]; // { id, username, email }
  },

  // Busca por email e inclui o hash (com alias "password" p/ compatibilidade)
  async findByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        username,
        email,
        password_hash,
        password_hash AS password
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