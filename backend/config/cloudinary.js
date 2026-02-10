const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "raw";
    let folder = "chatsphere/documents";

    if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
      folder = "chatsphere/images";
    } else if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
      folder = "chatsphere/videos";
    }

    return {
      folder,
      resource_type: resourceType,
      public_id: `${Date.now()}-${path.parse(file.originalname).name}`,
      tags: ["chatsphere", resourceType],
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
