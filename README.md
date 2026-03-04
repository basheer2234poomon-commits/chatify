# Chatify - Real-Time Chat Web Application

A modern, WhatsApp-style real-time chat web application built with React, Node.js, Express, Socket.IO, and MongoDB.

## Features

✨ **Core Features**
- 🔐 User Authentication (Signup/Login/Logout)
- 💬 Real-time One-to-One Messaging
- 👥 Contact/Friend List Management
- 🔍 User Search Functionality
- 🟢 Online/Offline Status Indicators
- ⌨️ Typing Indicators ("User is typing...")
- ✅ Read Receipts (Sent/Delivered/Seen)
- 😊 Emoji Support
- 📱 Mobile Responsive Design
- 🎨 WhatsApp Web-Style Dark Theme UI

## Tech Stack

### Frontend
- **React 19** - UI Library
- **Vite** - Build Tool
- **Socket.IO Client** - Real-time Communication
- **Axios** - HTTP Client
- **React Router** - Navigation
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime Environment
- **Express** - Web Framework
- **Socket.IO** - WebSocket Server
- **MongoDB** - Database
- **Mongoose** - MongoDB ORM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## Project Structure

```
chatify-app/
├── backend/
│   ├── models/
│   │   ├── User.js          # User Schema
│   │   ├── Message.js       # Message Schema
│   │   └── Contact.js       # Contact Schema
│   ├── controllers/
│   │   ├── authController.js    # Authentication Logic
│   │   ├── userController.js    # User Management Logic
│   │   └── messageController.js # Message Logic
│   ├── routes/
│   │   ├── auth.js         # Auth Routes
│   │   ├── users.js        # User Routes
│   │   └── messages.js     # Message Routes
│   ├── middleware/
│   │   └── auth.js         # JWT Verification
│   ├── server.js           # Main Server File
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx        # Contact List Sidebar
    │   │   ├── ChatWindow.jsx      # Main Chat Area
    │   │   └── ProtectedRoute.jsx  # Route Protection
    │   ├── pages/
    │   │   ├── Login.jsx      # Login Page
    │   │   ├── Signup.jsx     # Signup Page
    │   │   └── Chat.jsx       # Chat Page
    │   ├── context/
    │   │   ├── AuthContext.jsx # Auth State Management
    │   │   └── ChatContext.jsx # Chat State Management
    │   ├── utils/
    │   │   ├── api.js         # API Calls
    │   │   └── socket.js      # Socket.IO Setup
    │   ├── styles/
    │   │   ├── globals.css
    │   │   ├── Login.css
    │   │   ├── Signup.css
    │   │   ├── Chat.css
    │   │   ├── Sidebar.css
    │   │   └── ChatWindow.css
    │   ├── App.jsx            # Main App Component
    │   └── main.jsx           # Entry Point
    ├── package.json
    ├── vite.config.js
    └── .env.example
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or later)
- MongoDB (Local or MongoDB Atlas)
- npm or yarn

### Step 1: Clone and Setup Backend

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install
```

**Update `.env` with your settings:**
```env
MONGODB_URI=mongodb://localhost:27017/chatify
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
PORT=3000
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/chatify?retryWrites=true&w=majority
```

### Step 2: Setup Frontend

```bash
cd frontend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install
```

**No changes needed to `.env.example` for local development:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

## Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

### Option 2: Use npm Concurrently (If Installed)

From root directory:
```bash
npm run dev
```

## Test Accounts

Once the application starts, create test accounts by signing up with:

**Test User 1:**
- Name: John Doe
- Email: john@example.com
- Username: john_doe
- Password: password123

**Test User 2:**
- Name: Jane Smith
- Email: jane@example.com
- Username: jane_smith
- Password: password123

After creating accounts, you can:
1. Login with one account
2. Search for other users by username
3. Add them as contacts
4. Start chatting in real-time

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/search?query=<query>` - Search users
- `GET /api/users/contacts` - Get user contacts
- `POST /api/users/contacts` - Add new contact
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:userId` - Get user by ID

### Messages
- `GET /api/messages/:conversationId` - Get messages
- `POST /api/messages/read` - Mark messages as read

## Socket.IO Events

### Client → Server
- `user_online` - User comes online
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `mark_as_read` - Mark messages as read

### Server → Client
- `receive_message` - Receive a message
- `user_typing` - Another user is typing
- `user_stop_typing` - User stopped typing
- `user_status_changed` - User online/offline status changed
- `messages_read` - Messages marked as read
- `message_sent` - Message sent confirmation
- `error` - Error occurred

## Database Models

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  name: String,
  profilePicture: String,
  bio: String,
  isOnline: Boolean,
  lastSeen: Date,
  contacts: [ObjectId],
  createdAt: Date
}
```

### Message Model
```javascript
{
  sender: ObjectId (ref: User),
  recipient: ObjectId (ref: User),
  content: String,
  status: String (sent/delivered/seen),
  timestamp: Date,
  conversationId: String
}
```

### Contact Model
```javascript
{
  user: ObjectId (ref: User),
  contact: ObjectId (ref: User),
  addedAt: Date
}
```

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ HTTP-only cookies for token storage
- ✅ Input validation and sanitization

## Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start with nodemon
```

**Frontend:**
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview build
npm run lint     # Run ESLint
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or connection string is correct
- Check firewall settings if using MongoDB Atlas
- Verify network access in MongoDB Atlas

### Socket.IO Connection Issues
- Check if backend server is running on port 3000
- Verify CORS settings match frontend URL
- Check browser console for WebSocket errors

### CORS Errors
- Ensure frontend URL is in backend CORS configuration
- Check that credentials are enabled in API calls

### Module Not Found Errors
- Run `npm install` in both frontend and backend directories
- Clear `node_modules` and reinstall if issues persist

## 🚀 Deployment

**Quick Deploy in 5 minutes (FREE):**
👉 **[Follow QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** ← Start here!

### For Detailed Deployment Guide:
📖 **[See HOSTING_GUIDE.md](./HOSTING_GUIDE.md)** for complete instructions:
- Step-by-step setup for MongoDB Atlas, Render, and Vercel
- Alternative hosting options
- Troubleshooting guide
- Scaling options

**Recommended Stack (Free Tier):**
| Component | Platform | Cost |
|-----------|----------|------|
| Frontend | Vercel | Free |
| Backend | Render | Free |
| Database | MongoDB Atlas | Free |
| **Total** | - | **$0/month** ✅ |

## Performance Optimization

- Message pagination for large conversations
- Image optimization for profile pictures
- Connection pooling for database
- Socket.IO reconnection logic
- Lazy loading of contact list

## Future Enhancements

- 📸 Profile picture upload
- 🎵 Voice/Video calls
- 📎 File sharing
- 👥 Group chats
- 🔐 End-to-end encryption
- 🔔 Push notifications
- 🌙 Light/Dark theme toggle
- 🗑️ Message deletion
- 📌 Message pinning
- 🔄 Message reactions

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please create an issue in the repository or contact the development team.

---

Made with ❤️ for real-time communication
