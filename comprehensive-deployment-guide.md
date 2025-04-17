# Comprehensive Deployment Guide for Homeschool Inspiration & Community App

This step-by-step guide will walk you through deploying your Homeschool Inspiration & Community App using either Vercel or Cloudflare, along with Firebase for authentication and AWS S3 for media storage. This guide is designed for beginner coders with detailed instructions for each platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up Firebase](#setting-up-firebase)
3. [Setting Up AWS S3](#setting-up-aws-s3)
4. [Preparing Your Application for Deployment](#preparing-your-application-for-deployment)
5. [Deployment Option 1: Vercel](#deployment-option-1-vercel)
6. [Deployment Option 2: Cloudflare Pages](#deployment-option-2-cloudflare-pages)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, make sure you have:

- A GitHub account (for source code hosting)
- A Firebase account (for authentication)
- An AWS account (for S3 storage)
- A Vercel account or Cloudflare account (for deployment)
- Node.js and npm installed on your local machine
- Git installed on your local machine

## Setting Up Firebase

Firebase will handle user authentication for your application.

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "homeschool-app")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

### Step 2: Set Up Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the "Email/Password" sign-in method by clicking on it and toggling the "Enable" switch
4. Click "Save"
5. (Optional) Enable additional sign-in methods like Google, Facebook, etc.

### Step 3: Get Firebase Configuration

1. Click on the gear icon next to "Project Overview" and select "Project settings"
2. Scroll down to "Your apps" section
3. If you haven't added an app yet, click the web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "homeschool-web")
5. Copy the Firebase configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

6. Save this configuration for later use

## Setting Up AWS S3

AWS S3 will store media files uploaded by users.

### Step 1: Create an S3 Bucket

1. Go to [AWS Management Console](https://aws.amazon.com/console/)
2. Search for "S3" and click on the S3 service
3. Click "Create bucket"
4. Enter a unique bucket name (e.g., "homeschool-app-media")
5. Select your preferred region (choose one close to your target users)
6. Under "Block Public Access settings for this bucket," uncheck "Block all public access" if you want files to be publicly accessible (for media that will be displayed on your site)
7. Acknowledge the warning about making the bucket public
8. Keep other settings as default
9. Click "Create bucket"

### Step 2: Configure CORS for Your Bucket

1. Click on your newly created bucket
2. Go to the "Permissions" tab
3. Scroll down to "Cross-origin resource sharing (CORS)"
4. Click "Edit"
5. Enter the following CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

6. For production, replace `"AllowedOrigins": ["*"]` with your specific domains
7. Click "Save changes"

### Step 3: Create IAM User for S3 Access

1. In the AWS Management Console, search for "IAM" and click on the IAM service
2. Click "Users" in the left sidebar, then "Add users"
3. Enter a username (e.g., "homeschool-app-s3-user")
4. Select "Access key - Programmatic access" as the access type
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Search for "S3" and select "AmazonS3FullAccess" (for development; use more restricted permissions for production)
8. Click "Next: Tags" (optional to add tags)
9. Click "Next: Review"
10. Click "Create user"
11. **IMPORTANT**: Download the CSV file or copy the Access Key ID and Secret Access Key. You will not be able to access the Secret Access Key again after this page.

## Preparing Your Application for Deployment

### Step 1: Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_aws_s3_bucket
```

Replace the placeholder values with your actual Firebase and AWS credentials.

### Step 2: Update Firebase Configuration

1. Open `src/lib/firebase.ts` in your project
2. Update the Firebase configuration to use environment variables:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

### Step 3: Update AWS S3 Configuration

1. Open `src/lib/s3.ts` in your project
2. Update the AWS S3 configuration to use environment variables:

```typescript
import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const bucketName = process.env.AWS_S3_BUCKET || '';
```

### Step 4: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Initialize Git in your project (if not already done):
   ```bash
   git init
   ```
3. Add all files to Git:
   ```bash
   git add .
   ```
4. Commit the changes:
   ```bash
   git commit -m "Prepare for deployment"
   ```
5. Add your GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```
6. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```

## Deployment Option 1: Vercel

Vercel is optimized for Next.js applications and provides a seamless deployment experience.

### Step 1: Sign Up for Vercel

1. Go to [Vercel](https://vercel.com/) and sign up for an account
2. Choose to sign up with GitHub to connect your GitHub account

### Step 2: Import Your GitHub Repository

1. Once logged in, click "Add New..." and select "Project"
2. Select your GitHub repository from the list
3. Vercel will automatically detect that it's a Next.js project

### Step 3: Configure Environment Variables

1. Before deploying, click "Environment Variables"
2. Add all the environment variables from your `.env.local` file:
   - Add each Firebase variable (NEXT_PUBLIC_FIREBASE_*)
   - Add each AWS S3 variable (AWS_*)
3. Make sure to set the environment to "Production" for each variable

### Step 4: Deploy Your Application

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Once deployment is complete, you'll receive a URL for your application (e.g., https://your-app-name.vercel.app)

### Step 5: Set Up Custom Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Click "Settings" and then "Domains"
3. Enter your custom domain and click "Add"
4. Follow the instructions to configure your DNS settings

## Deployment Option 2: Cloudflare Pages

Cloudflare Pages provides hosting with integrated Cloudflare Workers functionality.

### Step 1: Sign Up for Cloudflare

1. Go to [Cloudflare](https://www.cloudflare.com/) and sign up for an account
2. Complete the account setup process

### Step 2: Set Up Cloudflare Pages

1. In the Cloudflare dashboard, click "Pages" in the left sidebar
2. Click "Create a project"
3. Choose "Connect to Git"
4. Connect your GitHub account if not already connected
5. Select your repository from the list

### Step 3: Configure Build Settings

1. Set the production branch to "main" (or your default branch)
2. Set the build command to:
   ```
   npm run build
   ```
3. Set the build output directory to:
   ```
   .next
   ```
4. Under "Environment variables", add all the variables from your `.env.local` file:
   - Add each Firebase variable (NEXT_PUBLIC_FIREBASE_*)
   - Add each AWS S3 variable (AWS_*)

### Step 4: Deploy Your Application

1. Click "Save and Deploy"
2. Cloudflare will build and deploy your application
3. Once deployment is complete, you'll receive a URL for your application (e.g., https://your-app-name.pages.dev)

### Step 5: Set Up D1 Database for Cloudflare

1. In the Cloudflare dashboard, go to "Workers & Pages"
2. Click on "D1" in the left sidebar
3. Click "Create database"
4. Enter a name for your database (e.g., "homeschool-db")
5. Select a location close to your target users
6. Click "Create"

### Step 6: Configure D1 Database with Your Application

1. Go back to your Pages project
2. Click on "Settings" and then "Functions"
3. Under "D1 Database Bindings", click "Add binding"
4. Enter "DB" as the variable name
5. Select your database from the dropdown
6. Click "Save"

### Step 7: Apply Database Migrations

1. Install Wrangler CLI on your local machine:
   ```bash
   npm install -g wrangler
   ```
2. Log in to Cloudflare:
   ```bash
   wrangler login
   ```
3. Apply your database migrations:
   ```bash
   wrangler d1 execute homeschool-db --local --file=migrations/0001_initial.sql
   ```

### Step 8: Set Up Custom Domain (Optional)

1. In your Cloudflare dashboard, go to your Pages project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain name and click "Continue"
5. Follow the instructions to configure your DNS settings

## Post-Deployment Configuration

### Step 1: Configure Firebase Authentication Domains

1. Go to the Firebase Console
2. Select your project
3. Go to "Authentication" and then "Settings"
4. Under "Authorized domains", add your deployment domains:
   - For Vercel: add `your-app-name.vercel.app` and any custom domains
   - For Cloudflare: add `your-app-name.pages.dev` and any custom domains
5. Click "Save"

### Step 2: Test Your Deployed Application

1. Visit your deployed application URL
2. Test the authentication flow (signup, login, password reset)
3. Test media uploads to ensure AWS S3 is working correctly
4. Test all other functionality to ensure everything works as expected

## Troubleshooting

### Firebase Authentication Issues

- **Issue**: Users cannot sign in
  - **Solution**: Check that your Firebase configuration is correct and that you've added your deployment domain to the authorized domains list in Firebase Authentication settings.

- **Issue**: "Firebase App named '[DEFAULT]' already exists" error
  - **Solution**: Ensure your Firebase initialization code only runs once by adding a check:
    ```typescript
    import { getApps, initializeApp } from 'firebase/app';
    
    const firebaseConfig = { /* your config */ };
    
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    ```

### AWS S3 Upload Issues

- **Issue**: Cannot upload files to S3
  - **Solution**: Check your AWS credentials and bucket permissions. Ensure your IAM user has the correct permissions and that your bucket CORS configuration is set up correctly.

- **Issue**: Uploaded files are not publicly accessible
  - **Solution**: Check your bucket policy and make sure "Block all public access" is turned off if you need public access to the files.

### Cloudflare D1 Database Issues

- **Issue**: Database migrations not applying
  - **Solution**: Ensure you're using the correct database name in your Wrangler commands and that your SQL file is properly formatted.

- **Issue**: Cannot connect to database from application
  - **Solution**: Check your D1 database binding in your Cloudflare Pages settings and ensure your application code is using the correct binding name.

### Vercel Deployment Issues

- **Issue**: Build fails
  - **Solution**: Check your build logs for specific errors. Common issues include missing dependencies or environment variables.

- **Issue**: Environment variables not working
  - **Solution**: Ensure you've added all required environment variables in the Vercel project settings and that you're using them correctly in your code.

## Conclusion

Congratulations! You've successfully deployed your Homeschool Inspiration & Community App. Your application is now accessible to users worldwide, with authentication handled by Firebase and media storage by AWS S3.

Remember to regularly update your application with new features and security patches. Both Vercel and Cloudflare offer continuous deployment, so any changes you push to your GitHub repository will automatically be deployed to your live site.

For ongoing maintenance:
- Regularly check your Firebase and AWS dashboards for usage and potential issues
- Monitor your application's performance and user feedback
- Keep your dependencies updated to ensure security and stability

If you encounter any issues not covered in this guide, refer to the official documentation for [Next.js](https://nextjs.org/docs), [Firebase](https://firebase.google.com/docs), [AWS S3](https://docs.aws.amazon.com/s3/), [Vercel](https://vercel.com/docs), or [Cloudflare Pages](https://developers.cloudflare.com/pages/).
