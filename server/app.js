
const express = require("express");
const cors = require("cors");
const os = require("os");

const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");

const app = express();

app.use(express.json());
app.use(cors());

const fileUpload = require("express-fileupload");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);


app.get("/", (req, res) => {
  res.json({ success: true, message: "MediaForge API live" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/media", mediaRoutes);


module.exports = app;
