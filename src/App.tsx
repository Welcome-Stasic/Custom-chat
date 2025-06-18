import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { auth, getFCMToken, db } from './firebase';
import { ref, set } from "firebase/database";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        
        setTimeout(async () => {
          const token = await getFCMToken();
          if (token) {
            const userRef = ref(db, `users/${user.uid}`);
            set(userRef, { fcmToken: token });
          }
        }, 1000);
        
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
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