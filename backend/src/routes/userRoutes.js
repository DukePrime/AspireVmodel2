// D:\AspireVmodel2\backend\src\routes\userRoutes.js
const express = require('express');
const router = express.Router();


const userController = require('../controllers/userController'); 

const authMiddleware = require('../middleware/authMiddleware');  


router.post('/register', userController.registerUser);

// Rota de Login

router.post('/login', userController.loginUser);


router.get('/profile', authMiddleware, userController.getUserProfile); 


router.get('/me', authMiddleware, userController.getUserProfile); 


router.get('/', authMiddleware, userController.getAllUsers);

module.exports = router;