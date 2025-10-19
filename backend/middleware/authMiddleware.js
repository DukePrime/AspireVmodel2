// AspireVmodel2/backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.protect = (req, res, next) => {
    // 1. Obter o token do cabeçalho da requisição
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
    }

    try {
        // 2. Verificar o token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Anexar o ID do usuário à requisição
        req.userId = decoded.id; // Agora todas as rotas protegidas terão acesso a req.userId
        next(); // Próximo middleware ou controlador
    } catch (error) {
        console.error('Erro na verificação do token:', error);
        res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};