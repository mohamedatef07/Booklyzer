Book Tracking Application Documentation

## Overview

This is a RESTful API built with Express.js and MongoDB for managing users, books, reading activities, achievements, favorites, and memorizations. The application supports user authentication, role-based access control, and soft deletion. It allows users to track their reading progress, log reading sessions, earn achievements, favorite books, and save memorizations (e.g., quotes or notes from books).

## Project Structure

The project follows a modular structure with separate files for models, controllers, routes, middleware, and utilities.

- /Models: Mongoose schemas and models for MongoDB collections.

  - user.js: user main info
  - book.js: books that user read or added
  - wishlist.js: books the user wants to read later
  - ReadingLog.js: Logs user reading sessions.
  - Achievement.js: Tracks user achievements.
  - Favorite.js: Manages user-favorited books.
  - Memorization.js: Stores user memorizations (e.g., quotes or notes).

- /Controllers: Business logic for handling API requests.

  - userController.js: Handles user auth, profile updates, and reading stats.
  - bookController.js: Manages book creation, editing, deletion, and retrieval.
  - wishlistController.js: Adds, fetches, and removes books from user wishlist.
  - AchievementController.js: Handles achievement-related operations.
  - FavoriteController.js: Manages user favorites.
  - MemorizationController.js: Manages user memorizations.

- /Routes: API route definitions.
  - UserRoute.js: Routes for user management and reading statistics.
  - bookRoute.js: Routes for book operations (add, update, delete, list).
  - wishlistRoute.js: Routes for managing user's wishlist (add, get, remove).
  - AchievementRoute.js, FavoriteRoute.js, MemorizationRoute.js: Routes for respective features (assumed based on controllers).
- /Middlewares: Custom middleware.
  - Authorization.js: Role-based access control.
  - checkOwnership.js: Ensures users can only modify their own data.
- /Utils: Utility functions and classes.
  - ApiError.js: Custom error class for consistent error handling.
  - HandelErr.js: Error handling middleware (asyncWrapper).

## Dependencies

- Express.js: Web framework for Node.js.
- Mongoose: MongoDB object modeling for Node.js.
- jsonwebtoken: For JWT-based authentication.
- bcrypt: For password hashing.
- multer: For handling file uploads (e.g., user photos).
- uuid: For generating unique file names for uploads.
- dotenv: For environment variable management.

## Models

1. ReadingLog
   Tracks user reading sessions.
   Schema:

- user: ObjectId, ref User, required.
- book: ObjectId, ref: Book, required.
- pagesRead: Number, default: 0, min: 0.
- duration: Number, default: 0, min: 0.
- date: Date, default: Date.now

2. Achievement
   Represents user achievements (e.g., reading milestones).
   Schema:

- achievementName: String, required.
- description: String, optional.
- iconUrl: String, optional.
- points: Number, optional.
- level: Number, optional.
- book: ObjectId, ref: Book, optional.
- user: ObjectId, ref: User, required.
- isDeleted: Boolean, default: false.
- createdAt: Date, automatically added via timestamps.

3. Favorite
   Manages user-favorited books.
   Schema:

- book: ObjectId, ref: Book, required.
- user: ObjectId, ref: User, required.
- count: Number, default: 1 (tracks how many times a book is favorited by the user).

4. Memorization
   Stores user memorizations (e.g., quotes or notes from books).
   Schema:

- title: String, required.
- note: String, optional.
- book: ObjectId, ref: Book, required.
- user: ObjectId, ref: User, required.
- dateAdded: Date, default: Date.now.
- isDeleted: Boolean, default: false.

## API Endpoints

Base URL

```
http://localhost:3000

Authentication
```

- All protected routes require a JWT token in the Authorization header: Bearer <token>.
- Tokens are issued via the /user/login endpoint and decoded by the isAuthorize middleware.

1. Achievement Routes (/achievements, assumed)
   Handles user achievements.

---

## | Method | Endpoint | Roles Allowed | Description |

| GET | /get-all | user, admin | Get user achievements |
| POST | /create-achievement | user, admin | Create an achievement |
| PUT | /update-achievement/:id | user, admin | Update an achievement |
| DELETE | /delete-achievement/:id | user, admin | Soft delete an achievement |

---

Request/Response Details:

- GET /get-all
  Request: None
  Response: { success: true, data: [achievements] }
- POST /create-achievement
  Request: { achievementName, description, iconUrl, points, level, book }
  Response: { success: true, data: achievement }
- PUT /update-achievement/:id
  Request: id (param), { achievementName, ... }
  Response: { success: true, data: achievement }
- DELETE /delete-achievement/:id
  Request: id (param)
  Response: { success: true, data: achievement }

Notes:

- Routes are assumed based on AchievementController.js. Adjust the exact paths if different.

2. Favorite Routes (/favorites, assumed)
   Manages user-favorited books.

---

## | Method | Endpoint | Roles Allowed | Description |

| POST | /add-favorite | user, admin | Add a book to favorites |
| GET | /get-favorites | user, admin | Get user favorites |
| DELETE | /remove-favorite/:id | user, admin | Remove a favorite |

---

Request/Response Details:

- POST /add-favorite
  Request: { bookId }
  Response: { success: true, data: favorite }
- GET /get-favorites
  Request: None
  Response: { success: true, count: number, data: [favorites] }
- DELETE /remove-favorite/:id
  Request: id (param)
  Response: { success: true, data: {} }

3. Memorization Routes (/memorizations, assumed)
   Manages user memorizations.

---

| Method | Endpoint                 | Roles Allowed | Description                |
| ------ | ------------------------ | ------------- | -------------------------- |
| POST   | /create-memorization     | user, admin   | Create a memorization      |
| GET    | /get-memorizations       | user, admin   | Get user memorizations     |
| PUT    | /update-memorization/:id | user, admin   | Update a memorization      |
| DELETE | /delete-memorization/:id | user, admin   | Soft delete a memorization |

---

Request/Response Details:

- POST /create-memorization
  Request: { title, note, book }
  Response: { success: true, data: memorization }
- GET /get-memorizations
  Request: None
  Response: { success: true, data: [memorizations] }
- PUT /update-memorization/:id
  Request: id (param), { title, note, ... }
  Response: { success: true, data: memorization }
- DELETE /delete-memorization/:id
  Request: id (param)
  Response: { success: true, data: {} }

## Middleware

1. Authorization Middleware (Authorization.js)

- Purpose: Restricts access to routes based on user roles.
- Implementation:
  - Verifies JWT token from the Authorization header.
  - Sets req.user with { id, Role } from the token.
  - Checks if the user’s role is in the allowed roles.
- Usage: isAuthorize(allowedRoles) (e.g., isAuthorize(["admin"])).

2. Error Handling Middleware (HandelErr.js)

- Purpose: Wraps controller functions to catch errors and pass them to the error handler.
- Implementation:
  - asyncWrapper: Wraps async functions to catch errors and pass them to next.
  - Centralized error handler: Formats errors (e.g., handles ApiError with statusCode and message).

## Utilities

1. ApiError Class (ApiError.js)

- Purpose: Custom error class for consistent error handling.
- Implementation:
  - Constructor: ApiError(message, statusCode).
  - Properties: message, statusCode.
- Usage: Thrown in controllers and caught by asyncWrapper.

## Error Handling

- Errors are handled using the ApiError class.
- Format: { success: false, error: "message" }.
- Common status codes:
- 400: Bad Request (e.g., invalid input).
- 401: Unauthorized (e.g., not allowed to remove a favorite).
- 403: Forbidden (e.g., invalid credentials or role).
- 404: Not Found (e.g., user or resource not found).
- 500: Server Error (e.g., database failure).

## Security

- Password Hashing: Passwords are hashed using bcrypt with a salt factor of 5.
- Authentication: JWT tokens are used for authentication, signed with a secret key (tokenKey).
- Role-Based Access: Three roles (guest, user, admin) with increasing privileges:
- guest: Can register and log in.
- user: Can access reading features (e.g., log reading, view stats).
- admin: Full access (e.g., manage users, view all data).
- File Uploads: User photos are stored in the /Uploads directory with unique filenames generated using uuid.
-
