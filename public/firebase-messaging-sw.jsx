// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyAGRBMbkpcKR4haTmBOEPc0y1zZbG-Flfs",
  authDomain: "realtime-chat-b3684.firebaseapp.com",
  projectId: "realtime-chat-b3684",
  storageBucket: "realtime-chat-b3684.firebasestorage.app",
  messagingSenderId: "1015581705326",
  appId: "1:1015581705326:web:c5f80a276101cb5780927f",
  measurementId: "G-00NYP8DHSV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message: ', payload);
  
  const notificationTitle = payload.data.username || "New Message";
  const notificationOptions = {
    body: payload.data.text,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
