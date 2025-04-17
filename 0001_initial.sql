-- Migration number: 0001 	 2025-04-17T12:44:51.000Z
-- Homeschool Inspiration & Community App Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS Boards;
DROP TABLE IF EXISTS BoardPosts;
DROP TABLE IF EXISTS Likes;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Follows;
DROP TABLE IF EXISTS Notifications;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
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

-- Create Posts table
CREATE TABLE IF NOT EXISTS Posts (
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

-- Create Boards table
CREATE TABLE IF NOT EXISTS Boards (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  isPrivate INTEGER DEFAULT 0,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Create BoardPosts table
CREATE TABLE IF NOT EXISTS BoardPosts (
  id TEXT PRIMARY KEY,
  boardId TEXT NOT NULL,
  postId TEXT NOT NULL,
  note TEXT,
  position INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  FOREIGN KEY (boardId) REFERENCES Boards(id),
  FOREIGN KEY (postId) REFERENCES Posts(id)
);

-- Create Likes table
CREATE TABLE IF NOT EXISTS Likes (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  postId TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (postId) REFERENCES Posts(id),
  UNIQUE(userId, postId)
);

-- Create Comments table
CREATE TABLE IF NOT EXISTS Comments (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  postId TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (postId) REFERENCES Posts(id)
);

-- Create Follows table
CREATE TABLE IF NOT EXISTS Follows (
  id TEXT PRIMARY KEY,
  followerId TEXT NOT NULL,
  followedId TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  FOREIGN KEY (followerId) REFERENCES Users(id),
  FOREIGN KEY (followedId) REFERENCES Users(id),
  UNIQUE(followerId, followedId)
);

-- Create Notifications table
CREATE TABLE IF NOT EXISTS Notifications (
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

-- Create indexes for performance
CREATE INDEX idx_posts_userId ON Posts(userId);
CREATE INDEX idx_posts_createdAt ON Posts(createdAt);
CREATE INDEX idx_boards_userId ON Boards(userId);
CREATE INDEX idx_boardposts_boardId ON BoardPosts(boardId);
CREATE INDEX idx_boardposts_postId ON BoardPosts(postId);
CREATE INDEX idx_likes_postId ON Likes(postId);
CREATE INDEX idx_likes_userId ON Likes(userId);
CREATE INDEX idx_comments_postId ON Comments(postId);
CREATE INDEX idx_comments_userId ON Comments(userId);
CREATE INDEX idx_follows_followerId ON Follows(followerId);
CREATE INDEX idx_follows_followedId ON Follows(followedId);
CREATE INDEX idx_notifications_userId ON Notifications(userId);
CREATE INDEX idx_notifications_read ON Notifications(read);
