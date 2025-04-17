import '@testing-library/jest-dom';

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
jest.mock('../../src/lib/firebase', () => {
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

// Mock Cloudflare context
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

// Mock AWS S3
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => ({
    send: jest.fn(),
  })),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

// Mock React Native Web components
jest.mock('react-native-web', () => {
  const ReactNativeWeb = jest.requireActual('react-native-web');
  return {
    ...ReactNativeWeb,
    Image: 'Image',
    View: 'View',
    Text: 'Text',
    TextInput: 'TextInput',
    TouchableOpacity: 'TouchableOpacity',
    StyleSheet: {
      create: (styles) => styles,
      flatten: jest.fn(),
    },
    ActivityIndicator: 'ActivityIndicator',
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
  };
});

// Global test setup
beforeAll(() => {
  // Setup global mocks or test environment
});

afterAll(() => {
  // Clean up after all tests
});
