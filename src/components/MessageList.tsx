import React from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'partner';
  time: string;
  status: 'sent' | 'delivered' | 'read'; // Добавлено поле статуса
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`message ${message.sender === 'me' ? 'message-me' : 'message-partner'}`}
        >
          <div className="message-content">
            <div className="message-text">{message.text}</div>
            <div className="message-footer">
              <span className="message-time">{message.time}</span>
              {message.sender === 'me' && (
                <span className={`message-status ${message.status}`}>
                  {message.status === 'sent' && '✓'}
                  {message.status === 'delivered' && '✓✓'}
                  {message.status === 'read' && '✓✓ (прочитано)'}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;