import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVPeUrWT2uezL7OymvQYfsB2ZVLr1Ll2o",
  authDomain: "mychat-3ad90.firebaseapp.com",
  projectId: "mychat-3ad90",
  storageBucket: "mychat-3ad90.firebasestorage.app",
  messagingSenderId: "400218392415",
  appId: "1:400218392415:web:f091b9a21dc673b9b718ea",
  measurementId: "G-XYVERG255V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
