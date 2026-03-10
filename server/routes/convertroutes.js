const express = require("express");
const router = express.Router();
const multer = require("multer");

const { wordToPdf } = require("../controllers/convert");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/word-to-pdf", upload.single("file"), wordToPdf);

module.exports = router;