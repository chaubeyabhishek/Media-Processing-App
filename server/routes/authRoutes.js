const express = require("express");
const router = express.Router();

const { signup, login, logout , googleAuth} = require("../controllers/authController");
const { auth } = require("../middlewares/auth");


const {getMe} = require("../controllers/mediaController")
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, getMe);
router.post("/google", googleAuth);

module.exports = router;
