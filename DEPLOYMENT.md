# Deployment Guide for Render

## Prerequisites
1. **GitHub Repository**: Push your code to GitHub
2. **MongoDB Atlas**: Set up a free MongoDB Atlas cluster
3. **Render Account**: Sign up at render.com

## Step-by-Step Deployment

### 1. Database Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (use 0.0.0.0/0 for all IPs)
5. Get your connection string

### 2. Deploy to Render
1. Connect your GitHub repository to Render
2. Choose "Web Service"
3. Configure the service:
   - **Name**: `village-identification-api`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Environment Variables
Add these environment variables in Render dashboard:
- `MONGO_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will set this automatically)

### 4. Test Deployment
Once deployed, test these endpoints:
- `https://your-app-name.onrender.com/api/health`
- `https://your-app-name.onrender.com/api/villages`

## Alternative: Using render.yaml
If you prefer automated deployment:
1. Push the `render.yaml` file to your repository
2. Connect to Render using "Infrastructure as Code"
3. Render will automatically create the service and database

## Important Notes
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep may take 30+ seconds to respond
- Consider upgrading to paid tier for production use

## Troubleshooting
- Check Render logs for deployment issues
- Verify MongoDB connection string
- Ensure all environment variables are set correctly
