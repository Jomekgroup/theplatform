# Testing Guide - Frontend & Backend Integration

## Local Testing Setup

### Prerequisites
- Node.js v16+
- PostgreSQL/Supabase database
- Git

### Step 1: Setup Backend

```bash
cd platform-backend
npm install
```

Create `.env` file:
```
DATABASE_URL=postgresql://[your_credentials]@[host]:5432/postgres
PORT=5000
NODE_ENV=development
```

Start backend:
```bash
npm start
# Server running on port 5000
```

### Step 2: Setup Frontend

```bash
npm install
```

Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
# Frontend running on http://localhost:5173
```

### Step 3: Test in Browser

1. Open [http://localhost:5173](http://localhost:5173)
2. Check browser console for errors
3. Test the following features:

## Frontend Testing Checklist

### Home Page
- [ ] Articles load from API
- [ ] Ads display correctly
- [ ] Search functionality works
- [ ] Dark mode toggle works
- [ ] Navigation links work

### Article Page
- [ ] Article content displays
- [ ] Comments load
- [ ] Add comment functionality works
- [ ] Related articles show

### Submit News
- [ ] Form validation works
- [ ] Image upload works
- [ ] Article submission sends to backend
- [ ] Success message appears

### Advertise Page
- [ ] Ad form loads
- [ ] Plan selection works
- [ ] Image uploads work
- [ ] Form submission works

### Admin Dashboard
- [ ] Login authentication works
- [ ] Pending articles list loads
- [ ] Approve/Reject functionality works
- [ ] Edit article functionality works
- [ ] Ads management works

## Backend API Testing

### Using curl

**Get All Articles**
```bash
curl http://localhost:5000/api/articles
```

**Submit Article**
```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "category": "Technology",
    "author": "Test Author",
    "content": "This is test content",
    "excerpt": "Test excerpt",
    "status": "pending"
  }'
```

**Get Pending Articles (Admin)**
```bash
curl http://localhost:5000/api/admin/pending-articles
```

**Approve Article**
```bash
curl -X PATCH http://localhost:5000/api/admin/articles/1/approve \
  -H "Content-Type: application/json" \
  -d '{"isBreaking": false}'
```

**Get Active Ads**
```bash
curl http://localhost:5000/api/ads/active
```

**Submit Ad**
```bash
curl -X POST http://localhost:5000/api/ads \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test Company",
    "email": "test@company.com",
    "plan": "Basic",
    "amount": 100,
    "adHeadline": "Test Ad"
  }'
```

### Using Postman

1. Import the API endpoints:
   - GET /api/articles
   - POST /api/articles
   - GET /api/admin/pending-articles
   - PATCH /api/admin/articles/:id/approve
   - PUT /api/articles/:id
   - DELETE /api/articles/:id
   - GET /api/ads/active
   - POST /api/ads
   - GET /api/admin/ads
   - PATCH /api/admin/ads/:id/approve
   - DELETE /api/ads/:id
   - POST /api/comments
   - GET /api/articles/:id/comments
   - POST /api/support
   - GET /api/admin/support

2. Set base URL to `http://localhost:5000`
3. Test each endpoint with sample data

## Testing Scenarios

### Scenario 1: User Submits News Article
1. Navigate to "Submit News" page
2. Fill in form with test data
3. Upload test image
4. Submit form
5. Verify article appears in pending list (admin)
6. Verify API returns 201 status

### Scenario 2: Admin Approves Article
1. Login to admin panel
2. View pending articles
3. Click approve on test article
4. Verify article appears on home page
5. Verify status changed to 'published' in database

### Scenario 3: User Posts Comment
1. Open published article
2. Fill comment form
3. Submit comment
4. Verify comment appears immediately
5. Verify API returns 201 status

### Scenario 4: Advertiser Submits Ad
1. Navigate to "Advertise" page
2. Fill form with test data
3. Upload image and receipt
4. Submit
5. Verify ad appears in admin pending list

### Scenario 5: Admin Approves Ad
1. Go to admin ads section
2. Approve test ad
3. Verify ad appears on home page
4. Verify status changed to 'active'

## Performance Testing

### Load Testing
Use Apache JMeter or Artillery:

```bash
# Install Artillery
npm install -g artillery

# Create test file: load-test.yml
# Run test
artillery run load-test.yml
```

### Database Query Performance
Monitor slow queries:
```sql
-- In Supabase SQL Editor
SELECT * FROM articles WHERE status = 'published' ORDER BY date DESC;
-- Check execution time
```

## Debugging Tips

### Frontend Console Errors
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Verify API_URL is correct

### Backend Logs
```bash
# Check backend console output
npm start

# Look for errors like:
# - Database connection issues
# - CORS errors
# - Validation errors
```

### Database Issues
```sql
-- Check if tables exist
\dt

-- Check record counts
SELECT COUNT(*) FROM articles;
SELECT COUNT(*) FROM ads;
SELECT COUNT(*) FROM comments;

-- Check for NULL values
SELECT * FROM articles WHERE title IS NULL;
```

## Environment Variables Checklist

### Frontend (.env)
- [ ] VITE_API_URL is set correctly
- [ ] Pointing to correct backend

### Backend (.env)
- [ ] DATABASE_URL is correct
- [ ] NODE_ENV is set appropriately
- [ ] PORT is configured

## CI/CD Testing

When deploying to Render:

1. **Pre-deployment**
   - Run backend tests
   - Verify database connection
   - Check all endpoints

2. **Post-deployment**
   - Test API endpoints on Render URL
   - Verify frontend connects correctly
   - Check CORS configuration
   - Monitor logs for errors

3. **Smoke Tests**
   ```bash
   # Test backend is running
   curl https://your-backend.onrender.com/
   
   # Test API endpoints
   curl https://your-backend.onrender.com/api/articles
   ```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS Error | Check CORS config in backend, add frontend domain |
| API Timeout | Increase timeout in frontend fetch calls |
| 404 on API | Verify endpoint path and HTTP method |
| Database Connection | Check DATABASE_URL, verify credentials |
| Empty Article List | Check articles have status='published' |
| Images Not Loading | Verify image URLs are valid/accessible |
| Cold Start | Upgrade Render plan or use Pro |

## Continuous Testing

For production monitoring:
1. Setup error tracking (Sentry)
2. Monitor API performance
3. Track user interactions
4. Setup alerts for errors
5. Regular backup verification
