import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace placeholders with your actual GCP Config keys
// Project ID is mapped directly to your requested GCP container.
const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_API_KEY_HERE",
  authDomain: "prompt-war-493106.firebaseapp.com",
  projectId: "prompt-war-493106",
  storageBucket: "prompt-war-493106.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijk",
};

// Initialize Google Cloud Firebase instance
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore database and get a reference to the service
export const db = getFirestore(app);

console.log("🔥 GCP Firestore Pipeline Initialized for 'prompt-war-493106'");
