# Render Deployment Configuration

## Backend Setup (platform-backend)

### Step 1: Prepare Repository
1. Ensure `.env` is in `.gitignore`
2. Commit and push code to GitHub

### Step 2: Create Render Service
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `platform-backend` directory (if it's in a monorepo)

### Step 3: Configure Build & Start
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Runtime**: Node.js

### Step 4: Set Environment Variables
In Render Dashboard → Environment:
```
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[database]
NODE_ENV=production
```

Get DATABASE_URL from Supabase:
1. Go to Supabase Dashboard
2. Project Settings → Database → Connection String
3. Copy the PostgreSQL connection string

### Step 5: Deploy
Click "Create Web Service" and Render will automatically deploy.

The backend URL will be: `https://platform-backend-54nn.onrender.com`

## Frontend Setup

### Option A: Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set Environment Variables:
   ```
   VITE_API_URL=https://platform-backend-54nn.onrender.com
   ```
4. Deploy

### Option B: Netlify
1. Go to [Netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Set Environment Variables:
   ```
   VITE_API_URL=https://platform-backend-54nn.onrender.com
   ```
5. Deploy

## Monitoring & Logs

### Render Logs
1. Go to your service in Render Dashboard
2. Click "Logs" to view real-time logs
3. Monitor for errors and performance

### Common Issues

**Cold Start**: Render free tier services sleep after 15 minutes. 
- Solution: Use Render Pro or upgrade to a higher tier

**Database Connection Timeout**:
- Check DATABASE_URL is correct
- Verify Supabase is running
- Check firewall rules

**CORS Errors**:
- Verify frontend domain in CORS config
- Update backend with new frontend domain

## Database Backups

With Supabase:
1. Go to Supabase Dashboard
2. Database → Backups
3. Configure automatic backups (paid plan)

## Scaling

As traffic increases:
1. Monitor CPU and Memory usage in Render
2. Upgrade to higher instance
3. Consider database replication
4. Implement caching strategies

## Security Checklist

- [ ] DATABASE_URL is secure
- [ ] No credentials in code
- [ ] CORS is properly configured
- [ ] Enable HTTPS (Render provides free SSL)
- [ ] Regular security updates
- [ ] Database backups enabled
