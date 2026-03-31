
const app = require("./app");
const connectDB = require("./config/database");

require("dotenv").config();

const PORT = process.env.PORT || 4000;

const connect = require("./config/database")
connect.connectDB();

const cloudinaryConnect = require("./config/cloudinary");
cloudinaryConnect();


app.listen(PORT, () => {
  console.log(`MediaForge server running on port ${PORT}`);
});
