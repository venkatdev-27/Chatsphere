const Chat = require('../models/Chat');
const User = require('../models/userModel');
const { client } = require('../config/redis');

// @desc    Access or Create a One-to-One Chat 💬
// @route   POST /api/chat
// @access  Protected
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log('UserId param not sent with request ❌');
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage')
    .lean(); // Optimization: Return plain object

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'username pic email',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      
      const FullChat = await Chat.findOne({ _id: createdChat._id })
        .populate('users', '-password')
        .lean(); // Optimization: Return plain object

      await client.del(`chats:${req.user._id}`);
      await client.del(`chats:${userId}`);

      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

// @desc    Fetch all chats for a user 📜
// @route   GET /api/chat
// @access  Protected
const fetchChats = async (req, res) => {
  try {
    const cacheKey = `chats:${req.user._id}`;

    const cachedChats = await client.get(cacheKey);
    if (cachedChats) {
      return res.status(200).send(JSON.parse(cachedChats));
    }

    const Message = require('../models/Message');

    Chat.find({
      $or: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { removedUsers: { $elemMatch: { $eq: req.user._id } } }
      ]
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('removedUsers', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .lean() // Optimization: Return plain object
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'username pic email',
        });

        for (let chat of results) {
            const unreadCount = await Message.countDocuments({
              chat: chat._id,
              readBy: { $ne: req.user._id },
              sender: { $ne: req.user._id } // Don't count own messages
            });
            chat.unreadCount = unreadCount;
          }

        await client.setEx(cacheKey, 30, JSON.stringify(results));
        
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Create New Group Chat 👥
// @route   POST /api/chat/group
// @access  Protected
const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please Fill all the fields' });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send('More than 2 users are required to form a group chat');
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
      groupProfilePic: req.body.pic || undefined
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('removedUsers', '-password');

    users.forEach(async (u) => {
        await client.del(`chats:${u._id}`);
    });

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Rename Group ✏️
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const chatToCheck = await Chat.findById(chatId);
    if (!chatToCheck) {
      res.status(404);
      throw new Error('Chat Not Found');
    }

    
    const isMember = chatToCheck.users.some(u => u.toString() === req.user._id.toString());
    if (!isMember) {
        res.status(403);
        throw new Error('Action Forbidden: You are no longer a participant of this group');
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('removedUsers', '-password');

    if (!updatedChat) {
      res.status(404);
      throw new Error('Chat Not Found');
    }

    updatedChat.users.forEach(async (u) => {
        await client.del(`chats:${u._id}`);
    });
    if (updatedChat.removedUsers) {
        updatedChat.removedUsers.forEach(async (u) => {
             await client.del(`chats:${u}`);
        });
    }

    res.json(updatedChat);

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Add user to Group ➕
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
        res.status(404);
        throw new Error('Chat Not Found');
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Only Admin can add users!');
    }

    const isAdminInGroup = chat.users.some(u => u.toString() === req.user._id.toString());
    if (!isAdminInGroup) {
        res.status(403);
        throw new Error('Admin is no longer in this group, cannot add users');
    }

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { 
        $addToSet: { users: userId },
        $pull: { removedUsers: userId } // Remove from removedUsers if re-adding
      }, 
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('removedUsers', '-password');

    added.users.forEach(async (u) => {
        await client.del(`chats:${u._id}`);
    });
    res.json(added);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Remove user from Group ➖
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
        res.status(404);
        throw new Error('Chat Not Found');
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString() && userId !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not Authorized to remove users!');
    }

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { 
        $pull: { users: userId },
        $addToSet: { removedUsers: userId } // Add to removedUsers to keep visibility
      },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('removedUsers', '-password');

    removed.users.forEach(async (u) => {
        await client.del(`chats:${u._id}`);
    });
    await client.del(`chats:${userId}`);
    res.json(removed);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Delete a chat for the current user
// @route   DELETE /api/chat/:chatId
// @access  Protected
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const userIdStr = req.user._id.toString();

    const isActiveParticipant = chat.users.some(id => id.toString() === userIdStr);
    const isRemovedParticipant = chat.removedUsers && chat.removedUsers.some(id => id.toString() === userIdStr);

    if (!isActiveParticipant && !isRemovedParticipant) {
      return res.status(403).json({ message: 'Not authorized to delete this chat' });
    }

    if (chat.isGroupChat) {
      if (isActiveParticipant) {
          chat.users = chat.users.filter(id => id.toString() !== userIdStr);
      }
      
      if (isRemovedParticipant) {
          chat.removedUsers = chat.removedUsers.filter(id => id.toString() !== userIdStr);
      }
      
      if (chat.users.length === 0) {
        await Chat.findByIdAndDelete(chatId);
      } else {
        await chat.save();
      }
    } else {
      await Chat.findByIdAndDelete(chatId);
    }

    await client.del(`chats:${req.user._id}`);

    res.json({ success: true, chatId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteChat
};
