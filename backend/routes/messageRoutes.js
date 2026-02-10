const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists or using a new one if not
const { sendMessage, allMessages, markMessagesAsRead, deleteMessageForMe, deleteMessageForEveryone, clearChat } = require('../controllers/messageController');

const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

// Rate limit: 30 messages per 1 minute per user
// Rate limit: 30 messages per 1 minute per user
router.post(
  '/',
  protect,
  rateLimit(30, 60),
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(400).json({
          message: "File upload failed",
          error: err.message,
        });
      }
      next();
    });
  },
  sendMessage
);

router.route('/:chatId').get(protect, allMessages);
router.route('/read/:chatId').put(protect, markMessagesAsRead);
router.route('/deleteForMe').put(protect, deleteMessageForMe);
router.route('/deleteForEveryone').put(protect, deleteMessageForEveryone);
router.route('/clearChat').put(protect, clearChat);

module.exports = router;
