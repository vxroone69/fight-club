# Fight Club Backend API

A Node.js/Express backend for the Fight Club tracker application with MongoDB for data persistence.

## Features

- User authentication (register/login with JWT)
- Member management (create, read, update, delete)
- Activity logging per sphere
- Notes management
- Secure API endpoints with token-based authentication

## Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables by updating `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fight-club
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Start the server:
```bash
npm start          # Production
npm run dev        # Development with auto-reload
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Members
All endpoints require JWT token in Authorization header: `Bearer <token>`

- `GET /api/members` - Get all members for user
- `GET /api/members/:id` - Get specific member
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member (spheres, setup status)
- `DELETE /api/members/:id` - Delete member
- `PUT /api/members/:id/log` - Update log entry
- `POST /api/members/:id/notes` - Add note
- `DELETE /api/members/:id/notes/:noteId` - Delete note

## Database Schema

### User
- username (unique)
- email (unique)
- password (hashed)
- displayName
- timestamps

### Member
- userId (reference to User)
- name
- displayName
- spheres (array of sphere objects)
- logs (map of date_sphereId -> boolean)
- notes (array of note objects)
- setupDone (boolean)
- timestamps

## Next Steps

1. Update the React frontend to use these API endpoints
2. Remove localStorage dependency
3. Add error handling and validation
4. Deploy to production (Heroku, AWS, or similar)
