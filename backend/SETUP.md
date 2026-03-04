# Backend Setup Guide

## Prerequisites

- Node.js v16 or higher
- MongoDB (Local or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express - Web framework
- socket.io - Real-time socket server
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - Cross-origin resource sharing
- dotenv - Environment variables
- cookie-parser - Parse cookies
- nodemon - Auto-reload during development

### 2. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/chatify

# Or use MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatify?retryWrites=true&w=majority

# JWT Secret (change this to a strong random string)
JWT_SECRET=your_super_secret_key_change_this_in_production

# Node environment
NODE_ENV=development

# Server port
PORT=3000
```

## MongoDB Setup

### Option 1: Local MongoDB

**Windows:**
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and run MongoDB
3. Default: `mongodb://localhost:27017`

**Linux/Mac:**
```bash
# Using Homebrew (Mac)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Using package manager (Linux)
sudo apt-get install mongodb
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/chatify?retryWrites=true&w=majority
   ```
5. Add to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatify?retryWrites=true&w=majority
   ```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Authentication
- `POST /api/auth/signup` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/logout` - Logout user
  - Requires: JWT token

- `GET /api/auth/me` - Get current user
  - Requires: JWT token

### Users
- `GET /api/users/search?query=username` - Search users
  - Requires: JWT token

- `GET /api/users/contacts` - Get user's contacts
  - Requires: JWT token

- `POST /api/users/contacts` - Add a contact
  - Requires: JWT token
  ```json
  {
    "contactId": "user_id"
  }
  ```

- `PUT /api/users/profile` - Update profile
  - Requires: JWT token
  ```json
  {
    "name": "Updated Name",
    "bio": "My bio",
    "profilePicture": "image_url"
  }
  ```

- `GET /api/users/:userId` - Get user details
  - Requires: JWT token

### Messages
- `GET /api/messages/:conversationId` - Get messages
  - Requires: JWT token

- `POST /api/messages/read` - Mark messages as read
  - Requires: JWT token
  ```json
  {
    "conversationId": "id"
  }
  ```

## Testing with cURL

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get user (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Debugging

Enable debug logs by adding to your code:
```javascript
process.env.DEBUG = 'chatify:*';
```

Check console output for:
- MongoDB connection status
- Socket.IO connection events
- API endpoint hits
- Error messages

## Error Handling

Common errors and solutions:

1. **MongoDB Connection Error**
   - Ensure MongoDB server is running
   - Check MONGODB_URI is correct
   - Verify firewall/network access

2. **Port Already in Use**
   - Change PORT in .env
   - Or kill process: `lsof -ti:3000 | xargs kill -9`

3. **JWT Errors**
   - Check JWT_SECRET is set
   - Ensure token is not expired
   - Clear cookies and re-login

4. **CORS Errors**
   - Check frontend URL in cors configuration
   - Verify credentials: true is set

## Production Deployment

### Before Deploying

1. Change `NODE_ENV` to `production`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas (not local)
4. Update CORS origins to production URL
5. Set `secure: true` for cookies

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

### Deploy to Railway/Render

1. Connect GitHub repository
2. Add environment variables
3. Deploy (auto-deploys on push)

## File Structure

```
backend/
├── models/
│   ├── User.js          # User schema
│   ├── Message.js       # Message schema
│   └── Contact.js       # Contact schema
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── userController.js    # User logic
│   └── messageController.js # Message logic
├── routes/
│   ├── auth.js         # Auth endpoints
│   ├── users.js        # User endpoints
│   └── messages.js     # Message endpoints
├── middleware/
│   └── auth.js         # JWT verification
├── server.js           # Main server
├── package.json
├── .env.example
└── .env               # (Create from example)
```

## Support

For issues:
1. Check MongoDB connection
2. Check `.env` configuration
3. Check console for error messages
4. Verify all dependencies installed
