import React, { useState, useEffect, useCallback } from 'react';
import { 
  ref, 
  push, 
  onChildAdded, 
  off, 
  query, 
  limitToLast, 
  get, 
  onValue, 
  set, 
  serverTimestamp,
  onDisconnect
} from "firebase/database";
import { auth, db } from '../firebase';
import Header from '../components/Header';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'partner';
  time: string;
}

const ChatPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [partnerStatus, setPartnerStatus] = useState('был(а) в сети недавно');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [partnerName, setPartnerName] = useState('Пользователь');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        const name = user.email?.split('@')[0] || 'Пользователь';
        setPartnerName(name);
        loadMessages(user.uid);
        setupPresence(user.uid);
      }
    });
    
    return () => {
      unsubscribeAuth();
    };
  }, []);

  const setupPresence = (userId: string) => {
    const userStatusRef = ref(db, `status/${userId}`);
    const connectedRef = ref(db, '.info/connected');
    
    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) return;
      
      set(userStatusRef, {
        state: 'online',
        lastChanged: serverTimestamp()
      });
      
      onDisconnect(userStatusRef).set({
        state: 'offline',
        lastChanged: serverTimestamp()
      });
    });
  };

  useEffect(() => {
    if (!currentUser) return;
    
    const statusRef = ref(db, 'status');
    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      const statuses = snapshot.val() || {};
      
      const onlineUserIds = Object.keys(statuses).filter(
        uid => statuses[uid].state === 'online' && uid !== currentUser.uid
      );
      
      setOnlineUsers(onlineUserIds);
      
      if (onlineUserIds.length > 0) {
        setPartnerStatus('онлайн прямо сейчас');
      } else {
        const otherUsersStatuses = Object.entries(statuses)
          .filter(([uid]) => uid !== currentUser.uid)
          .map(([_, status]) => status);
        
        if (otherUsersStatuses.length > 0) {
          const lastOnline = Math.max(...otherUsersStatuses.map((s: any) => s.lastChanged));
          setPartnerStatus(`был(а) в сети ${formatLastSeen(lastOnline)}`);
        } else {
          setPartnerStatus('был(а) в сети недавно');
        }
      }
    });
    
    return () => {
      unsubscribeStatus();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    
    const typingRef = ref(db, `typing/${currentUser.uid}`);
    
    return () => {
      set(typingRef, false);
    };
  }, [currentUser]);

  const formatLastSeen = useCallback((timestamp: number) => {
    const now = Date.now();
    const diffSeconds = Math.floor((now - timestamp) / 1000);
    
    if (diffSeconds < 60) return 'только что';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds/60)} мин назад`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds/3600)} ч назад`;
    return `${Math.floor(diffSeconds/86400)} дн назад`;
  }, []);

  const loadMessages = (userId: string) => {
    const messagesRef = ref(db, 'messages');
    const recentMessagesQuery = query(messagesRef, limitToLast(100));
    
    const handleNewMessage = (snapshot: any) => {
      const messageData = snapshot.val();
      const isMe = messageData.userId === userId;
      
      setMessages(prev => [...prev, {
        id: snapshot.key!,
        text: messageData.text,
        sender: isMe ? 'me' : 'partner',
        time: formatTime(messageData.timestamp)
      }]);
    };

    get(recentMessagesQuery).then((snapshot) => {
      const loadedMessages: Message[] = [];
      snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        loadedMessages.push({
          id: childSnapshot.key!,
          text: messageData.text,
          sender: messageData.userId === userId ? 'me' : 'partner',
          time: formatTime(messageData.timestamp)
        });
      });
      
      loadedMessages.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setMessages(loadedMessages);
    });

    onChildAdded(messagesRef, handleNewMessage);
    
    return () => {
      off(messagesRef, 'child_added', handleNewMessage);
    };
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const sendNotification = async (messageText: string) => {
    if (!currentUser) return;
    
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      const users = snapshot.val() || {};
      
      const tokens: string[] = [];
      for (const uid in users) {
        if (uid !== currentUser.uid && users[uid].fcmToken) {
          // Отправляем только тем, кто не в сети
          if (!onlineUsers.includes(uid)) {
            tokens.push(users[uid].fcmToken);
          }
        }
      }
      
      if (tokens.length === 0) {
        console.log('Нет токенов для отправки');
        return;
      }
      
      const response = await fetch('https://us-central1-custom-chat-5ef78.cloudfunctions.net/sendNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokens,
          title: partnerName,
          body: messageText,
        }),
      });
      
      if (!response.ok) {
        console.error('Ошибка отправки уведомления');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !currentUser) return;
    
    push(ref(db, 'messages'), {
      text,
      userId: currentUser.uid,
      timestamp: Date.now()
    });
    
    sendNotification(text);
  };

  const handleInputChange = (text: string) => {
    if (!currentUser) return;
    
    const typingRef = ref(db, `typing/${currentUser.uid}`);
    
    if (text.length > 0) {
      set(typingRef, true);
      
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      const timeout = setTimeout(() => {
        set(typingRef, false);
      }, 2000);
      
      setTypingTimeout(timeout);
    } else {
      set(typingRef, false);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    
    const typingRef = ref(db, 'typing');
    const unsubscribeTyping = onValue(typingRef, (snapshot) => {
      const typingData = snapshot.val() || {};
      
      const isSomeoneTyping = Object.keys(typingData)
        .filter(uid => uid !== currentUser.uid)
        .some(uid => typingData[uid]);
      
      setIsTyping(isSomeoneTyping);
    });
    
    return () => {
      unsubscribeTyping();
    };
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      if (currentUser) {
        const typingRef = ref(db, `typing/${currentUser.uid}`);
        set(typingRef, false);
      }
      
      await auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <div className="chat-page">
      <Header 
        onLogout={handleLogout} 
        partnerName={partnerName}
        lastSeen={partnerStatus}
        isOnline={onlineUsers.length > 0}
        isTyping={isTyping}
      />
      
      <div className="chat-messages">
        <div className="chat-messages-container">
          <MessageList messages={messages} />
        </div>
      </div>
      
      <div className="chat-input-container">
        <MessageInput 
          onSend={handleSendMessage} 
          onChange={handleInputChange} 
        />
      </div>
    </div>
  );
};

export default ChatPage;