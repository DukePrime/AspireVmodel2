// D:\AspireVmodel2\backend\src\routes\requirementRoutes.js
const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirementController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas de Requisitos
// O prefixo '/api/requirements' já é aplicado em server.js via 'app.use'.

// Rotas para criar e listar requisitos do USUÁRIO LOGADO (ambos exigem autenticação)
router.route('/')
    .post(authMiddleware, requirementController.createRequirement) // POST /api/requirements
    .get(authMiddleware, requirementController.getRequirements);   // GET /api/requirements (do usuário logado)

// Rota para o resumo do dashboard do USUÁRIO LOGADO (exige autenticação)
router.get('/dashboard-summary', authMiddleware, requirementController.getDashboardSummary); // GET /api/requirements/dashboard-summary

// NOVO: Rota para obter TODOS os requisitos (exige autenticação para acesso à funcionalidade)
// Recomendo que essa rota seja protegida, mesmo que não filtre por user ID, para que apenas usuários autenticados possam ver.
router.get('/all', authMiddleware, requirementController.getAllRequirements); 

// NOVO: Rota para obter o resumo do dashboard de TODOS os requisitos (exige autenticação)
router.get('/dashboard-summary-all', authMiddleware, requirementController.getDashboardSummaryAll); 

// Rotas para operações em um requisito específico por ID (GET, PUT, DELETE)
router.route('/:id')
    .get(authMiddleware, requirementController.getRequirementById)    // GET /api/requirements/:id
    .put(authMiddleware, requirementController.updateRequirement)    // PUT /api/requirements/:id
    .delete(authMiddleware, requirementController.deleteRequirement); // DELETE /api/requirements/:id

module.exports = router;