# Mindscape Backend (Node.js/Express)

This is the Node.js/Express implementation of the Mindscape backend, migrated from the original Django backend.

## Migration Notes

This backend has been migrated from Django to Node.js/Express while maintaining compatibility with the existing frontend. The migration includes:

- Replacing Django REST Framework with Express.js
- Replacing Django's authentication with Passport.js and JWT
- Replacing Django ORM with Mongoose for MongoDB interaction
- Replacing Django Channels with Socket.io for WebSockets
- Replacing Django Redis with Node Redis for caching and session management

## Dependencies

The Node.js backend uses the following key dependencies:

- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **Passport**: Authentication middleware
- **JWT**: Token-based authentication
- **Socket.io**: WebSockets for real-time communication
- **Redis**: Caching and session storage
- **OpenAI**: AI integration for chat assistance
- **Winston**: Logging
- **Multer**: File uploads
- **Nodemailer**: Email sending

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=8000
   MONGODB_URL=your_mongodb_connection_string
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=3600
   REFRESH_TOKEN_EXPIRATION=604800
   OPENAI_API_KEY=your_openai_api_key
   FRONTEND_URL=http://localhost:8080
   CORS_ORIGIN=http://localhost:8080
   SESSION_SECRET=your_session_secret
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Start the production server:
   ```
   npm start
   ```

## API Endpoints

The API endpoints maintain compatibility with the original Django backend:

- **Authentication**:
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/refresh-token
  - POST /api/auth/forgot-password
  - POST /api/auth/reset-password

- **Users**:
  - GET /api/users/profile
  - PUT /api/users/profile
  - GET /api/users/:id

- **Chat**:
  - GET /api/chat/sessions
  - POST /api/chat/sessions
  - GET /api/chat/sessions/:id
  - POST /api/chat/sessions/:id/messages

- **Booking**:
  - GET /api/booking/slots
  - POST /api/booking/appointments
  - GET /api/booking/appointments
  - GET /api/booking/appointments/:id

- **Resources**:
  - GET /api/resources
  - GET /api/resources/:id
  - POST /api/resources (admin only)
  - PUT /api/resources/:id (admin only)
  - DELETE /api/resources/:id (admin only)

- **Forum**:
  - GET /api/forum/topics
  - POST /api/forum/topics
  - GET /api/forum/topics/:id
  - POST /api/forum/topics/:id/posts
  - PUT /api/forum/posts/:id
  - DELETE /api/forum/posts/:id

- **Analytics**:
  - GET /api/analytics/usage (admin only)
  - GET /api/analytics/sentiment (admin only)
  - GET /api/analytics/engagement (admin only)

## WebSocket Events

WebSocket events are handled through Socket.io:

- **Connection**: 'connection'
- **Chat Message**: 'chat:message'
- **Chat Typing**: 'chat:typing'
- **Notification**: 'notification'
- **Crisis Alert**: 'crisis:alert'

## Testing

Run tests with:
```
npm test
```

## Linting and Formatting

```
npm run lint
npm run format
```