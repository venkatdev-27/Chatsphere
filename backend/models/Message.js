const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    file: { type: String, default: "" },
    fileType: { type: String, default: "" }, // "image", "video", or "document"
    type: { type: String, default: "text", enum: ["text", "image", "video", "document", "system"] }, // Message type
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // For "Delete for me"
    isDeletedForEveryone: { type: Boolean, default: false }, // For "Delete for everyone"
  },
  { timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
