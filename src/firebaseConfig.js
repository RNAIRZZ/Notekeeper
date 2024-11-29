// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaVqyQ0A8Mh2VT5HEvY9ZyCht9LUsQuuo",
  authDomain: "notekeeper-91062.firebaseapp.com",
  projectId: "notekeeper-91062",
  storageBucket: "notekeeper-91062.firebasestorage.app",
  messagingSenderId: "752606445174",
  appId: "1:752606445174:web:7b612cb96856357e372957",
  measurementId: "G-6SG5GPFNC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Get Firestore instance

export { db };
