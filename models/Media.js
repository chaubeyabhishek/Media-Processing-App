const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {              
      type: String,
      required: true,
    },
    format: String,
    size: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
