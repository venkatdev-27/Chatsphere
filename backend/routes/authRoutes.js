const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateProfilePic, allUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/profile-pic', protect, upload.single('pic'), updateProfilePic);
router.get('/', protect, allUsers);

module.exports = router;
