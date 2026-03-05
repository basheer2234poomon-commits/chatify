import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';

// Import models
import Message from './models/Message.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const cors = require("cors");
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'your-frontend-url' : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'your-frontend-url' : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Store io instance for use in routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO connection
const userSockets = {}; // Map userId to socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User comes online
  socket.on('user_online', (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} is online with socket ${socket.id}`);
    io.emit('user_status_change', { userId, isOnline: true });
  });

  // Send message - receive from sender and forward to recipient
  socket.on('send_message', async (data) => {
    try {
      const { sender, recipient, content, conversationId, mediaUrls, replyTo } = data;
      
      console.log(`Message from ${sender} to ${recipient}:`, content);
      
      // Create message object
      const messageData = {
        sender,
        recipient,
        content: content || '',
        conversationId,
        mediaUrls: mediaUrls || [],
        replyTo: replyTo || null,
        status: 'delivered',
        timestamp: new Date(),
      };

      // Save to database
      const savedMessage = await Message.create(messageData);
      
      // Populate sender, recipient, and replyTo info
      await savedMessage.populate('sender', 'name profilePicture username _id');
      await savedMessage.populate('recipient', 'name profilePicture username _id');
      await savedMessage.populate('replyTo');

      console.log('Message saved:', savedMessage._id);
      
      // Send to recipient if they're online
      const recipientSocketId = userSockets[recipient];
      console.log(`Looking for recipient ${recipient}, socket: ${recipientSocketId}`);
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', {
          _id: savedMessage._id,
          sender: savedMessage.sender,
          recipient: savedMessage.recipient,
          content: savedMessage.content,
          mediaUrls: savedMessage.mediaUrls,
          conversationId: savedMessage.conversationId,
          replyTo: savedMessage.replyTo,
          status: 'delivered',
          timestamp: savedMessage.timestamp,
        });
        console.log(`Message delivered to recipient socket: ${recipientSocketId}`);
      } else {
        console.log(`Recipient ${recipient} is not online`);
      }

      // Confirm to sender that message was processed
      socket.emit('message_sent', { 
        messageId: savedMessage._id,
        status: 'delivered',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: error.message });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { sender, recipient } = data;
    const recipientSocketId = userSockets[recipient];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_typing', { sender });
    }
  });

  // Stop typing indicator
  socket.on('stop_typing', (data) => {
    const { sender, recipient } = data;
    const recipientSocketId = userSockets[recipient];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_stop_typing', { sender });
    }
  });

  // Mark message as read
  socket.on('mark_as_read', async (data) => {
    try {
      const { conversationId, userId } = data;
      
      // Update all messages in conversation where this user is the recipient
      const updatedMessages = await Message.updateMany(
        {
          conversationId,
          recipient: userId,
          status: { $ne: 'seen' }
        },
        { status: 'seen' }
      );

      console.log(`Marked ${updatedMessages.modifiedCount} messages as seen`);

      // Get all unique senders in this conversation to notify them
      const messages = await Message.find({ conversationId }).distinct('sender');
      
      // Notify each sender that their messages are now seen
      messages.forEach(senderId => {
        const senderSocketId = userSockets[senderId];
        if (senderSocketId) {
          io.to(senderSocketId).emit('messages_seen', { conversationId });
          console.log(`Notified sender ${senderId} that messages are seen`);
        }
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  // User comes offline
  socket.on('disconnect', () => {
    // Find and remove user from online list
    for (const [userId, socketId] of Object.entries(userSockets)) {
      if (socketId === socket.id) {
        delete userSockets[userId];
        io.emit('user_status_change', { userId, isOnline: false });
        console.log(`User ${userId} is offline`);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));