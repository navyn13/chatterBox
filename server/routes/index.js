const express = require("express");
const router = express.Router();
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const roomRoutes = require('./roomRoutes');

// API routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/rooms', roomRoutes);

module.exports = router;