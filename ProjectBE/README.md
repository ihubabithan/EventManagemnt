# Event Management System - Backend

This is the backend service for the Event Management System, built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Event CRUD operations
- File upload support for event images
- JWT-based authentication
- RESTful API design

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- CORS enabled

## Project Structure

```
ProjectBE/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware functions
├── models/        # MongoDB models
├── routes/        # API routes
├── app.js         # Express app setup
└── server.js      # Server entry point
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd ProjectBE
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## Running the Application

To start the development server:

```bash
npm start
```

The server will start running on `http://localhost:5000` by default.

## API Endpoints

- **Auth Routes**:
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - Login user

- **Event Routes**:
  - GET `/api/events` - Get all events
  - POST `/api/events` - Create new event
  - GET `/api/events/:id` - Get specific event
  - PUT `/api/events/:id` - Update event
  - DELETE `/api/events/:id` - Delete event

## Error Handling

The API uses standard HTTP status codes and returns error messages in JSON format:

```json
{
  "error": "Error message description"
}
``` 