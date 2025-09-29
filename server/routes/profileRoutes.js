const express = require('express');
const { uploadProfilePic, setProfilePic } = require('../controllers/auth/profileController');
const router = express.Router();

// Profile routes
router.post('/', uploadProfilePic, setProfilePic);  // Changed from /upload to / to match frontend

module.exports = router;
