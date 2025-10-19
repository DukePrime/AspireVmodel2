const jwt = require('jsonwebtoken');

function auth(required = true) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      if (!required) return next();
      return res.status(401).json({ error: 'Token ausente' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
}

module.exports = { auth };