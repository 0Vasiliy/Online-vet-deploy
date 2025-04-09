const functions = require('firebase-functions');
const twilio = require('twilio');

// Replace these with your actual Twilio credentials
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

// List of admin phone numbers to notify
const ADMIN_PHONE_NUMBERS = [
  '+1234567890', // Replace with actual phone numbers
  '+0987654321'
];

exports.sendSMSNotification = functions.database
  .ref('/posts/{postId}')
  .onCreate((snapshot, context) => {
    const post = snapshot.val();
    const message = `Новая запись на прием:
Клиент: ${post.surname} ${post.name}
Дата: ${post.date}
Время: ${post.time}
Телефон: ${post.phone}`;
    
    // Send SMS to all admin numbers
    const notifications = ADMIN_PHONE_NUMBERS.map(phoneNumber => {
      return client.messages.create({
        body: message,
        to: phoneNumber,
        from: 'YOUR_TWILIO_PHONE_NUMBER' // Replace with your Twilio phone number
      });
    });

    return Promise.all(notifications);
  }); 