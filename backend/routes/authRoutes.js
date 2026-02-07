const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateProfilePic, allUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

// Rate limits: Login (5 req/10 mins), Signup (3 req/10 mins)
router.post('/signup', rateLimit(3, 10 * 60), signup);
router.post('/login', rateLimit(5, 10 * 60), login);
router.get('/me', protect, getMe);
router.post('/profile-pic', protect, upload.single('pic'), updateProfilePic);
router.get('/', protect, allUsers);

module.exports = router;
