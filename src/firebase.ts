import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyALVRCMC-Cp-cjdqHg8gQcYw9-rHNh8ELY", 
  authDomain: "custom-chat-5ef78.firebaseapp.com",
  databaseURL: "https://custom-chat-5ef78-default-rtdb.firebaseio.com",
  projectId: "custom-chat-5ef78",
  storageBucket: "custom-chat-5ef78.appspot.com",
  messagingSenderId: "235456257015",
  appId: "1:235456257015:web:b524c82373eff7aa222cf2"
};

// Инициализируем основное приложение
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Отложенная инициализация Messaging
let messagingInstance: any = null;

export const getMessagingInstance = async () => {
  if (messagingInstance) return messagingInstance;
  
  // Проверяем поддержку браузером
  const isSupportedBrowser = await isSupported();
  if (!isSupportedBrowser) {
    console.warn("Firebase Messaging не поддерживается в этом браузере");
    return null;
  }

  messagingInstance = getMessaging(app);
  return messagingInstance;
};

export const getFCMToken = async () => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { 
        vapidKey: "BHy3jzzgsYb9Vyp4U0bWYflduhx3vaWnTbTfnDg__fuTfnasULQWAGb1wljrtDCBFR8-nT23kls_DLRaybPBrV0"
      });
      console.log("FCM Token:", token);
      return token;
    }
  } catch (error) {
    console.error('Ошибка получения токена:', error);
  }
  return null;
};

export const onTokenRefresh = async (callback: (token: string | null) => void) => {
  const messaging = await getMessagingInstance();
  if (!messaging) return;
  
  return onMessage(messaging, (payload) => {
    if (payload.data && payload.data.type === 'token-refresh') {
      getFCMToken().then(callback);
    }
  });
};