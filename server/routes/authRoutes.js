const express = require('express');
const { signup, login, verifyToken } = require('../controllers/auth/authController');
const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/verify', verifyToken);

module.exports = router;
