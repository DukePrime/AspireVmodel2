// D:\AspireVmodel2\backend\src\middleware\authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { // Aqui estamos exportando uma FUNÇÃO
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1]; // Espera "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Adiciona o ID do usuário à requisição
        next(); // Continua para o próximo middleware/rota
    } catch (error) {
        console.error('Erro na verificação do token:', error);
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};