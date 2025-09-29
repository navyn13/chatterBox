const express = require('express');
const { createRoom, getRooms, watch } = require('../controllers/rooms/roomController');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Protect all room routes with authentication
router.use(verifyToken);

// Room routes
router.post('/', createRoom);
router.get('/', getRooms);
router.get('/watch', watch);

module.exports = router;
