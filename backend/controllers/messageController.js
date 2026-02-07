const Message = require('../models/Message');
const User = require('../models/userModel');
const Chat = require('../models/Chat');
const { client } = require('../config/redis');
const { getIO } = require('../services/socketService');

// @desc    Send New Message 📨
// @route   POST /api/message
// @access  Protected
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if ((!content && !req.file) || !chatId) {
    console.log('Invalid data passed into request ❌');
    return res.sendStatus(400);
  }

  const chatCheck = await Chat.findById(chatId);
  if (chatCheck && chatCheck.isGroupChat) {
      const isAdminPresent = chatCheck.users.some(u => u.toString() === chatCheck.groupAdmin.toString());
      if (!isAdminPresent) {
          return res.status(403).send('Group is closed because Admin left');
      }
  }

  var newMessage = {
    sender: req.user._id,
    content: content || "",
    chat: chatId,
  };

  if (req.file) {
    const filePath = req.file.path.replace(/\\/g, "/");
    newMessage.file = filePath;
    
    const mime = req.file.mimetype;
    if (mime.startsWith('image/')) {
        newMessage.fileType = 'image';
    } else if (mime.startsWith('video/')) {
        newMessage.fileType = 'video';
    }
  }

  try {
    var message = await Message.create(newMessage);

    message = await message.populate('sender', 'username pic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'username pic email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    await client.del(`messages:${chatId}:latest`);
    
    const chat = await Chat.findById(chatId);
    if (chat && chat.users) {
        chat.users.forEach(async (userId) => {
             await client.del(`chats:${userId}`);
        });
    }

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get All Messages from a Chat 📜
// @route   GET /api/message/:chatId?limit=20&before=timestamp
// @access  Protected
const allMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const before = req.query.before;

    const isFirstPage = !before;
    const cacheKey = `messages:${chatId}:latest`;

    if (isFirstPage) {
      const cachedMessages = await client.get(cacheKey);
      if (cachedMessages) {
         return res.json(JSON.parse(cachedMessages));
      }
    }

    const query = { 
      chat: chatId,
      deletedBy: { $ne: req.user._id } // Exclude messages deleted by current user
    };
    if (before) {
        query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', 'username pic email')
      .populate('chat')
      .lean();
    
    const reversedMessages = messages.reverse();

    if (isFirstPage) {
       await client.setEx(cacheKey, 60 * 5, JSON.stringify(reversedMessages)); // 5 min TTL
    }

    res.json(reversedMessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Mark Messages as Read ✅
// @route   PUT /api/message/read/:chatId
// @access  Protected
const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Message.updateMany(
      {
        chat: chatId,
        readBy: { $ne: req.user._id },
        sender: { $ne: req.user._id } // Don't mark own messages
      },
      {
        $addToSet: { readBy: req.user._id } // Add user to readBy array
      }
    );

    await client.del(`messages:${chatId}:latest`);
    await client.del(`chats:${req.user._id}`);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Delete Message For Me 🗑️
// @route   PUT /api/message/deleteForMe
// @access  Protected
const deleteMessageForMe = async (req, res) => {
  try {
    const { messageId } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { deletedBy: req.user._id } },
      { new: true }
    );

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    await client.del(`messages:${message.chat}:latest`);

    res.json({ success: true, messageId });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Delete Message For Everyone 🗑️
// @route   PUT /api/message/deleteForEveryone
// @access  Protected
const deleteMessageForEveryone = async (req, res) => {
  try {
    const { messageId } = req.body;

    const message = await Message.findById(messageId).populate('chat');

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    const chat = await Chat.findById(message.chat);
    const isSender = message.sender.toString() === req.user._id.toString();
    const isGroupAdmin = chat.isGroupChat && chat.groupAdmin.toString() === req.user._id.toString();

    if (!isSender && !isGroupAdmin) {
      res.status(403);
      throw new Error('Only sender or group admin can delete for everyone');
    }

    message.isDeletedForEveryone = true;
    message.content = '';
    message.file = '';
    message.fileType = '';
    await message.save();

    await client.del(`messages:${message.chat._id}:latest`);
    
    if (chat && chat.users) {
      chat.users.forEach(async (userId) => {
        await client.del(`chats:${userId}`);
      });
    }

    const io = getIO();
    // Emit to all users in the chat room
    if (chat && chat.users) {
        chat.users.forEach(user => {
            io.to(user._id.toString()).emit('message_deleted', {
                messageId,
                chatId: message.chat._id,
                isDeletedForEveryone: true
            });
        });
    }

    res.json({ success: true, messageId, message });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Clear Chat For Me 🗑️
// @route   PUT /api/message/clearChat
// @access  Protected
const clearChat = async (req, res) => {
  try {
    const { chatId } = req.body;

    await Message.updateMany(
      { 
        chat: chatId,
        deletedBy: { $ne: req.user._id }
      },
      { $addToSet: { deletedBy: req.user._id } }
    );

    await client.del(`messages:${chatId}:latest`);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};



module.exports = { sendMessage, allMessages, markMessagesAsRead, deleteMessageForMe, deleteMessageForEveryone, clearChat };
