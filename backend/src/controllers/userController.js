// D:\AspireVmodel2\backend\src\controllers\userController.js
'use strict';

const UserModule = require('../models/userModel');
const User = UserModule && UserModule.default ? UserModule.default : UserModule;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Utilidades
 */
function normalizeUser(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const id =
    raw.id ?? raw.user_id ?? raw.userid ?? raw.ID ?? raw.UserId ?? null;

  const username =
    raw.username ?? raw.user_name ?? raw.name ?? raw.login ?? null;

  const email =
    raw.email ?? raw.mail ?? raw.user_email ?? null;

  return { id, username, email };
}

function pickPasswordHashField(user) {
  // Tenta diferentes convenções de nomes
  return (
    user?.password_hash ??
    user?.passwordHash ??
    user?.hash ??
    user?.password // cuidado: se for plain-text isso é um problema no model
  );
}

function extractRows(result) {
  // Compatível com pg (result.rows), Sequelize (instância/objeto), ou já-objeto
  if (!result) return null;
  if (Array.isArray(result)) return result;
  if (result.rows && Array.isArray(result.rows)) return result.rows;
  return result;
}

function getCreateFunction() {
  // Mapeia possíveis nomes de função no model
  const fn =
    User?.create ||
    User?.createUser ||
    User?.insert ||
    User?.register;

  return fn || null;
}

async function callCreateUser(username, email, password) {
  const fn = getCreateFunction();
  if (!fn) {
    throw new Error(
      "O model de usuário não expõe um método de criação (create/createUser/insert/register)."
    );
  }

  // Heurística: se a função declara >= 3 parâmetros, chama posicional.
  // Caso contrário, chama com objeto (compatível com Sequelize).
  if (fn.length >= 3) {
    // Ex.: create(username, email, password)
    return await fn(username, email, password);
  }

  // Ex.: create({ username, email, password })
  return await fn({ username, email, password });
}

async function callFindByEmail(email) {
  if (typeof User?.findByEmail === 'function') {
    return await User.findByEmail(email);
  }
  // Fallback para Sequelize: findOne({ where: { email } })
  if (typeof User?.findOne === 'function') {
    return await User.findOne({ where: { email } });
  }
  throw new Error("O model não possui findByEmail nem findOne.");
}

async function callFindById(id) {
  if (typeof User?.findById === 'function') {
    return await User.findById(id);
  }
  if (typeof User?.findByPk === 'function') {
    return await User.findByPk(id);
  }
  if (typeof User?.findOne === 'function') {
    // Alguns ORMs permitem findOne({ where: { id } })
    return await User.findOne({ where: { id } });
  }
  throw new Error("O model não possui findById, findByPk ou findOne.");
}

async function callFindAll() {
  if (typeof User?.findAll === 'function') {
    return await User.findAll();
  }
  if (typeof User?.all === 'function') {
    return await User.all();
  }
  if (typeof User?.list === 'function') {
    return await User.list();
  }
  throw new Error("O model não possui findAll, all ou list.");
}

function ensureJwtSecret() {
  if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).trim() === '') {
    throw new Error(
      "JWT_SECRET não definido nas variáveis de ambiente. Configure no Render."
    );
  }
}

/**
 * Controller: Register User
 */
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body || {};
  try {
    // Validações básicas
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email e password são obrigatórios.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    ensureJwtSecret();

    // Cria usuário via adaptador
    const created = await callCreateUser(username, email, password);

    // Compatível com pg (rows[0]) e com ORM (objeto)
    const createdRow = Array.isArray(created?.rows) ? created.rows[0] : created;
    const safeUser = normalizeUser(createdRow);

    if (!safeUser?.id) {
      // Tenta recuperar via busca por e-mail se o create não retornou o objeto
      try {
        const fetched = await callFindByEmail(email);
        const fetchedRow = extractRows(fetched);
        const fetchedUser = Array.isArray(fetchedRow) ? fetchedRow[0] : fetchedRow;
        const safeFetched = normalizeUser(fetchedUser);
        if (safeFetched?.id) {
          const token = jwt.sign({ id: safeFetched.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return res.status(201).json({
            message: 'Usuário registrado com sucesso',
            user: safeFetched,
            token
          });
        }
      } catch (_) {
        // ignore, vamos tratar abaixo
      }
      throw new Error('Não foi possível obter os dados do usuário criado.');
    }

    const token = jwt.sign({ id: safeUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: safeUser,
      token
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);

    // Duplicidade (PostgreSQL)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    if (error.message && error.message.includes('JWT_SECRET')) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

/**
 * Controller: Login User
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body || {};
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'email e password são obrigatórios.' });
    }

    ensureJwtSecret();

    const userResult = await callFindByEmail(email);
    const rawUser = Array.isArray(userResult?.rows)
      ? userResult.rows[0]
      : (Array.isArray(userResult) ? userResult[0] : userResult);

    if (!rawUser) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const passwordHash = pickPasswordHashField(rawUser);
    if (!passwordHash) {
      return res.status(500).json({
        message: 'Configuração inválida do model: não há campo de hash de senha no retorno do usuário.'
      });
    }

    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const user = normalizeUser(rawUser);
    if (!user?.id) {
      return res.status(500).json({ message: 'Usuário sem ID no retorno do model.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      message: 'Login bem-sucedido',
      user,
      token
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

/**
 * Controller: Get User Profile
 * Requer que req.userId seja definido por um middleware de autenticação (ex.: ao validar o JWT)
 */
exports.getUserProfile = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Não autenticado.' });
    }

    const result = await callFindById(req.userId);
    const rawUser = Array.isArray(result?.rows)
      ? result.rows[0]
      : (Array.isArray(result) ? result[0] : result);

    if (!rawUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const user = normalizeUser(rawUser);
    return res.json(user);
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return res.status(500).json({ message: 'Erro ao buscar perfil do usuário', error: error.message });
  }
};

/**
 * Controller: Listar todos os usuários (para atribuição de requisitos)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const result = await callFindAll();
    const rows = extractRows(result);

    const usersArray = Array.isArray(rows) ? rows : [rows];
    const users = usersArray
      .map(normalizeUser)
      .filter(u => u && u.id != null && u.username);

    return res.json(users.map(u => ({ id: u.id, username: u.username })));
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao listar usuários.' });
  }
};