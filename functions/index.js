const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.https.onRequest(async (req, res) => {
  try {
    const { token, title, body } = req.body;
    
    const message = {
      notification: { 
        title: title || 'Новое сообщение',
        body: body || 'У вас новое сообщение в чате'
      },
      token: token,
      webpush: {
        fcmOptions: {
          link: '/'
        },
        notification: {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-96x96.png'
        }
      }
    };
    
    await admin.messaging().send(message);
    res.status(200).send('Уведомление отправлено');
  } catch (error) {
    console.error('Ошибка отправки:', error);
    res.status(500).send('Ошибка отправки уведомления');
  }
});