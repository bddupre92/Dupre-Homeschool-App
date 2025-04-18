import '@testing-library/jest-dom';
import React from 'react';

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// Mock Firebase
jest.mock('./src/lib/firebase', () => {
  const auth = {
    currentUser: null,
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  };
  
  return {
    auth,
    db: {},
  };
});

// Conditionally mock Cloudflare context if the module is available
try {
  // Check if the module exists first
  require.resolve('@cloudflare/next-on-pages');
  
  jest.mock('@cloudflare/next-on-pages', () => ({
    getCloudflareContext: jest.fn(() => ({
      env: {
        DB: {
          prepare: jest.fn(() => ({
            bind: jest.fn(() => ({
              all: jest.fn(() => ({ results: [] })),
              first: jest.fn(() => null),
              run: jest.fn(),
            })),
          })),
        },
      },
    })),
  }));
} catch (error) {
  console.log('Cloudflare module not available, skipping mock');
}

// Mock AWS S3
try {
  require.resolve('@aws-sdk/client-s3');
  
  jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn(() => ({
      send: jest.fn(),
    })),
    PutObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
  }));
} catch (error) {
  console.log('AWS S3 module not available, skipping mock');
}

// Mock React Native Web components
try {
  require.resolve('react-native-web');
  
  jest.mock('react-native-web', () => {
    const ReactNativeWeb = jest.requireActual('react-native-web');
    
    // Functional mock for TouchableOpacity
    const MockTouchableOpacity = ({ onPress, children, ...props }) => (
      <button onClick={onPress} {...props}>
        {children}
      </button>
    );

    return {
      ...ReactNativeWeb,
      Image: 'Image',
      View: 'View',
      Text: 'Text',
      TextInput: 'TextInput',
      TouchableOpacity: MockTouchableOpacity,
      StyleSheet: {
        create: (styles) => styles,
        flatten: jest.fn(),
      },
      ActivityIndicator: 'ActivityIndicator',
      ScrollView: 'ScrollView',
      FlatList: 'FlatList',
    };
  });
} catch (error) {
  console.log('React Native Web module not available, skipping mock');
}

// Global test setup
beforeAll(() => {
  // Setup global mocks or test environment
});

afterAll(() => {
  // Clean up after all tests
}); 