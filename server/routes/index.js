const express = require("express");
const router = express.Router();
const { signup, login, watch, setProfilePic, uploadProfilePic } = require("../controllers/index.js");

router.post("/signup", signup)
.post("/login", login)
.post("/watch", watch)
.post('/profile',  uploadProfilePic, setProfilePic)

module.exports = router;