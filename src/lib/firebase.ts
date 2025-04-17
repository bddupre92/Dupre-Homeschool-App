"use client";
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics;
let auth: Auth;
let storage: FirebaseStorage;

// Only initialize Firebase if we're in a browser environment and it hasn't been initialized already
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  
  // Initialize Analytics only if it's supported
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });

  auth = getAuth(app);
  storage = getStorage(app);
}

export { app, analytics, auth, storage };
