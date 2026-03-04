# Chatify Deployment Guide

This guide will help you deploy Chatify to production servers.

## Table of Contents
1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Troubleshooting](#troubleshooting)

---

## Backend Deployment

### Option 1: Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. In the backend directory, run:
   ```bash
   vercel
   ```

3. Follow the prompts and add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string

### Option 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Create a new project and select this repository
4. Add environment variables in the dashboard
5. Railway will automatically deploy when you push to main

### Option 3: Deploy to Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy

### Option 4: Deploy to Heroku

1. Install Heroku CLI and login:
   ```bash
   npm i -g heroku
   heroku login
   ```

2. In the backend directory:
   ```bash
   heroku create chatify-backend
   git push heroku main
   ```

3. Add environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongo_uri
   heroku config:set JWT_SECRET=your_secret_key
   ```

---

## Frontend Deployment

### Option 1: Deploy to Vercel

1. In the frontend directory:
   ```bash
   vercel
   ```

2. During setup, configure environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   VITE_SOCKET_URL=https://your-backend-url.com
   ```

### Option 2: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. In the frontend directory:
   ```bash
   netlify deploy
   ```

3. Update `netlify.toml` with your backend URLs

### Option 3: Deploy to GitHub Pages

1. Update `vite.config.js`:
   ```javascript
   export default {
     base: '/chatify-app/',
     // ... rest of config
   }
   ```

2. Build and deploy:
   ```bash
   npm run build
   gh-pages -d dist
   ```

---

## Environment Configuration

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatify?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_random_string_here_min_32_characters
NODE_ENV=production
PORT=3000
```

### Frontend (.env)

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
```

---

## Database Setup

### MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project and cluster (M0 free tier)
4. Create a database user:
   - Click "Database Access"
   - Add a user with a strong password
   - Give it read/write permissions

5. Whitelist your IP:
   - Click "Network Access"
   - Add IP Address
   - Select "Allow Access from Anywhere" or add specific IPs

6. Get connection string:
   - Click "Clusters" → "Connect"
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>`

### Local MongoDB Setup

If you prefer local MongoDB:

1. Install MongoDB Community: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/chatify`

---

## CORS Configuration

Update your backend `server.js` with your production domain:

```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-frontend-domain.com'
      : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
```

---

## Custom Domain Setup

### For Vercel/Netlify Frontend

1. In your domain registrar DNS settings, add:
   - CNAME record pointing to your Vercel/Netlify domain
   - Or use nameservers provided by the platform

2. Add the domain in your deployment platform's settings

### For Backend

Use the platform's custom domain features or set up a reverse proxy with your domain registrar

---

## Performance Optimization

1. **Enable GZIP Compression** (automatic on most platforms)
2. **Use CDN** for frontend assets
3. **Database Indexes** - Already configured in models
4. **Message expiration** - Automatically deletes after 24 hours
5. **Image Optimization** - Use base64 encoding for smaller files

---

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS/SSL (automatic on Vercel, Netlify, Railway)
- [ ] Set up environment variables (never commit secrets)
- [ ] Enable MongoDB password authentication
- [ ] Configure CORS properly for production domain
- [ ] Update API_BASE_URL to production endpoint
- [ ] Enable rate limiting (optional, use `express-rate-limit`)
- [ ] Set secure cookie options for production

---

## Monitoring & Logging

### Vercel
- View logs in Vercel dashboard
- Set up error tracking via Sentry

### Railway
- Logs available in deployment tab
- Metrics dashboard included

### Render
- Logs in the service dashboard
- Email alerts for deployments

### Heroku
- View logs: `heroku logs --tail`
- Use add-ons for monitoring

---

## Troubleshooting

### WebSocket Connection Failed

**Problem**: "WebSocket connection failed"

**Solution**:
- Ensure VITE_SOCKET_URL points to your backend
- Check backend CORS configuration
- Verify backend is running and accessible

### Messages Not Persisting

**Problem**: Messages disappear or history not loading

**Solution**:
- Check MongoDB connection string is correct
- Verify database has enough storage
- Check for TTL index issues: `db.messages.getIndexes()`

### CORS Errors

**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**:
```javascript
// Update backend server.js CORS origin
origin: ['https://your-domain.com', 'http://localhost:5173']
```

### High Latency/Slow Performance

**Solution**:
- Check MongoDB connection (ping time)
- Ensure backend has enough memory
- Consider upgrading database tier
- Enable compression in frontend build

### Socket.IO Authentication Failed

**Problem**: Socket connection not authenticated

**Solution**:
- Verify JWT token is properly set
- Check token expiration
- Ensure cookies are set to `secure` in production

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Cost Estimates (Monthly)

| Service | Backend | Frontend | Database |
|---------|---------|----------|----------|
| **Free Tier** | $0 | $0 | $0 |
| **Heroku** | $7+ | - | - |
| **Railway** | $5+ | - | - |
| **Vercel** | $0-20 | $0 | - |
| **Netlify** | - | $0 | - |
| **MongoDB Atlas** | - | - | $0 (512MB) |

---

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Railway Documentation](https://railway.app/docs)
- [Render Documentation](https://render.com/docs)
- [Socket.IO Production Guide](https://socket.io/docs/v4/production/)

Happy deploying! 🚀
