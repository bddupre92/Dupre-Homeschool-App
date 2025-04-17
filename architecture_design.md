# Homeschool Inspiration & Community App - Architecture Design

## Overview

This document outlines the architecture for the Homeschool Inspiration & Community App MVP, a platform designed to unify content discovery, community support, and organization for U.S. homeschoolers.

## Tech Stack

- **Frontend**: React Native + React Native Web for cross-platform development
- **Backend**: Next.js with API routes deployed on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite-based)
- **Authentication**: Firebase Auth
- **Media Storage**: AWS S3 + CloudFront CDN
- **Search & Feed Ranking**: Algolia
- **Real-time Notifications**: Firebase Cloud Messaging

## Component Structure

### Frontend Components

1. **Authentication Components**
   - Login/Signup Screen
   - Profile Setup Wizard
   - Account Management

2. **Navigation Components**
   - Tab Navigator (Feed, Explore, Boards, Notifications, Profile)
   - Stack Navigator for screen transitions

3. **Feed Components**
   - FeedScreen (main container)
   - PostCard (reusable post display)
   - PostInteractionBar (likes, comments, save)
   - FeedFilter (filter by grade, subject, etc.)

4. **Post Creation Components**
   - PostCreationScreen
   - MediaPicker (photos, videos, PDFs)
   - TagSelector (grade, subject, approach)
   - BoardSelector

5. **Boards Components**
   - BoardsScreen (overview of all boards)
   - BoardDetailScreen (single board view)
   - BoardCreationModal
   - SaveToBoard interface

6. **Search & Explore Components**
   - SearchScreen
   - FilterPanel
   - SearchResults
   - TrendingSection
   - RecentSection

7. **Engagement Components**
   - CommentSection
   - LikeButton
   - FollowButton
   - NotificationsScreen

8. **Profile Components**
   - ProfileScreen
   - UserPosts
   - UserBoards
   - FollowersFollowing
   - ProfileEditScreen

### Backend Components

1. **API Routes**
   - Authentication endpoints
   - User management
   - Post CRUD operations
   - Board CRUD operations
   - Search and filtering
   - Engagement (likes, comments, follows)
   - Notifications

2. **Middleware**
   - Authentication middleware
   - Request validation
   - Error handling
   - Logging

3. **Services**
   - UserService
   - PostService
   - BoardService
   - SearchService
   - NotificationService
   - MediaService

## Database Schema

### Tables

1. **Users**
   ```sql
   CREATE TABLE Users (
     id TEXT PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     displayName TEXT NOT NULL,
     photoURL TEXT,
     state TEXT,
     gradesTeaching TEXT, -- JSON array
     homeschoolApproach TEXT,
     bio TEXT,
     createdAt INTEGER NOT NULL,
     updatedAt INTEGER NOT NULL
   );
   ```

2. **Posts**
   ```sql
   CREATE TABLE Posts (
     id TEXT PRIMARY KEY,
     userId TEXT NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     mediaType TEXT NOT NULL, -- 'image', 'video', 'pdf'
     mediaUrl TEXT NOT NULL,
     grades TEXT, -- JSON array
     subjects TEXT, -- JSON array
     approaches TEXT, -- JSON array
     createdAt INTEGER NOT NULL,
     updatedAt INTEGER NOT NULL,
     FOREIGN KEY (userId) REFERENCES Users(id)
   );
   ```

3. **Boards**
   ```sql
   CREATE TABLE Boards (
     id TEXT PRIMARY KEY,
     userId TEXT NOT NULL,
     name TEXT NOT NULL,
     description TEXT,
     isPrivate INTEGER DEFAULT 0,
     createdAt INTEGER NOT NULL,
     updatedAt INTEGER NOT NULL,
     FOREIGN KEY (userId) REFERENCES Users(id)
   );
   ```

4. **BoardPosts**
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

5. **Likes**
   ```sql
   CREATE TABLE Likes (
     id TEXT PRIMARY KEY,
     userId TEXT NOT NULL,
     postId TEXT NOT NULL,
     createdAt INTEGER NOT NULL,
     FOREIGN KEY (userId) REFERENCES Users(id),
     FOREIGN KEY (postId) REFERENCES Posts(id),
     UNIQUE(userId, postId)
   );
   ```

6. **Comments**
   ```sql
   CREATE TABLE Comments (
     id TEXT PRIMARY KEY,
     userId TEXT NOT NULL,
     postId TEXT NOT NULL,
     content TEXT NOT NULL,
     createdAt INTEGER NOT NULL,
     updatedAt INTEGER NOT NULL,
     FOREIGN KEY (userId) REFERENCES Users(id),
     FOREIGN KEY (postId) REFERENCES Posts(id)
   );
   ```

7. **Follows**
   ```sql
   CREATE TABLE Follows (
     id TEXT PRIMARY KEY,
     followerId TEXT NOT NULL,
     followedId TEXT NOT NULL,
     createdAt INTEGER NOT NULL,
     FOREIGN KEY (followerId) REFERENCES Users(id),
     FOREIGN KEY (followedId) REFERENCES Users(id),
     UNIQUE(followerId, followedId)
   );
   ```

8. **Notifications**
   ```sql
   CREATE TABLE Notifications (
     id TEXT PRIMARY KEY,
     userId TEXT NOT NULL,
     type TEXT NOT NULL, -- 'like', 'comment', 'follow'
     actorId TEXT NOT NULL,
     postId TEXT,
     commentId TEXT,
     read INTEGER DEFAULT 0,
     createdAt INTEGER NOT NULL,
     FOREIGN KEY (userId) REFERENCES Users(id),
     FOREIGN KEY (actorId) REFERENCES Users(id),
     FOREIGN KEY (postId) REFERENCES Posts(id),
     FOREIGN KEY (commentId) REFERENCES Comments(id)
   );
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Users

- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/posts` - Get user posts
- `GET /api/users/:id/boards` - Get user boards
- `GET /api/users/:id/followers` - Get user followers
- `GET /api/users/:id/following` - Get user following

### Posts

- `POST /api/posts` - Create a post
- `GET /api/posts` - Get feed posts
- `GET /api/posts/:id` - Get a specific post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Boards

- `POST /api/boards` - Create a board
- `GET /api/boards` - Get user boards
- `GET /api/boards/:id` - Get a specific board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board
- `POST /api/boards/:id/posts` - Add post to board
- `DELETE /api/boards/:id/posts/:postId` - Remove post from board
- `PUT /api/boards/:id/posts/reorder` - Reorder posts in a board

### Engagement

- `POST /api/posts/:id/like` - Like a post
- `DELETE /api/posts/:id/like` - Unlike a post
- `POST /api/posts/:id/comments` - Comment on a post
- `PUT /api/comments/:id` - Edit a comment
- `DELETE /api/comments/:id` - Delete a comment
- `POST /api/users/:id/follow` - Follow a user
- `DELETE /api/users/:id/follow` - Unfollow a user

### Search & Explore

- `GET /api/search` - Search posts with filters
- `GET /api/explore/trending` - Get trending posts
- `GET /api/explore/recent` - Get recent posts

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

## Data Flow

1. **User Authentication Flow**
   - User registers/logs in via Firebase Auth
   - JWT token is generated and stored
   - User profile data is fetched from D1 database

2. **Feed Generation Flow**
   - User profile preferences determine feed content
   - Posts are fetched from D1 database based on relevance and recency
   - Algolia provides search and filtering capabilities

3. **Post Creation Flow**
   - User uploads media to AWS S3
   - Post metadata is stored in D1 database
   - Post appears in relevant feeds

4. **Engagement Flow**
   - User interactions (likes, comments, follows) are stored in D1
   - Notifications are generated and sent via Firebase
   - Engagement metrics update post visibility in feeds

## Wireframes for Key Screens

### 1. Home Feed Screen
```
+-------------------------------+
|  [Logo]       [Search]  [+]   |
|-------------------------------|
|  [Filter Bar]                 |
|-------------------------------|
|  +---------------------------+|
|  | [User Avatar]  [Username] ||
|  | [Post Image/Video]        ||
|  |                           ||
|  | [Title]                   ||
|  | [Description]             ||
|  |                           ||
|  | [Tags: Grade, Subject]    ||
|  | [Like] [Comment] [Save]   ||
|  +---------------------------+|
|                               |
|  +---------------------------+|
|  | [Next Post]               ||
|  +---------------------------+|
|                               |
+-------------------------------+
| [Feed] [Explore] [Boards] [Profile] |
+-------------------------------+
```

### 2. Post Creation Screen
```
+-------------------------------+
|  [Cancel]           [Post]    |
|-------------------------------|
|  Title:                       |
|  [                          ]|
|                               |
|  Description:                 |
|  [                          ]|
|  [                          ]|
|                               |
|  [+ Add Media]                |
|                               |
|  Grade Level:                 |
|  [Dropdown Selection]         |
|                               |
|  Subject:                     |
|  [Dropdown Selection]         |
|                               |
|  Approach:                    |
|  [Dropdown Selection]         |
|                               |
|  Add to Board:                |
|  [Dropdown Selection]         |
|                               |
+-------------------------------+
```

### 3. Boards Screen
```
+-------------------------------+
|  My Boards        [+ Create]  |
|-------------------------------|
|  +---------------------------+|
|  | [Board Cover]             ||
|  | Board Name                ||
|  | 12 items                  ||
|  +---------------------------+|
|                               |
|  +---------------------------+|
|  | [Board Cover]             ||
|  | Board Name                ||
|  | 5 items                   ||
|  +---------------------------+|
|                               |
|  +---------------------------+|
|  | [Board Cover]             ||
|  | Board Name                ||
|  | 8 items                   ||
|  +---------------------------+|
|                               |
+-------------------------------+
| [Feed] [Explore] [Boards] [Profile] |
+-------------------------------+
```

### 4. Search & Explore Screen
```
+-------------------------------+
|  [Back]  [Search Bar]         |
|-------------------------------|
|  Filters:                     |
|  [Grade] [Subject] [Approach] |
|-------------------------------|
|  Trending                     |
|  +---------------------------+|
|  | [Post Thumbnail]          ||
|  | [Post Thumbnail]          ||
|  | [Post Thumbnail]          ||
|  +---------------------------+|
|                               |
|  Recent                       |
|  +---------------------------+|
|  | [Post Thumbnail]          ||
|  | [Post Thumbnail]          ||
|  | [Post Thumbnail]          ||
|  +---------------------------+|
|                               |
+-------------------------------+
| [Feed] [Explore] [Boards] [Profile] |
+-------------------------------+
```

### 5. Profile Screen
```
+-------------------------------+
|  [Settings]      [Edit Profile]|
|-------------------------------|
|  [Profile Picture]            |
|  [Username]                   |
|  [Bio]                        |
|                               |
|  State: [State]               |
|  Grades: [Grades Teaching]    |
|  Approach: [Homeschool Approach]|
|                               |
|  [Followers] [Following]      |
|-------------------------------|
|  [Posts] | [Boards]           |
|-------------------------------|
|  +---------------------------+|
|  | [Post Thumbnail]          ||
|  | [Post Thumbnail]          ||
|  | [Post Thumbnail]          ||
|  +---------------------------+|
|                               |
+-------------------------------+
| [Feed] [Explore] [Boards] [Profile] |
+-------------------------------+
```

## Performance Considerations

1. **Image Optimization**
   - Resize and compress images on upload
   - Use responsive images for different device sizes
   - Implement lazy loading for feed content

2. **Caching Strategy**
   - Cache feed data locally
   - Implement pull-to-refresh for updated content
   - Use Cloudflare's edge caching for API responses

3. **Offline Support**
   - Store essential data for offline viewing
   - Queue actions (likes, comments) when offline
   - Sync when connection is restored

## Security Considerations

1. **Authentication**
   - Firebase Auth for secure user authentication
   - JWT token validation for API requests
   - Secure storage of tokens on client devices

2. **Data Access**
   - Row-level security in D1 database
   - API authorization checks
   - Private boards visible only to owners

3. **Content Security**
   - Validate and sanitize user inputs
   - Scan uploaded files for malware
   - Implement content moderation for posts and comments

## Scalability Considerations

1. **Database**
   - Indexes on frequently queried fields
   - Pagination for large result sets
   - Efficient query design

2. **API**
   - Rate limiting to prevent abuse
   - Horizontal scaling via Cloudflare Workers
   - Efficient data loading patterns

3. **Media Storage**
   - CDN distribution for media files
   - Separate storage for different media types
   - Tiered storage based on access patterns

## Next Steps

1. Set up the development environment with the chosen tech stack
2. Create the database migrations based on the schema design
3. Implement authentication with Firebase
4. Develop core API endpoints
5. Build the UI components following the wireframes
6. Integrate frontend and backend
7. Implement testing and quality assurance
8. Deploy the MVP
