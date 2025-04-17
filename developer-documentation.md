# Homeschool Inspiration & Community App - Developer Documentation

## Architecture Overview

The Homeschool Inspiration & Community App is built with a modern tech stack designed for cross-platform compatibility and scalability:

- **Frontend**: React Native Web (for cross-platform components)
- **Web Framework**: Next.js (for server-side rendering and API routes)
- **Backend**: Cloudflare Workers (for serverless functions)
- **Database**: Cloudflare D1 (SQLite-based)
- **Authentication**: Firebase Authentication
- **Storage**: AWS S3 (for media files)

## Project Structure

```
homeschool-app/
├── migrations/            # Database migration files
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── boards/        # Board pages
│   │   ├── create-post/   # Post creation page
│   │   ├── profile/       # User profile page
│   ├── components/        # React components
│   │   ├── Auth/          # Authentication components
│   │   ├── Boards/        # Board-related components
│   │   ├── Feed/          # Feed-related components
│   │   ├── PostCreation/  # Post creation components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   │   ├── firebase.ts    # Firebase configuration
│   │   ├── s3.ts          # AWS S3 configuration
│   ├── test/              # Test files
├── docs/                  # Documentation
├── wrangler.toml          # Cloudflare Workers configuration
```

## Database Schema

The application uses a relational database with the following tables:

### Users Table
```sql
CREATE TABLE Users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  displayName TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
```

### Posts Table
```sql
CREATE TABLE Posts (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  mediaType TEXT NOT NULL,
  mediaUrl TEXT NOT NULL,
  grades TEXT NOT NULL,
  subjects TEXT NOT NULL,
  approaches TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id)
);
```

### Boards Table
```sql
CREATE TABLE Boards (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  isPrivate INTEGER NOT NULL DEFAULT 0,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id)
);
```

### BoardPosts Table
```sql
CREATE TABLE BoardPosts (
  id TEXT PRIMARY KEY,
  boardId TEXT NOT NULL,
  postId TEXT NOT NULL,
  note TEXT,
  position INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  FOREIGN KEY (boardId) REFERENCES Boards(id),
  FOREIGN KEY (postId) REFERENCES Posts(id)
);
```

## API Endpoints

### Authentication

Authentication is handled by Firebase Authentication. The application uses the Firebase SDK for client-side authentication.

### Posts API

- `GET /api/posts` - Get all posts with optional filtering
- `POST /api/posts` - Create a new post
- `GET /api/posts/[id]` - Get a specific post
- `PUT /api/posts/[id]` - Update a post
- `DELETE /api/posts/[id]` - Delete a post

### Boards API

- `GET /api/boards` - Get all boards for a user
- `POST /api/boards` - Create a new board
- `GET /api/boards/[id]` - Get a specific board with its posts
- `PUT /api/boards/[id]` - Update a board
- `DELETE /api/boards/[id]` - Delete a board

### Board Posts API

- `GET /api/boards/[id]/posts` - Get all posts in a board
- `POST /api/boards/[id]/posts` - Add a post to a board
- `DELETE /api/boards/[id]/posts/[postId]` - Remove a post from a board

## Component Architecture

The application follows a component-based architecture with reusable components organized by feature:

### Authentication Components

- `LoginForm` - Handles user login
- `SignupForm` - Handles user registration
- `ForgotPasswordForm` - Handles password reset
- `ProfileForm` - Handles profile management
- `AuthContext` - Provides authentication state to the application

### Post Creation Components

- `MediaUpload` - Handles media file uploads
- `TagSelector` - Allows selection of grades, subjects, and approaches
- `PostCreationForm` - Integrates media upload and tag selection

### Feed Components

- `PostCard` - Displays a post in the feed
- `FilterBar` - Provides filtering options for the feed
- `HomeFeed` - Integrates post cards and filtering

### Boards Components

- `BoardCard` - Displays a board in the boards list
- `BoardsGrid` - Displays a grid of boards
- `BoardCreationModal` - Handles board creation
- `SaveToBoardModal` - Handles saving posts to boards
- `BoardDetail` - Displays board details and saved posts

## State Management

The application uses React's Context API for global state management:

- `AuthContext` - Manages authentication state
- Local component state for UI interactions

## Styling

The application uses a combination of:

- Tailwind CSS for web-specific styling
- React Native StyleSheet for cross-platform components

## Testing

The application includes:

- Manual test plan and results
- Future recommendation for automated testing with Jest and React Testing Library

## Deployment

The application is deployed to Cloudflare Workers with:

- Next.js for server-side rendering
- Cloudflare D1 for database
- Firebase for authentication
- AWS S3 for media storage

## Future Enhancements

Potential areas for future development:

1. **Search & Explore Functionality**
   - Implement full-text search for posts
   - Add discovery features based on user interests

2. **Engagement Features**
   - Add likes, comments, and follows
   - Implement notifications for user interactions

3. **Mobile Apps**
   - Create native mobile apps using React Native
   - Implement push notifications

4. **Content Moderation**
   - Add reporting functionality
   - Implement content moderation tools

5. **Analytics**
   - Track user engagement
   - Analyze popular content and trends

## Conclusion

This developer documentation provides an overview of the Homeschool Inspiration & Community App's architecture, components, and APIs. It serves as a guide for future development and maintenance of the application.
