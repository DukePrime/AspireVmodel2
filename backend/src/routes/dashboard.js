const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { metrics } = require('../controllers/dashboardController');

router.get('/metrics', auth(), metrics);

module.exports = router;