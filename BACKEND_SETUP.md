# Fight Club - Full Stack Setup

## Overview

The Fight Club application now has a complete backend integration for storing user data securely. The system consists of:

1. **Frontend** - React + Vite (existing)
2. **Backend** - Node.js/Express + MongoDB
3. **Authentication** - JWT-based user authentication

## Project Structure

```
fight-club/
├── src/              # React frontend
├── backend/          # Node.js/Express backend
├── package.json      # Frontend dependencies
├── vite.config.js    # Vite configuration
└── .env              # Frontend environment variables
```

## Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install

# Update .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/fight-club
# JWT_SECRET=your_secure_secret_key

npm run dev  # Start development server
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
npm install

# Make sure .env has correct API URL
# VITE_API_URL=http://localhost:5000/api

npm run dev  # Start development server
```

Frontend will run on `http://localhost:5173`

## Features

### Authentication
- User registration with email and password
- JWT-based login
- Secure password hashing with bcryptjs
- Token stored in localStorage

### Member Management
- Create and manage members (e.g., varun, vineeth, ashwin)
- Define up to 5 spheres per member
- Track daily progress for each sphere

### Data Persistence
- All data stored in MongoDB
- Automatic syncing between frontend and backend
- Fallback to localStorage if backend is unavailable

### Notes System
- Add notes per member per day
- Optional sphere association
- Delete notes as needed

## API Endpoints

### Auth
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login to existing account
- `GET /api/auth/me` - Get current user (requires token)

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member
- `PUT /api/members/:id/log` - Update daily log
- `POST /api/members/:id/notes` - Add note
- `DELETE /api/members/:id/notes/:noteId` - Delete note

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fight-club
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

## Database Models

### User
- username (unique)
- email (unique)
- password (hashed)
- displayName
- createdAt, updatedAt

### Member
- userId (foreign key)
- name
- displayName
- spheres (array)
- logs (map of date_sphereId -> boolean)
- notes (array)
- setupDone (boolean)
- createdAt, updatedAt

## State Management

The app uses a hybrid approach:
1. **Frontend State** - React useState for UI components
2. **Backend State** - MongoDB for persistent user data
3. **Local Storage** - Fallback for offline capability

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- CORS configured for frontend domain
- Protected API routes with middleware
- Secure headers and error handling

## Development Tips

1. **Testing Auth:**
   - Register new user at login screen
   - Login with created credentials
   - Token is automatically saved

2. **Debugging:**
   - Check browser DevTools Network tab for API calls
   - Check backend console for server logs
   - Verify MongoDB connection in backend logs

3. **Resetting Data:**
   - Clear browser localStorage: DevTools > Application > Clear All
   - Drop MongoDB collection: `db.members.deleteMany({})`

## Deployment

For production deployment:

1. **Backend:**
   - Use MongoDB Atlas (cloud)
   - Deploy to Heroku, AWS, or similar
   - Set production JWT_SECRET
   - Update CORS origins

2. **Frontend:**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or similar
   - Update VITE_API_URL to production backend

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or cloud service is accessible
- Check MONGODB_URI in .env

### API 401 Unauthorized
- Token may have expired
- Clear localStorage and re-login
- Check JWT_SECRET consistency

### CORS Errors
- Verify frontend URL is in backend CORS origins
- Restart backend after changing .env

## Next Steps

- [ ] Add member invitation system
- [ ] Add progress analytics
- [ ] Add email notifications
- [ ] Mobile app
- [ ] Real-time updates with WebSockets
