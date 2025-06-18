const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotification = functions.https.onRequest(async (req, res) => {
  const { tokens, title, body } = req.body;

  if (!tokens || tokens.length === 0) {
    return res.status(400).send("No tokens provided");
  }

  const message = {
    notification: {
      title,
      body,
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("Notifications sent:", response.successCount);
    res.status(200).send("Notifications sent");
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).send(error);
  }
});
