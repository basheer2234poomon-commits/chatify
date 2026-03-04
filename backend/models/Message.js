import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  conversationId: {
    type: String,
    required: true,
  },
  mediaUrls: [{
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    size: Number,
    name: String,
  }],
  mediaCount: {
    type: Number,
    default: 0,
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },
});
messageSchema.index({ conversationId: 1, timestamp: 1 });

// TTL Index: Automatically delete messages after 24 hours
messageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
