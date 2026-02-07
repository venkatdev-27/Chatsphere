const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists or using a new one if not
const { sendMessage, allMessages, markMessagesAsRead, deleteMessageForMe, deleteMessageForEveryone, clearChat } = require('../controllers/messageController');

const router = express.Router();

const upload = require('../middleware/uploadMiddleware');

router.route('/').post(protect, upload.single('file'), sendMessage);
router.route('/:chatId').get(protect, allMessages);
router.route('/read/:chatId').put(protect, markMessagesAsRead);
router.route('/deleteForMe').put(protect, deleteMessageForMe);
router.route('/deleteForEveryone').put(protect, deleteMessageForEveryone);
router.route('/clearChat').put(protect, clearChat);

module.exports = router;
