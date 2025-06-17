import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyALVRCMC-Cp-cjdqHg8gQcYw9-rHNh8ELY", 
  authDomain: "custom-chat-5ef78.firebaseapp.com",
  databaseURL: "https://custom-chat-5ef78-default-rtdb.firebaseio.com",
  projectId: "custom-chat-5ef78",
  storageBucket: "custom-chat-5ef78.appspot.com",
  messagingSenderId: "235456257015",
  appId: "1:235456257015:web:b524c82373eff7aa222cf2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const messaging = getMessaging(app);

// Функция для получения FCM токена
export const getFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { 
        vapidKey: "BHy3jzzgsYb9Vyp4U0bWYflduhx3vaWnTbTfnDg__fuTfnasULQWAGb1wljrtDCBFR8-nT23kls_DLRaybPBrV0" // Ваш VAPID Key
      });
      return token;
    }
  } catch (error) {
    console.error('Ошибка получения токена:', error);
  }
  return null;
};