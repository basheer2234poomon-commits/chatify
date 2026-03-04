import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    const messages = await Message.find({ conversationId })
      .populate('sender', '-password')
      .populate('recipient', '-password')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const userId = req.userId;

    const messages = await Message.updateMany(
      {
        conversationId,
        recipient: userId,
        status: { $ne: 'seen' },
      },
      { status: 'seen' }
    );

    res.json({ message: 'Messages marked as read', updatedCount: messages.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, mediaUrls, conversationId } = req.body;
    const userId = req.userId;

    const message = new Message({
      sender: userId,
      recipient: recipientId,
      content: content || '',
      mediaUrls: mediaUrls || [],
      mediaCount: mediaUrls ? mediaUrls.length : 0,
      conversationId,
      status: 'sent',
      timestamp: new Date(),
    });

    await message.save();

    const populatedMessage = await message.populate([
      { path: 'sender', select: '-password' },
      { path: 'recipient', select: '-password' }
    ]);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const mediaUrls = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      name: file.originalname,
    }));

    res.json({ mediaUrls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

