const express = require("express");
const cors = require("cors");
const os = require("os");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const convertRoutes = require("./routes/convertroutes");

const app = express();

app.use(express.json());
app.use("/converted", express.static(path.join(__dirname, "converted")));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// express-fileupload
const fileUpload = require("express-fileupload");

app.get("/", (req, res) => {
  res.json({ success: true, message: "MediaForge API live" });
});

app.use("/api/v1/auth", authRoutes);

// yaha express-fileupload sirf media routes ke liye
app.use(
  "/api/v1/media",
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  }),
  mediaRoutes
);
// convert routes (yaha Multer chalega)
app.use("/api/v1/convert", convertRoutes);

module.exports = app;