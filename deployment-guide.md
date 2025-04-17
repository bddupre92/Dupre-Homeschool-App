# Homeschool Inspiration & Community App - Deployment Guide

## Overview

This document provides instructions for deploying the Homeschool Inspiration & Community App. The application is built with:

- Next.js for the web application
- React Native Web for cross-platform components
- Firebase Authentication for user management
- Cloudflare Workers for serverless backend
- Cloudflare D1 (SQLite) for database

## Prerequisites

Before deploying, ensure you have:

1. A Cloudflare account with Workers and D1 enabled
2. A Firebase project with Authentication enabled
3. An AWS account with S3 bucket for media storage
4. Node.js 16+ and npm/pnpm installed

## Step 1: Configure Firebase

1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Email/Password authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
3. Create a web app in your Firebase project
4. Copy the Firebase configuration (apiKey, authDomain, etc.)
5. Create a `.env.local` file in the project root with your Firebase config:

```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
```

## Step 2: Configure AWS S3

1. Create an S3 bucket for media storage
2. Configure CORS on the bucket to allow uploads from your domain
3. Create an IAM user with permissions to access the bucket
4. Add AWS credentials to your `.env.local` file:

```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
```

## Step 3: Configure Cloudflare

1. Install Wrangler CLI:
   ```
   npm install -g wrangler
   ```

2. Log in to Cloudflare:
   ```
   wrangler login
   ```

3. Create a D1 database:
   ```
   wrangler d1 create homeschool_db
   ```

4. Update the `wrangler.toml` file with your database ID:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "homeschool_db"
   database_id = "your-database-id"
   ```

## Step 4: Initialize the Database

1. Apply the database migrations:
   ```
   wrangler d1 migrations apply homeschool_db
   ```

## Step 5: Build and Deploy

1. Install dependencies:
   ```
   pnpm install
   ```

2. Build the application:
   ```
   pnpm build
   ```

3. Deploy to Cloudflare Workers:
   ```
   wrangler deploy
   ```

4. Your application will be deployed to a URL like `https://homeschool-app.your-subdomain.workers.dev`

## Step 6: Custom Domain (Optional)

1. Add a custom domain in the Cloudflare Workers dashboard
2. Configure DNS settings to point to your Workers application

## Troubleshooting

### Database Issues

If you encounter database issues:

1. Reset the local database:
   ```
   rm -rf .wrangler/state/v3
   ```

2. Re-apply the migrations:
   ```
   wrangler d1 execute homeschool_db --local --file=migrations/0001_initial.sql
   ```

### Authentication Issues

If users cannot authenticate:

1. Check that Firebase Authentication is properly configured
2. Verify that the Firebase configuration in `.env.local` is correct
3. Ensure that the domain is added to the authorized domains in Firebase Authentication settings

### Deployment Issues

If deployment fails:

1. Check Wrangler logs:
   ```
   wrangler tail
   ```

2. Verify that your Cloudflare account has the necessary permissions
3. Check that your `wrangler.toml` configuration is correct

## Maintenance

### Updating the Application

1. Pull the latest code
2. Install dependencies:
   ```
   pnpm install
   ```

3. Build the application:
   ```
   pnpm build
   ```

4. Deploy to Cloudflare Workers:
   ```
   wrangler deploy
   ```

### Database Migrations

To add new database migrations:

1. Create a new migration file in the `migrations` directory
2. Apply the migration:
   ```
   wrangler d1 migrations apply homeschool_db
   ```

## Support

For additional support, refer to:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Web Documentation](https://necolas.github.io/react-native-web/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
