// server.js
const express = require('express');
const admin = require('firebase-admin');
const app = express();
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./path-to-your-service-account-file.json')),
});

app.use(bodyParser.json());

// Endpoint to send push notifications
app.post('/send-fcm', async (req, res) => {
  const { to, notification, data } = req.body;

  try {
    await admin.messaging().send({
      token: to,
      notification,
      data,
    });
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Failed to send notification');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
