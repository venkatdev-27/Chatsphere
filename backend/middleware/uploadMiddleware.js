const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    // fileFilter is handled by allowed_formats in cloudinary config, 
    // but we can keep a basic check if needed, though cloudinary storage handles it well.
});

module.exports = upload;
