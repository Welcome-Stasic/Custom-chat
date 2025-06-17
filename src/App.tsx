import React, { useState, useEffect } from 'react';
import './index.css';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { auth, getFCMToken } from './firebase';
import { ref, set } from "firebase/database";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // Сохраняем FCM токен пользователя
        const token = await getFCMToken();
        if (token) {
          const userTokenRef = ref(db, `users/${user.uid}/fcmToken`);
          set(userTokenRef, token);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"></div>
          <p>Загружаем чат...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <ChatPage onLogout={() => auth.signOut()} />
      ) : (
        <LoginPage onLogin={setUser} />
      )}
    </div>
  );
}

export default App;