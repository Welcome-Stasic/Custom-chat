import React, { useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'partner';
  time: string;
}

const MessageList: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.sender === 'me' ? 'message-me' : 'message-partner'}`}
        >
          <div>{message.text}</div>
          <div className="message-time">{message.time}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;