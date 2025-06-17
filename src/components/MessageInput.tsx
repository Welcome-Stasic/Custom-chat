import React, { useState, useRef, FormEvent } from 'react';

const MessageInput: React.FC<{ 
  onSend: (text: string) => void;
  onChange?: (text: string) => void;
}> = ({ onSend, onChange }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
      if (onChange) onChange('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-wrapper">
      <input
        ref={inputRef}
        type="text"
        className="chat-input"
        value={text}
        onChange={handleChange}
        placeholder="Сообщение"
        autoFocus
      />
      <button
        type="submit"
        className="chat-send-button"
        disabled={!text.trim()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;