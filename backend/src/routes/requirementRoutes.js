// D:\AspireVmodel2\backend\src\routes\requirementRoutes.js
const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirementController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas de Requisitos
// O prefixo '/api/requirements' já é aplicado em server.js via 'app.use'.
// Portanto, as rotas aqui dentro do router devem ser relativas a esse prefixo.
// Ex: POST /api/requirements/ será mapeado para router.post('/')
// Ex: GET /api/requirements/ será mapeado para router.get('/')
router.post('/', authMiddleware, requirementController.createRequirement);
router.get('/', authMiddleware, requirementController.getRequirements);

module.exports = router;