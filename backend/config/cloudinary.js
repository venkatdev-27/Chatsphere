const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let resourceType = 'auto'; // Default to auto
    let allowedFormats = ['jpg', 'png', 'jpeg', 'mp4', 'webm', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];

    // Determine resource type and allowed formats based on mimetype
    if (file.mimetype.startsWith('image/')) {
        resourceType = 'image';
        allowedFormats = ['jpg', 'png', 'jpeg', 'gif', 'webp'];
    } else if (file.mimetype.startsWith('video/')) {
        resourceType = 'video';
        allowedFormats = ['mp4', 'webm', 'mkv', 'avi'];
    } else {
        resourceType = 'raw'; // Use 'raw' for documents
        // For raw files, allowed_formats might be ignored by some versions or handled differently,
        // but explicit raw type helps avoid "unknown file format" for non-image/video files.
        allowedFormats = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
    }

    return {
      folder: 'chatsphere',
      resource_type: resourceType,
      allowed_formats: allowedFormats, // Use snake_case for the library check
      // public_id: file.originalname.split('.')[0] + '-' + Date.now(), // Optional: use original name
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
