// D:\AspireVmodel2\backend\src\routes\requirementRoutes.js


const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirementController');
const authMiddleware = require('../middleware/authMiddleware');



// Rotas de Requisitos
router.post('/requirements', authMiddleware, requirementController.createRequirement);
router.get('/requirements', authMiddleware, requirementController.getRequirements);


module.exports = router;