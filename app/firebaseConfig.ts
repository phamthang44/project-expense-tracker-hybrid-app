// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "REDACTED_API_KEY",
  authDomain: "REDACTED_AUTH_DOMAIN",
  projectId: "REDACTED_PROJECT_ID",
  storageBucket: "REDACTED_STORAGE_BUCKET",
  messagingSenderId: "REDACTED_SENDER_ID",
  appId: "REDACTED_APP_ID",
  measurementId: "REDACTED_MEASUREMENT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore with forced long-polling so it works on
// React Native / Android (default WebSocket transport is unsupported).
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { app, db };
