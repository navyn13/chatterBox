const express = require("express");
const router = express.Router();
const { signup, login, watch, setProfilePic, uploadProfilePic, createRoom, getRooms } = require("../controllers/index.js");

router.post("/signup", signup)
.post("/login", login)
.post("/watch", watch)
.post('/profile',  uploadProfilePic, setProfilePic)
.post('/api/rooms', createRoom)
.get('/api/rooms', getRooms)
module.exports = router;