// D:\AspireVmodel2\backend\src\middleware\authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // console.warn('authMiddleware: Token não fornecido.'); // Adicionei log para depuração
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1]; // Espera "Bearer TOKEN"

    if (!token) {
        // console.warn('authMiddleware: Formato de token inválido - Token ausente após "Bearer".'); // Adicionei log
        return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('authMiddleware: Token decodificado. Payload:', decoded); // Adicionei log para ver o payload
        req.userId = decoded.id; // <--- CORREÇÃO AQUI: DECODED.ID
        // console.log('authMiddleware: req.userId definido como:', req.userId); // Adicionei log
        next();
    } catch (error) {
        console.error('authMiddleware: Erro na verificação do token:', error.message); // Melhorou a mensagem de erro
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};