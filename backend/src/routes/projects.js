const express = require('express');
const router = express.Router();
const { createProject, listProjects } = require('../controllers/projectsController');
const { auth } = require('../middleware/auth');

router.post('/', auth(), createProject);
router.get('/', auth(), listProjects);

module.exports = router;