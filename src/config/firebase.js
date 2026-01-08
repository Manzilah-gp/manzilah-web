import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase config from Step 2
const firebaseConfig = {
apiKey: "AIzaSyAVsepGas0v1J4CTtGxQUelq7c5UaEBYeU",
  authDomain: "manzilah-notifications.firebaseapp.com",
  projectId: "manzilah-notifications",
  storageBucket: "manzilah-notifications.firebasestorage.app",
  messagingSenderId: "987112798700",
  appId: "1:987112798700:web:8ea6458a202e2147b1a8c9",
  measurementId: "G-S2RE9DLLET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { app, db, messaging };