const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://custom-chat-5ef78-default-rtdb.firebaseio.com"
});

exports.sendNotification = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    const { tokens, title, body } = req.body;

    if (!tokens || tokens.length === 0) {
      return res.status(400).json({ error: "Токены обязательны" });
    }

    const sendPromises = tokens.map(token => {
      const message = {
        notification: {
          title: title || "Новое сообщение",
          body: body || "У вас новое сообщение в чате"
        },
        token: token,
        webpush: {
          fcmOptions: {
            link: "https://custom-chat-5ef78.web.app",
            analyticsLabel: "chat_notification"
          },
          notification: {
            icon: "https://custom-chat-5ef78.web.app/icons/icon-192x192.png",
            badge: "https://custom-chat-5ef78.web.app/icons/badge-96x96.png",
            click_action: "https://custom-chat-5ef78.web.app"
          }
        }
      };
      return admin.messaging().send(message);
    });

    const responses = await Promise.all(sendPromises);
    console.log("Успешно отправлено:", responses.length, "уведомлений");
    return res.status(200).json({ 
      success: true,
      responses 
    });

  } catch (error) {
    console.error("Ошибка:", error);
    return res.status(500).json({ 
      error: "Ошибка отправки",
      details: error.message 
    });
  }
});