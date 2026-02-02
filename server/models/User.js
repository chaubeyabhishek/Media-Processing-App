const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    
    subscription: {
      type: String,
      enum: ["FREE", "PRO"],
      default: "FREE",
    },

    dailyUploadCount: {
      type: Number,
      default: 0,
    },

    lastUploadDate: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("User", userSchema);
