# Homeschool Inspiration & Community App - README

## Overview

The Homeschool Inspiration & Community App is a platform designed to help homeschool parents find inspiration, share resources, and build community. This application allows users to:

- Create and share posts with photos, videos, and PDFs
- Browse a personalized feed of homeschool content
- Filter content by grade level, subject, and homeschool approach
- Create boards to save and organize favorite content
- Add private notes to saved items

## Tech Stack

- **Frontend**: React Native Web (for cross-platform components)
- **Web Framework**: Next.js (for server-side rendering and API routes)
- **Backend**: Cloudflare Workers (for serverless functions)
- **Database**: Cloudflare D1 (SQLite-based)
- **Authentication**: Firebase Authentication
- **Storage**: AWS S3 (for media files)

## Getting Started

### Prerequisites

- Node.js 16+ and npm/pnpm
- Cloudflare account with Workers and D1 enabled
- Firebase project with Authentication enabled
- AWS account with S3 bucket for media storage

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Configure environment variables (see `.env.example`)
4. Initialize the database:
   ```
   wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   ```
5. Start the development server:
   ```
   pnpm dev
   ```

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Deployment Guide](./docs/deployment-guide.md) - Instructions for deploying the application
- [User Guide](./docs/user-guide.md) - Guide for end users on how to use the application
- [Developer Documentation](./docs/developer-documentation.md) - Technical documentation for developers

## Features

### User Authentication
- User registration and login
- Password reset functionality
- Profile management

### Post Creation
- Upload photos, videos, and PDFs
- Add titles and descriptions
- Tag posts with grade levels, subjects, and homeschool approaches

### Home Feed
- Browse posts from the community
- Filter posts by grade, subject, and approach
- Responsive design for all devices

### Boards & Saving
- Create personal boards
- Save posts to boards
- Add private notes to saved items
- Organize and manage saved content

## Future Enhancements

Potential areas for future development:

1. **Search & Explore Functionality**
   - Full-text search for posts
   - Discovery features based on user interests

2. **Engagement Features**
   - Likes, comments, and follows
   - Notifications for user interactions

3. **Mobile Apps**
   - Native mobile apps using React Native
   - Push notifications

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js, React Native Web, and Cloudflare Workers
- Authentication powered by Firebase
- Media storage provided by AWS S3
# Dupre-Homeschool-App
