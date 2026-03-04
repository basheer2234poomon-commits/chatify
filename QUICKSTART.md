# Quick Start Guide

Get your Chatify real-time chat app running in minutes!

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js v16+ installed
- ✅ MongoDB running locally OR MongoDB Atlas account
- ✅ Git installed

## 5-Minute Setup

### Step 1: Setup Backend (2 minutes)

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env - Add your MongoDB connection
# MONGODB_URI=mongodb://localhost:27017/chatify

# Install dependencies
npm install

# Start backend
npm run dev
```

✅ Backend running on `http://localhost:3000`

### Step 2: Setup Frontend (2 minutes)

In a new terminal window:

```bash
cd frontend

# Copy environment file
cp .env.example .env

# No changes needed to .env for local development

# Install dependencies
npm install

# Start frontend
npm run dev
```

✅ Frontend running on `http://localhost:5173`

### Step 3: Open and Test (1 minute)

1. Open browser: `http://localhost:5173`
2. Click **"Create one"** to sign up
3. Create Account 1:
   ```
   Name: Alice
   Email: alice@test.com
   Username: alice
   Password: password123
   ```

4. After signup, you're logged in! 🎉
5. Logout to create another account
6. Create Account 2:
   ```
   Name: Bob
   Email: bob@test.com
   Username: bob
   Password: password123
   ```

7. Login with Alice's account
8. Search for "bob" in the sidebar search
9. Click "Add" to add as contact
10. Click Bob's contact to start chatting! 💬

## Using the App

### Sidebar
- **Search box** - Find users to add
- **Contact list** - Your contacts
- **Click contact** - Open chat

### Chat Window
- **Type message** - Bottom input box
- **Emoji picker** - Click smile icon 😊
- **Send message** - Click send button
- **Read receipts**:
  - ✓ Sent (to server)
  - ✓✓ Delivered (user came online)
  - ✓✓ Seen (user read the message)

### Features
- 🟢 Green dot = user is online
- ⌨️ "User is typing..." appears while chatting
- 📱 Works on mobile phones
- 🌙 Dark theme WhatsApp-style interface

## MongoDB Setup

### Option A: Local MongoDB (Windows)

1. Download: https://www.mongodb.com/try/download/community
2. Run installer (save as service recommended)
3. MongoDB runs automatically

```env
MONGODB_URI=mongodb://localhost:27017/chatify
```

### Option B: MongoDB Atlas (Cloud - FREE)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (512MB storage)
4. Get connection string from Dashboard
5. Update `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatify?retryWrites=true&w=majority
```

## Stopping the Servers

Press `Ctrl + C` in each terminal window.

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is busy:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error

1. Check MongoDB is running
2. Verify `.env` has correct connection string
3. Check firewall if using MongoDB Atlas
4. Ensure network access in MongoDB Atlas settings

### Cannot Reach Backend from Frontend

1. Ensure backend is running (`npm run dev` in backend folder)
2. Check `.env` in frontend has: `VITE_API_BASE_URL=http://localhost:3000/api`
3. Check browser console (F12) for specific errors

### Blank Screen After Loading

1. Open browser console (F12)
2. Check for JavaScript errors
3. Check Network tab for failed requests
4. Clear browser cache (Ctrl+Shift+Delete)

## File Structure Reminder

```
chatify-app/
├── backend/          # Node.js + Express server
│   ├── server.js    # Main server file
│   └── .env         # Configuration
├── frontend/        # React app
│   ├── src/
│   └── .env        # Configuration
└── README.md       # Full documentation
```

## Next Steps

After getting the app running:

1. **Explore Features**
   - Try sending messages between accounts
   - Test typing indicators
   - Check online/offline status
   - Try emoji support

2. **Customize**
   - Change color theme in CSS files
   - Add more features
   - Modify profile pictures
   - Adjust styling

3. **Deploy** (Optional)
   - Backend: Heroku, Railway, Render
   - Frontend: Vercel, Netlify, GitHub Pages

## Need Help?

- 📖 Read full [README.md](./README.md)
- 🔧 Backend setup: [backend/SETUP.md](./backend/SETUP.md)
- 🎨 Frontend setup: [frontend/SETUP.md](./frontend/SETUP.md)
- 🐛 Check browser console for errors
- 💬 Enable backend console debugging

## 🚀 Ready to Deploy?

Once you've tested locally, deploy your app **for FREE** in 5 minutes!

👉 **[Start with QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Step-by-step deployment guide

Or for detailed info:
📖 **[See HOSTING_GUIDE.md](./HOSTING_GUIDE.md)** - Complete hosting guide with alternatives

## Quick Commands Reference

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Features Included

✨ Real-time messaging with Socket.IO
🔐 User authentication (signup/login)
👥 Contact management
🔍 User search
🟢 Online/offline status
⌨️ Typing indicators
✅ Read receipts
😊 Emoji support
📱 Mobile responsive
🌙 Dark theme UI
💾 Message persistence
🗄️ MongoDB database

---

Happy Chatting! 🚀
