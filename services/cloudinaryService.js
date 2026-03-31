const cloudinary = require("cloudinary").v2;


function isFileSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadToCloudinary(file, folder, quality) {
  const options = { folder };

  console.log("Temp file path ", file.tempFilePath);

  options.resource_type = "auto";
  options.quality = quality || "auto";   
  options.fetch_format = "auto";           

  return await cloudinary.uploader.upload(
    file.tempFilePath,
    options
  );
}

module.exports = {
  isFileSupported,
  uploadToCloudinary,
};
