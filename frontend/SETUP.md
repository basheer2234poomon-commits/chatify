# Frontend Setup Guide

## Prerequisites

- Node.js v16 or higher
- npm or yarn
- Backend server running on http://localhost:3000

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- react - UI library
- react-dom - DOM rendering
- react-router-dom - Navigation
- socket.io-client - Real-time communication
- axios - HTTP client
- vite - Build tool

### 2. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

For local development, the default `.env` should work:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

For production, update with your deployed backend URL:
```env
VITE_API_BASE_URL=https://your-backend.com/api
VITE_SOCKET_URL=https://your-backend.com
```

## Running the Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx        # Contact list sidebar
│   │   ├── ChatWindow.jsx      # Main chat area
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── pages/
│   │   ├── Login.jsx       # Login page
│   │   ├── Signup.jsx      # Signup page
│   │   └── Chat.jsx        # Chat page
│   ├── context/
│   │   ├── AuthContext.jsx # Auth state
│   │   └── ChatContext.jsx # Chat state
│   ├── utils/
│   │   ├── api.js          # API calls
│   │   └── socket.js       # Socket.IO setup
│   ├── styles/
│   │   ├── globals.css
│   │   ├── Login.css
│   │   ├── Signup.css
│   │   ├── Chat.css
│   │   ├── Sidebar.css
│   │   └── ChatWindow.css
│   ├── App.jsx             # Main app
│   └── main.jsx            # Entry point
├── vite.config.js
├── package.json
├── .env.example
└── index.html
```

## Key Features

### Authentication Pages

**Login Page** (`/login`)
- Email and password login
- Redirects to chat on success
- Error handling with messages

**Signup Page** (`/signup`)
- Create new user account
- Name, email, username, password
- Password confirmation
- Invalid email/username detection

### Chat Interface

**Sidebar**
- List of all contacts
- Search functionality
- Add new users
- Online/offline indicators
- Click to select chat

**Chat Window**
- Real-time message display
- Message input with emoji picker
- Typing indicators
- Read receipts (✓ sent, ✓✓ delivered, ✓✓ seen)
- Auto-scroll to latest message
- User info in header

**Features**
- WhatsApp Web-style dark theme
- Responsive mobile design
- Smooth animations
- Emoji picker
- Real-time updates

## API Integration

### Authentication API
```javascript
// Login
await authAPI.login({ email, password })

// Signup
await authAPI.signup({ name, email, username, password, confirmPassword })

// Logout
await authAPI.logout()

// Get current user
await authAPI.getCurrentUser()
```

### User API
```javascript
// Search users
await userAPI.searchUsers(query)

// Get contacts
await userAPI.getContacts()

// Add contact
await userAPI.addContact(userId)

// Update profile
await userAPI.updateProfile({ name, bio, profilePicture })

// Get user by ID
await userAPI.getUserById(userId)
```

### Message API
```javascript
// Get messages
await messageAPI.getMessages(conversationId)

// Mark as read
await messageAPI.markAsRead(conversationId)
```

## Socket.IO Events

### Outgoing Events (Client → Server)
- `user_online` - Tell server user is online
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `mark_as_read` - Mark messages as read

### Incoming Events (Server → Client)
- `receive_message` - Receive new message
- `user_typing` - Another user is typing
- `user_stop_typing` - User stopped typing
- `user_status_changed` - User online/offline
- `messages_read` - Messages marked as read
- `message_sent` - Message sent confirmation

## State Management

### Auth Context
```javascript
{
  user: User | null,           // Current user
  loading: boolean,            // Loading state
  isAuthenticated: boolean,    // Auth status
  signup: Function,            // Signup method
  login: Function,             // Login method
  logout: Function,            // Logout method
  setUser: Function            // Update user
}
```

### Chat Context
```javascript
{
  selectedContact: User | null,        // Currently selected contact
  setSelectedContact: Function,        // Select contact
  messages: Message[],                 // Chat messages
  addMessage: Function,                // Add message
  clearMessages: Function,             // Clear messages
  updateMessageStatus: Function,       // Update message status
  contacts: User[],                    // User's contacts
  updateContactList: Function,         // Update contacts
  typingUsers: Set,                    // Currently typing
  addTypingUser: Function,             // Add typing user
  removeTypingUser: Function,          // Remove typing user
  onlineUsers: Set,                    // Online users
  setUserOnlineStatus: Function,       // Set online status
  unreadCounts: Object,                // Unread message counts
  setUnreadCounts: Function            // Update unread counts
}
```

## Building for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Source maps (optional)

### Preview Production Build
```bash
npm run preview
```

## Linting

```bash
npm run lint
```

Check code quality and style issues.

## Testing the App

### Create Test Accounts

1. Start the app on `http://localhost:5173`
2. Click "Create one" link to go to signup
3. Create Account 1:
   - Name: Test User 1
   - Email: user1@test.com
   - Username: testuser1
   - Password: password123

4. Create Account 2:
   - Name: Test User 2
   - Email: user2@test.com
   - Username: testuser2
   - Password: password123

### Test Communication

1. Login with Account 1
2. Search for "testuser2"
3. Add as contact
4. Click to open chat
5. Send test messages
6. Open new browser window/tab
7. Login with Account 2
8. Search for "testuser1"
9. Add as contact
10. See real-time messages

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 3000
- Check `.env` has correct API URLs
- Check browser console for CORS errors

### CORS Errors
- Backend CORS should include frontend URL
- Check `http://localhost:5173` is in CORS origins

### Socket.IO Connection Failed
- Check WebSocket is not blocked by firewall
- Verify backend Socket.IO is listening
- Check network tab in DevTools

### Messages Not Sending
- Verify socket connection is established
- Check backend console for errors
- Ensure MongoDB is running

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check CSS file paths

## Performance Tips

- Use production build for deployment
- Enable gzip compression on server
- Optimize images for profile pictures
- Implement message pagination
- Use lazy loading for contacts

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML
- Keyboard navigation support
- ARIA labels where needed
- Color contrast compliance
- Touch-friendly buttons on mobile

## Security Best Practices

- Store tokens securely
- Validate input on client-side
- Use HTTPS in production
- Sanitize user input
- Don't store sensitive data in localStorage

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Add environment variables
5. Deploy

### Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy`
3. Select `dist` folder
4. Add environment variables

### Manual Deployment

1. Build: `npm run build`
2. Upload `dist` folder to hosting
3. Configure environment variables
4. Ensure backend API is accessible

## Support

For issues:
1. Check browser console (F12)
2. Check network tab for failed requests
3. Verify backend is running
4. Check `.env` configuration
5. Clear localStorage and restart
