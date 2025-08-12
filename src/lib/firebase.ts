import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAndxHboFwFy-X2Xk0OBNV7iBthunktmXg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "muj-rotaract-club.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "muj-rotaract-club",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "muj-rotaract-club.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "42382355113",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:42382355113:web:a21bc5b65df649c2f3d7b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
