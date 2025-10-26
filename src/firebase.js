import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBHoLTKp2TY4iEk5EoYKLXSOKwH0aPVvoA",
  authDomain: "collaborative-study-board.firebaseapp.com",
  projectId: "collaborative-study-board",
  storageBucket: "collaborative-study-board.firebasestorage.app",
  messagingSenderId: "306021102256",
  appId: "1:306021102256:web:0fc510d43bfddde53d4175",
  measurementId: "G-FZ52CTR3N1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);