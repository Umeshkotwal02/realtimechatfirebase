// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAGRBMbkpcKR4haTmBOEPc0y1zZbG-Flfs",
  authDomain: "realtime-chat-b3684.firebaseapp.com",
  databaseURL: "https://realtime-chat-b3684-default-rtdb.firebaseio.com",
  projectId: "realtime-chat-b3684",
  storageBucket: "realtime-chat-b3684.firebasestorage.app",
  messagingSenderId: "1015581705326",
  appId: "1:1015581705326:web:c5f80a276101cb5780927f",
  measurementId: "G-00NYP8DHSV"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
