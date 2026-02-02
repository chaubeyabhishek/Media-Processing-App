const express = require("express");
const router = express.Router();
const { uploadImage , getMyMedia , deleteMedia , getMe , checkDailyLimit} = require("../controllers/mediaController");
const {auth} = require("../middlewares/auth")
router.post("/upload", auth,  checkDailyLimit , uploadImage );
router.get("/my" , auth , getMyMedia)
router.delete("/:id", auth, deleteMedia);

module.exports = router;
