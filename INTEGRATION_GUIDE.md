# Frontend-Backend Integration Guide

## Overview
This document outlines how the frontend and backend are integrated, and how to work with them locally and in production.

## Environment Configuration

### Frontend Environment Variables
The frontend uses `VITE_API_URL` to configure the backend API endpoint.

**Development (.env):**
```
VITE_API_URL=http://localhost:5000
```

**Production (.env.production):**
```
VITE_API_URL=https://platform-backend-54nn.onrender.com
```

### Backend Environment Variables
The backend requires:
```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
PORT=5000
NODE_ENV=production
```

## API Endpoints

### Articles
- `GET /api/articles` - Get all published articles
- `POST /api/articles` - Submit new article (public)
- `GET /api/admin/pending-articles` - Get pending articles (admin)
- `PATCH /api/admin/articles/:id/approve` - Approve article (admin)
- `PUT /api/articles/:id` - Update article (admin)
- `DELETE /api/articles/:id` - Delete article (admin)

### Advertisements
- `GET /api/ads/active` - Get active ads (public)
- `POST /api/ads` - Submit new ad (public)
- `GET /api/admin/ads` - Get all ads (admin)
- `PATCH /api/admin/ads/:id/approve` - Approve ad (admin)
- `DELETE /api/ads/:id` - Delete ad (admin)

### Comments
- `POST /api/comments` - Post comment on article
- `GET /api/articles/:id/comments` - Get article comments

### Support
- `POST /api/support` - Submit support message
- `GET /api/admin/support` - Get support messages (admin)

## Local Development Setup

### 1. Backend
```bash
cd platform-backend
npm install
npm start
# Backend will run on http://localhost:5000
```

### 2. Frontend
```bash
npm install
npm run dev
# Frontend will run on http://localhost:5173
# Backend URL will be http://localhost:5000
```

## CORS Configuration
The backend has CORS configured to allow:
- `http://localhost:5173` - Vite dev server
- `http://localhost:3000` - Alternative port
- `http://127.0.0.1:5173` - Localhost IP
- `*.vercel.app` - Vercel deployments
- `*.netlify.app` - Netlify deployments

To add more origins in production:
```javascript
// backend_server.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));
```

## Database Schema

### Articles Table
```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT DEFAULT 'Citizen Reporter',
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image TEXT,
  excerpt TEXT,
  content TEXT,
  views INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'published', 'rejected')) DEFAULT 'pending',
  is_breaking BOOLEAN DEFAULT FALSE,
  sub_headline TEXT
);
```

### Ads Table
```sql
CREATE TABLE ads (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan TEXT NOT NULL,
  amount NUMERIC,
  status TEXT CHECK (status IN ('pending', 'active', 'rejected')) DEFAULT 'pending',
  date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  receipt_image TEXT,
  ad_image TEXT,
  ad_content TEXT,
  ad_url TEXT,
  ad_headline TEXT,
  ad_content_file TEXT
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Support Messages Table
```sql
CREATE TABLE support_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'unread'
);
```

## Testing API Endpoints

### Using curl
```bash
# Get all published articles
curl http://localhost:5000/api/articles

# Submit a news article
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","category":"Tech","content":"Test content"}'

# Get active ads
curl http://localhost:5000/api/ads/active
```

### Using Postman
1. Import endpoints from the list above
2. Set base URL to `http://localhost:5000`
3. Test each endpoint with sample data

## Production Deployment

### Backend (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard:
   - `DATABASE_URL` - Supabase connection string
   - `NODE_ENV=production`
4. Deploy with `npm start` command

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set environment variables:
   - `VITE_API_URL=https://platform-backend-54nn.onrender.com`
4. Build command: `npm run build`
5. Deploy

## Troubleshooting

### CORS Errors
**Error:** `Access to XMLHttpRequest blocked by CORS policy`
- Add frontend domain to backend CORS configuration
- Restart backend server

### API Connection Issues
**Error:** `Failed to fetch articles`
- Check if backend is running
- Verify API_URL in frontend environment variables
- Check network connectivity
- Review browser console for detailed error

### Database Connection Issues
**Error:** `Error connecting to database`
- Verify DATABASE_URL is correct
- Check Supabase credentials
- Ensure SSL is enabled
- Verify Render has database access

## Performance Optimizations

1. **Image Optimization**: Use smaller image sizes for thumbnails
2. **API Caching**: Implement caching headers on public endpoints
3. **Database Indexes**: Add indexes to frequently queried columns
4. **Pagination**: Consider adding pagination for article/ad lists

## Security Notes

⚠️ **Important Security Measures:**
1. Never commit `.env` files to version control
2. Use Render's environment variable management for secrets
3. Consider adding rate limiting for API endpoints
4. Implement input validation on all POST endpoints
5. Consider adding authentication for admin endpoints
6. Sanitize user input to prevent XSS attacks

## Migration Notes

When updating either frontend or backend:
1. Test locally first with matching API versions
2. Deploy backend first, then frontend
3. Monitor logs for errors after deployment
4. Use feature flags for major changes
