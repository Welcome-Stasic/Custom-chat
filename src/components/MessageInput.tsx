import React, { useState, useCallback } from 'react';

interface MessageInputProps {
  onSend: (text: string) => void;
  onChange: (text: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, onChange, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setMessage(text);
    onChange(text);
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Напишите сообщение..."
        className="message-input"
        disabled={disabled}
      />
      <button 
        type="submit" 
        className="send-button"
        disabled={!message.trim() || disabled}
      >
        Отправить
      </button>
    </form>
  );
};

export default MessageInput;