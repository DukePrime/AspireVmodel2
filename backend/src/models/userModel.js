// D:\AspireVmodel2\backend\src\models\userModel.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Você pode ajustar por env se quiser (padrão: 10)
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

// Observação: este model assume que a coluna no banco é "password".
// Se a sua coluna já for "password_hash", altere nos trechos marcados abaixo.

async function create(userOrUsername, emailArg, passwordArg) {
  // Compatibilidade com duas assinaturas:
  // - create({ username, email, password })
  // - create(username, email, password)
  let data;
  if (typeof userOrUsername === 'object' && userOrUsername !== null) {
    const { username, email, password } = userOrUsername;
    data = { username, email, password };
  } else {
    data = { username: userOrUsername, email: emailArg, password: passwordArg };
  }

  // Validações mínimas
  const missing = ['username', 'email', 'password'].filter((k) => !data?.[k]);
  if (missing.length) {
    const err = new Error('Parâmetros obrigatórios ausentes: ' + missing.join(', '));
    err.status = 400;
    throw err;
  }

  // Hash da senha
  const passwordHash = await bcrypt.hash(String(data.password), SALT_ROUNDS);

  // IMPORTANTE: Se sua tabela tem coluna "password_hash" (recomendado), troque o nome da coluna abaixo.
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email
  `;
  const values = [data.username, data.email, passwordHash];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0]; // { id, username, email }
  } catch (error) {
    // Deixe o controller lidar com códigos como 23505 (e-mail duplicado)
    throw error;
  }
}

async function findByEmail(email) {
  // Se sua coluna no banco já é "password_hash", altere "password AS password_hash" para apenas "password_hash".
  const query = `
    SELECT id, username, email, password AS password_hash
    FROM users
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, username, email FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

async function findAll() {
  const { rows } = await pool.query(
    'SELECT id, username, email FROM users ORDER BY username ASC'
  );
  return rows;
}

module.exports = {
  create,
  findByEmail,
  findById,
  findAll
};