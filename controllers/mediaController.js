const Media = require("../models/Media");
const {
  isFileSupported,
  uploadToCloudinary,
} = require("../services/cloudinaryService");

exports.uploadImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const file = req.files.image;

    let { quality } = req.body;
    quality = quality ? Number(quality) : "auto";

    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".").pop().toLowerCase();

    if (!isFileSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    const MAX_SIZE = 6 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        message: "File must be less than 6MB",
      });
    }

    const response = await uploadToCloudinary(
      file,
      "Abhishek",
      quality
    );

    const media = await Media.create({
      user: userId,
      imageUrl: response.secure_url,
      publicId: response.public_id,
      format: fileType,
      size: file.size,
    });

    // 🔥 EXACT PLACE (ADD HERE)
    req.userDoc.dailyUploadCount += 1;
    req.userDoc.lastUploadDate = new Date();
    await req.userDoc.save();

    // response to frontend
    return res.status(201).json({
      success: true,
      message: "Image compressed & uploaded",
      media,
    });

  } catch (error) {
    console.error("UPLOAD ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};


exports.getMyMedia = async (req, res) => {
  try {
    const userId = req.user.id;

    // pagination (optional but pro)
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const media = await Media.find({ user: userId })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    const total = await Media.countDocuments({ user: userId });

    return res.status(200).json({
      success: true,
      page,
      total,
      results: media.length,
      media,
    });
  } catch (error) {
    console.error("HISTORY ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch media history",
    });
  }
};



const cloudinary = require("cloudinary").v2;


exports.deleteMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const mediaId = req.params.id;

    const media = await Media.findById(mediaId);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    //  ownership check
    if (media.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this media",
      });
    }

    //  delete from Cloudinary (safe check)
    if (media.publicId) {
      await cloudinary.uploader.destroy(media.publicId);
    }

    //  delete from DB
    await Media.findByIdAndDelete(mediaId);

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete media",
    });
  }
};



// controller
const User = require("../models/User");

exports.getMe = async (req, res) => {
  try {
    // 🔥 SAFETY CHECK
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      name: user.name,
      email: user.email,
      subscription: user.subscription || "FREE",
      dailyUploadCount: user.dailyUploadCount || 0,
      dailyLimit: user.subscription === "FREE" ? 10 : "Unlimited",
    });
  } catch (error) {
    console.error("GET ME ERROR 👉", error); // 👈 VERY IMPORTANT
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};



exports.checkDailyLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const today = new Date().toDateString();
    const lastDate = user.lastUploadDate
      ? user.lastUploadDate.toDateString()
      : null;

    // 🔄 New day → reset count
    if (today !== lastDate) {
      user.dailyUploadCount = 0;
      user.lastUploadDate = new Date();
    }

    // 🚫 FREE plan limit = 10 images/day
    if (user.subscription === "FREE" && user.dailyUploadCount >= 10) {
      return res.status(403).json({
        success: false,
        message: "Daily upload limit reached (10 images)",
      });
    }

    // pass user doc to controller
    req.userDoc = user;
    next();
  } catch (error) {
    console.error("CHECK DAILY LIMIT ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Daily upload limit check failed",
    });
  }
};
