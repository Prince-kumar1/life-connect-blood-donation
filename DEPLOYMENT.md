# 🚀 Deployment Guide

## 🌐 Live Demo
- **Frontend:** https://prince-kumar1.github.io/life-connect-blood-donation
- **Status:** Deployed via GitHub Pages

## 📋 Deployment Steps

### 1. Frontend Deployment (GitHub Pages)
✅ **Automated via GitHub Actions**

The frontend is automatically deployed when you push to the main branch.

**Manual deployment steps:**
```bash
cd client
npm run build
```

### 2. Backend Deployment Options

#### Option A: Render (Recommended - Free)
1. Go to https://render.com
2. Connect your GitHub repository
3. Create new Web Service
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI`: Your Atlas connection string
   - `JWT_SECRET`: Your JWT secret
   - `PORT`: 10000 (Render default)

#### Option B: Railway
1. Go to https://railway.app
2. Connect GitHub repository
3. Deploy backend automatically
4. Add environment variables

#### Option C: Heroku
1. Install Heroku CLI
2. Run deployment commands:
```bash
heroku create life-connect-backend
heroku config:set MONGODB_URI="your_atlas_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
git push heroku main
```

## 🔧 Configuration for Live Deployment

### Update API Base URL
In your React app, update the API base URL to point to your deployed backend:

```javascript
// In client/src/context/AuthContext.js or API config
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.render.com/api'
  : 'http://localhost:5000/api';
```

### Environment Variables for Production
Create these environment variables on your hosting platform:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blooddonor
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
PORT=10000
```

## 🌟 Live URLs
- **Frontend:** https://prince-kumar1.github.io/life-connect-blood-donation
- **Backend:** Deploy to Render/Railway/Heroku
- **Database:** MongoDB Atlas (already configured)

## 📝 Next Steps
1. ✅ Frontend deployed on GitHub Pages
2. 🔄 Deploy backend to Render/Railway
3. 🔗 Update API URLs in frontend
4. 🧪 Test live application
5. 🎉 Share your live project!